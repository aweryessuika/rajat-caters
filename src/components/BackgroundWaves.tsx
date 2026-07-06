"use client";

export default function BackgroundWaves() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#F9F6F0] overflow-hidden">
      {/* Soft abstract watercolor splashes / cloud washes */}
      <div 
        className="absolute inset-0 opacity-80 mix-blend-multiply"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, #E6DFD3 0%, transparent 40%),
            radial-gradient(circle at 85% 75%, #E6DFD3 0%, transparent 50%),
            radial-gradient(circle at 50% 110%, #E6DFD3 0%, transparent 60%)
          `,
          filter: 'blur(80px)'
        }}
      />
      
      {/* High-end textured linen paper grain */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.15] mix-blend-overlay pointer-events-none">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
