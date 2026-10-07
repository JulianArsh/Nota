require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'nota-dev-secret';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ─── Middleware: Auth ────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nota API is running' });
});

// ─── Auth Routes ─────────────────────────────────────────────────────────────

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, username: username || email.split('@')[0] },
    });

    // Auto-create default settings
    await prisma.settings.create({ data: { userId: user.id } });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, username: user.username, avatar: user.avatar } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ─── Profile Routes ──────────────────────────────────────────────────────────

// GET /api/profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, username: true, bio: true, location: true, website: true, favoriteEra: true, avatar: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile
app.put('/api/profile', authMiddleware, async (req, res) => {
  const { username, bio, location, website, favoriteEra, avatar } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { username, bio, location, website, favoriteEra, avatar },
      select: { id: true, email: true, username: true, bio: true, location: true, website: true, favoriteEra: true, avatar: true }
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ─── Settings Routes ─────────────────────────────────────────────────────────

// GET /api/settings
app.get('/api/settings', authMiddleware, async (req, res) => {
  try {
    let settings = await prisma.settings.findUnique({ where: { userId: req.user.id } });
    if (!settings) {
      settings = await prisma.settings.create({ data: { userId: req.user.id } });
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/settings
app.put('/api/settings', authMiddleware, async (req, res) => {
  const { theme, profileVisibility, autoPlay, highQualityAudio, downloadWifiOnly, emailNotifications } = req.body;
  try {
    const settings = await prisma.settings.upsert({
      where: { userId: req.user.id },
      create: { userId: req.user.id, theme, profileVisibility, autoPlay, highQualityAudio, downloadWifiOnly, emailNotifications },
      update: { theme, profileVisibility, autoPlay, highQualityAudio, downloadWifiOnly, emailNotifications },
    });
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ─── Change Password ─────────────────────────────────────────────────────────

// PUT /api/auth/change-password
app.put('/api/auth/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

app.listen(port, () => {
  console.log(`Nota API running on http://localhost:${port}`);
});
