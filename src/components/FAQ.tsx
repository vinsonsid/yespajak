export interface ItemFAQ {
  q: string;
  a: string;
}

/** Bagian FAQ dengan markup FAQPage (schema.org) untuk rich results. */
export default function FAQ({ items }: { items: ItemFAQ[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 print:hidden">
      <h2 className="text-xl font-bold text-slate-900">Pertanyaan Umum</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 marker:content-none">
              <span className="mr-2 inline-block text-sky-700 transition group-open:rotate-90">
                ▸
              </span>
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {item.a}
            </p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
