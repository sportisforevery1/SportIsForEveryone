import { workServices } from "@/lib/site";

export function WorkAccordion() {
  return (
    <div className="sife-accordion-list">
      {workServices.map((item) => (
        <details key={item.title} className="sife-accordion">
          <summary>{item.title}</summary>
          {item.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 max-w-2xl text-base leading-relaxed text-sife-ink/80">
              {paragraph}
            </p>
          ))}
        </details>
      ))}
    </div>
  );
}
