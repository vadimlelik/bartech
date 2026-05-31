import { ImageResponse } from 'next/og';

export const alt = 'Texnobar — интернет-магазин техники в рассрочку, Минск';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 55%, #ff4444 140%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#ff4444',
            marginBottom: 24,
          }}
        >
          Texnobar
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 900,
            marginBottom: 28,
          }}
        >
          Техника в рассрочку без переплат
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.4,
            color: 'rgba(255,255,255,0.88)',
            maxWidth: 820,
          }}
        >
          Телефоны, ноутбуки, телевизоры — доставка по Минску и Беларуси
        </div>
        <div
          style={{
            marginTop: 'auto',
            fontSize: 22,
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          technobar.by
        </div>
      </div>
    ),
    { ...size },
  );
}
