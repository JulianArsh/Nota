import { useState } from 'react';

export default function Profile() {
  const [username, setUsername] = useState(() => localStorage.getItem('nota_username') || 'Eleanor V.');
  const [bio, setBio] = useState(() => localStorage.getItem('nota_bio') || 'Classical music enthusiast. I love Mahler and Debussy.');
  const [location, setLocation] = useState(() => localStorage.getItem('nota_location') || 'London, UK');
  const [website, setWebsite] = useState(() => localStorage.getItem('nota_website') || 'https://eleanor-listens.co');
  const [favoriteEra, setFavoriteEra] = useState(() => localStorage.getItem('nota_era') || 'Late Romantic');
  const [avatar, setAvatar] = useState('E');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('nota_username', username);
    localStorage.setItem('nota_bio', bio);
    localStorage.setItem('nota_location', location);
    localStorage.setItem('nota_website', website);
    localStorage.setItem('nota_era', favoriteEra);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = {
    width: '100%', padding: '0.875rem 1rem', borderRadius: '0.5rem',
    border: '1px solid rgba(232,220,196,1)', backgroundColor: '#FAFAF9',
    fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: '#2C1B1A',
    outline: 'none', transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontFamily: '"Public Sans", sans-serif', fontWeight: 600,
    fontSize: '0.875rem', color: '#4B2E2B', marginBottom: '0.5rem'
  };

  return (
    <div style={{ maxWidth: '44rem', margin: '4rem auto', padding: '0 1.5rem', paddingBottom: '6rem' }}>
      <h1 style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '2.5rem', fontWeight: 800,
        color: '#2C1B1A', marginBottom: '0.5rem', letterSpacing: '-0.03em'
      }}>Profile</h1>
      <p style={{ fontFamily: '"Inter", sans-serif', color: '#6E544F', marginBottom: '2.5rem' }}>
        Manage your public profile and how you appear to others in the Nota community.
      </p>

      <div style={{
        backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid rgba(232,220,196,0.8)',
        padding: '2.5rem', boxShadow: '0 4px 16px rgba(75,46,43,0.04)'
      }}>
        {/* Avatar Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{
            width: '6rem', height: '6rem', borderRadius: '50%',
            backgroundColor: '#C08552', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '2.5rem', fontWeight: 700, fontFamily: '"Public Sans", sans-serif',
          }}>
            {avatar}
          </div>
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
              <button style={{
                padding: '0.625rem 1.25rem', backgroundColor: '#4B2E2B', color: '#FFF8F0',
                border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
                fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem'
              }}>Change Avatar</button>
              <button style={{
                padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: '#D32F2F',
                border: '1px solid rgba(211,47,47,0.3)', borderRadius: '0.5rem', cursor: 'pointer',
                fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem'
              }}>Remove</button>
            </div>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#8E736E', margin: 0 }}>
              Recommended: Square image, at least 400x400px.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Username Section */}
          <div>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>
          {/* Location Section */}
          <div>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={inputStyle}
              placeholder="e.g. Vienna, Austria"
            />
          </div>
        </div>

        {/* Bio Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Website Section */}
          <div>
            <label style={labelStyle}>Website / Social Link</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              style={inputStyle}
              placeholder="https://"
            />
          </div>
          {/* Favorite Era Section */}
          <div>
            <label style={labelStyle}>Favorite Era</label>
            <select
              value={favoriteEra}
              onChange={e => setFavoriteEra(e.target.value)}
              style={{ ...inputStyle, appearance: 'auto' }}
            >
              <option value="Baroque">Baroque</option>
              <option value="Classical">Classical</option>
              <option value="Romantic">Romantic</option>
              <option value="Late Romantic">Late Romantic</option>
              <option value="20th Century">20th Century</option>
              <option value="Contemporary">Contemporary</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(232,220,196,0.5)', paddingTop: '2rem' }}>
          {saved && (
            <span style={{
              fontFamily: '"Inter", sans-serif', fontSize: '0.875rem',
              color: '#388E3C', fontWeight: 600,
              animation: 'fadeSlideUp 0.3s ease'
            }}>✓ Profile saved successfully</span>
          )}
          <button onClick={handleSave} style={{
            padding: '0.875rem 2.5rem', backgroundColor: '#C08552', color: '#fff',
            border: 'none', borderRadius: '9999px', cursor: 'pointer',
            fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(192,133,82,0.25)'
          }}>Save Profile</button>
        </div>
      </div>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
