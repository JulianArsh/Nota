import { useState, useEffect } from 'react';

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(() => JSON.parse(localStorage.getItem('nota_email') ?? 'true'));
  const [autoPlay, setAutoPlay] = useState(() => JSON.parse(localStorage.getItem('nota_autoplay') ?? 'false'));
  const [highQualityAudio, setHighQualityAudio] = useState(() => JSON.parse(localStorage.getItem('nota_hq_audio') ?? 'true'));
  const [downloadWifiOnly, setDownloadWifiOnly] = useState(() => JSON.parse(localStorage.getItem('nota_wifi_only') ?? 'true'));
  const [theme, setTheme] = useState(() => localStorage.getItem('nota_theme') || 'System');
  const [profileVisibility, setProfileVisibility] = useState(() => localStorage.getItem('nota_visibility') || 'Public');
  const [saved, setSaved] = useState(false);

  // Apply theme immediately
  useEffect(() => {
    if (theme === 'Dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const handleSave = () => {
    localStorage.setItem('nota_email', JSON.stringify(emailNotifications));
    localStorage.setItem('nota_autoplay', JSON.stringify(autoPlay));
    localStorage.setItem('nota_hq_audio', JSON.stringify(highQualityAudio));
    localStorage.setItem('nota_wifi_only', JSON.stringify(downloadWifiOnly));
    localStorage.setItem('nota_theme', theme);
    localStorage.setItem('nota_visibility', profileVisibility);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sectionStyle = {
    backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid rgba(232,220,196,0.8)',
    padding: '2rem', boxShadow: '0 4px 16px rgba(75,46,43,0.04)'
  };
  
  const headingStyle = {
    fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.25rem', fontWeight: 700,
    color: '#2C1B1A', marginBottom: '1.5rem'
  };

  const rowStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem'
  };

  const titleStyle = { fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#4B2E2B' };
  const descStyle = { fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#8E736E', marginTop: '0.25rem', maxWidth: '80%' };
  const selectStyle = {
    padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(232,220,196,1)',
    backgroundColor: '#FAFAF9', fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#2C1B1A',
    outline: 'none', cursor: 'pointer'
  };

  return (
    <div style={{ maxWidth: '44rem', margin: '4rem auto', padding: '0 1.5rem', paddingBottom: '6rem' }}>
      <h1 style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '2.5rem', fontWeight: 800,
        color: '#2C1B1A', marginBottom: '0.5rem', letterSpacing: '-0.03em'
      }}>Settings</h1>
      <p style={{ fontFamily: '"Inter", sans-serif', color: '#6E544F', marginBottom: '2.5rem' }}>
        Manage your preferences, account settings, and audio playback options.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Account & Billing */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>Account & Billing</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', ...titleStyle, marginBottom: '0.5rem' }}>Email Address</label>
            <input
              type="email"
              value="eleanor.v@example.com"
              disabled
              style={{
                width: '100%', padding: '0.875rem 1rem', borderRadius: '0.5rem',
                border: '1px solid rgba(232,220,196,1)', backgroundColor: '#F0EBE1',
                fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: '#6E544F',
                outline: 'none', cursor: 'not-allowed'
              }}
            />
          </div>

          <div style={rowStyle}>
            <div>
              <div style={titleStyle}>Nota Premium Subscription</div>
              <div style={descStyle}>Renews on Nov 12, 2026. Includes lossless audio and full archive access.</div>
            </div>
            <button 
              onClick={() => alert("Redirecting to Stripe Billing Portal...")}
              style={{
                padding: '0.625rem 1.25rem', backgroundColor: '#F0EBE1', color: '#4B2E2B',
                border: '1px solid rgba(232,220,196,1)', borderRadius: '0.5rem', cursor: 'pointer',
                fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem'
              }}
            >Manage Billing</button>
          </div>

          <button 
            onClick={() => alert("A password reset link has been sent to eleanor.v@example.com.")}
            style={{
              padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: '#4B2E2B',
              border: '1px solid rgba(75,46,43,0.3)', borderRadius: '0.5rem', cursor: 'pointer',
              fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem'
            }}
          >Change Password</button>
        </section>

        {/* Preferences */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>App Preferences</h2>

          <div style={rowStyle}>
            <div>
              <div style={titleStyle}>Appearance Theme</div>
              <div style={descStyle}>Choose how Nota looks to you.</div>
            </div>
            <select value={theme} onChange={e => setTheme(e.target.value)} style={selectStyle}>
              <option value="System">System Default</option>
              <option value="Light">Light (Parchment)</option>
              <option value="Dark">Dark (Concert Hall)</option>
            </select>
          </div>
          
          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <div>
              <div style={titleStyle}>Profile Visibility</div>
              <div style={descStyle}>Control who can see your saved libraries and favorite composers.</div>
            </div>
            <select value={profileVisibility} onChange={e => setProfileVisibility(e.target.value)} style={selectStyle}>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Friends">Friends Only</option>
            </select>
          </div>
        </section>

        {/* Playback & Audio */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>Playback & Audio</h2>

          <div style={rowStyle}>
            <div>
              <div style={titleStyle}>Autoplay next track</div>
              <div style={descStyle}>Automatically play the next movement or related piece.</div>
            </div>
            <input type="checkbox" checked={autoPlay} onChange={() => setAutoPlay(!autoPlay)} style={{ transform: 'scale(1.5)', accentColor: '#C08552' }} />
          </div>

          <div style={rowStyle}>
            <div>
              <div style={titleStyle}>High-Quality Audio</div>
              <div style={descStyle}>Stream lossless audio when available (uses more data).</div>
            </div>
            <input type="checkbox" checked={highQualityAudio} onChange={() => setHighQualityAudio(!highQualityAudio)} style={{ transform: 'scale(1.5)', accentColor: '#C08552' }} />
          </div>

          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <div>
              <div style={titleStyle}>Download over Wi-Fi only</div>
              <div style={descStyle}>Save cellular data by restricting offline downloads to Wi-Fi.</div>
            </div>
            <input type="checkbox" checked={downloadWifiOnly} onChange={() => setDownloadWifiOnly(!downloadWifiOnly)} style={{ transform: 'scale(1.5)', accentColor: '#C08552' }} />
          </div>
        </section>

        {/* Notifications */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>Notifications</h2>
          
          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <div>
              <div style={titleStyle}>Email Digest</div>
              <div style={descStyle}>Receive a weekly summary of new recordings and analyses.</div>
            </div>
            <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} style={{ transform: 'scale(1.5)', accentColor: '#C08552' }} />
          </div>
        </section>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'flex-end', paddingTop: '1rem' }}>
          {saved && (
            <span style={{
              fontFamily: '"Inter", sans-serif', fontSize: '0.875rem',
              color: '#388E3C', fontWeight: 600,
              animation: 'fadeSlideUp 0.3s ease'
            }}>✓ Settings saved</span>
          )}
          <button onClick={handleSave} style={{
            padding: '0.875rem 2.5rem', backgroundColor: '#C08552', color: '#fff',
            border: 'none', borderRadius: '9999px', cursor: 'pointer',
            fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(192,133,82,0.25)'
          }}>Save Settings</button>
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
