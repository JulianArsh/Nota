// =====================================================
// API Service — returns mock data in dev, real API in prod
// =====================================================
import { pieces, recordings, savedPieceIds, annotations } from '../data/mockData';

let savedIds = new Set(savedPieceIds);

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const apiService = {
  async getPieces(filters = {}) {
    await delay();
    let result = [...pieces];
    if (filters.genre && filters.genre !== 'All Forms') {
      result = result.filter(p =>
        p.genre.toLowerCase().includes(filters.genre.toLowerCase()) ||
        p.instrumentation.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }
    if (filters.era && filters.era !== 'All Eras') {
      result = result.filter(p => p.era === filters.era);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.composer.toLowerCase().includes(q) ||
          p.opus.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result.map(p => ({ ...p, saved: savedIds.has(p.id) }));
  },

  async getPiece(id) {
    await delay(200);
    const piece = pieces.find(p => p.id === id);
    if (!piece) throw new Error('Piece not found');
    return { ...piece, saved: savedIds.has(piece.id) };
  },

  async getRecording(id) {
    await delay(200);
    const recording = recordings[id];
    if (!recording) throw new Error('Recording not found');
    return recording;
  },

  async getRecordingsForPiece(pieceId) {
    await delay(200);
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return [];
    return piece.recordings.map(rid => recordings[rid]).filter(Boolean);
  },

  async getSyncPoints(recordingId) {
    await delay(150);
    const recording = recordings[recordingId];
    return recording?.syncPoints || [];
  },

  async getAnnotation(measureId, level = 'beginner') {
    await delay(100);
    const ann = annotations[measureId];
    if (!ann) return null;
    return ann[level] || ann.beginner;
  },

  async getLibrary() {
    await delay(300);
    return pieces
      .filter(p => savedIds.has(p.id))
      .map(p => ({ ...p, saved: true }));
  },

  async savePiece(id) {
    await delay(200);
    savedIds.add(id);
    return { saved: true };
  },

  async unsavePiece(id) {
    await delay(200);
    savedIds.delete(id);
    return { saved: false };
  },

  async searchPieces(query) {
    return this.getPieces({ query });
  },
};
