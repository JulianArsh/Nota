// =====================================================
// YouTube Service — IFrame API adapter with fallback
// =====================================================

let apiLoaded = false;
let apiLoading = false;
const queue = [];

function loadYouTubeAPI() {
  if (apiLoaded) return Promise.resolve();
  if (apiLoading) return new Promise(r => queue.push(r));

  apiLoading = true;
  return new Promise((resolve) => {
    queue.push(resolve);
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      apiLoaded = true;
      apiLoading = false;
      queue.forEach(r => r());
      queue.length = 0;
    };
  });
}

/**
 * Create a YouTube player in a given DOM element.
 * Returns a controller object { play, pause, seekTo, getCurrentTime, destroy }
 * or null on error (so caller can show fallback).
 */
export async function createYouTubePlayer(elementId, videoId, { onReady, onStateChange, onError } = {}) {
  try {
    await loadYouTubeAPI();

    return new Promise((resolve) => {
      const player = new window.YT.Player(elementId, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e) => {
            onReady?.(e);
            resolve({
              play: () => player.playVideo(),
              pause: () => player.pauseVideo(),
              seekTo: (s) => player.seekTo(s, true),
              getCurrentTime: () => player.getCurrentTime(),
              destroy: () => player.destroy(),
            });
          },
          onStateChange: (e) => onStateChange?.(e),
          onError: (e) => {
            onError?.(e);
            resolve(null);
          },
        },
      });
    });
  } catch (err) {
    console.warn('[YouTubeService] Failed to load player:', err);
    onError?.(err);
    return null;
  }
}

export const YT_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};
