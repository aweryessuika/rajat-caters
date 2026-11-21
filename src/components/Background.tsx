/** Static, GPU-cheap paper wash: gradients only, plus one tiled grain image. */
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-paper">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(60% 50% at 12% 18%, rgba(230, 218, 196, 0.75) 0%, transparent 70%),
            radial-gradient(55% 55% at 90% 80%, rgba(230, 218, 196, 0.7) 0%, transparent 70%),
            radial-gradient(70% 40% at 50% 112%, rgba(224, 207, 170, 0.45) 0%, transparent 70%)
          `,
        }}
      />
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-multiply" />
    </div>
  );
}
