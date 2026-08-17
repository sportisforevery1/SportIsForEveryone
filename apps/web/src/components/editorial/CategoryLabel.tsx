type CategoryLabelProps = {
  children: string;
  tone?: "lime" | "navy";
};

export function CategoryLabel({ children, tone = "lime" }: CategoryLabelProps) {
  const color = tone === "navy" ? "text-sife-navy" : "text-sife-lime";

  return (
    <p className={`text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${color}`}>
      {children}
    </p>
  );
}
