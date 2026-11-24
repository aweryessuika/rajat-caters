/**
 * Label that rolls letter by letter to a fresh copy when its `group` parent is hovered.
 * Pure CSS (off the main thread); Tailwind's hover variant only fires on real hover devices.
 * Screen readers get the plain text once; both visual copies are hidden from them.
 */
export default function RollText({ text, className = "" }: { text: string; className?: string }) {
  const letters = Array.from(text);
  const row = (copy: 0 | 1) => (
    <span aria-hidden="true" className={`flex ${copy === 1 ? "absolute inset-0" : ""}`}>
      {letters.map((ch, i) => (
        <span
          key={i}
          style={{ transitionDelay: `${i * 14}ms` }}
          className={`inline-block transition-transform duration-[420ms] ease-out-expo ${
            copy === 0 ? "group-hover:-translate-y-full" : "translate-y-full group-hover:translate-y-0"
          }`}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
  return (
    <span className={`roll-text relative inline-flex overflow-hidden ${className}`}>
      <span className="sr-only">{text}</span>
      {row(0)}
      {row(1)}
    </span>
  );
}
