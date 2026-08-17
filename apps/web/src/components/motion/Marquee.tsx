type MarqueeProps = {
  text: string;
  className?: string;
};

export function Marquee({ text, className }: MarqueeProps) {
  const items = Array.from({ length: 8 }, (_, index) => (
    <span key={index} className="mx-6 shrink-0">
      {text}
    </span>
  ));

  return (
    <div
      className={`sife-marquee overflow-hidden whitespace-nowrap ${className ?? ""}`.trim()}
      aria-hidden="true"
    >
      <div className="sife-marquee-track inline-flex min-w-full">
        {items}
        {items}
      </div>
    </div>
  );
}
