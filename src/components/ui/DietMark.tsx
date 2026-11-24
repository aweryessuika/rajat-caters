/** The Indian veg / non-veg square mark (green or red), with an accessible label. */
export default function DietMark({ veg, className = "" }: { veg: boolean; className?: string }) {
  const label = veg ? "Vegetarian" : "Non-vegetarian";
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-flex size-3.5 shrink-0 items-center justify-center border ${veg ? "border-veg" : "border-nonveg"} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${veg ? "bg-veg" : "bg-nonveg"}`} />
    </span>
  );
}
