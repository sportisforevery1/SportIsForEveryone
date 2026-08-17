import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";

type EmptyStateProps = {
  label: string;
  title: string;
  body: string;
};

export function EmptyState({ label, title, body }: EmptyStateProps) {
  return (
    <section className="bg-sife-cream px-5 py-24 text-sife-ink md:px-12 md:py-32">
      <Reveal>
        <CategoryLabel tone="navy">{label}</CategoryLabel>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold uppercase leading-tight tracking-tight text-sife-black md:text-5xl">
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-sife-ink/80">{body}</p>
      </Reveal>
    </section>
  );
}
