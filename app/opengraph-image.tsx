import { ImageResponse } from 'next/og';

// Preview card shown when the link is shared on LinkedIn and other networks.
export const alt = 'Pedro Fernandes · AI & Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 72,
          background: '#0a0909',
          color: '#edebe8',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 90,
            top: 70,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #1a1715 0%, #0a0909 62%)',
            boxShadow: '0 0 0 2px rgba(255,91,20,0.55), 0 0 120px 10px rgba(255,91,20,0.35)',
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', fontSize: 26, color: '#8d8985', fontFamily: 'monospace' }}>
          <span style={{ color: '#ff5b14', marginRight: 14 }}>›</span> who is Pedro Fernandes?
        </div>
        <div style={{ display: 'flex', fontSize: 92, fontWeight: 600, letterSpacing: -3, marginTop: 24, lineHeight: 1 }}>
          AI & Software Engineer.
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#8d8985', marginTop: 22 }}>
          UI/UX-minded. Building scalable, secure, intelligent systems.
        </div>
      </div>
    ),
    size,
  );
}
