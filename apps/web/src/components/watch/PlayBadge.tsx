type PlayBadgeProps = {
  label: string;
  size?: "md" | "lg";
};

export function PlayBadge({ label, size = "md" }: PlayBadgeProps) {
  const dims = size === "lg" ? "h-[4.5rem] w-[4.5rem] text-[1.375rem]" : "h-16 w-16 text-xl";

  return (
    <span
      className={`pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sife-lime/95 pl-1 text-sife-black ${dims}`}
    >
      <span aria-hidden>▶</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
