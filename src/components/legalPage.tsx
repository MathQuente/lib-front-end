import { useDocumentTitle } from '../hooks/useDocumentTitle'

export type LegalSection = {
  heading: string
  paragraphs: string[]
}

export function LegalPage({
  title,
  updatedAt,
  sections
}: {
  title: string
  updatedAt?: string
  sections: LegalSection[]
}) {
  useDocumentTitle(title)

  return (
    <div className="flex justify-center pt-2 pb-8 md:pt-4 md:pb-12">
      <article className="w-full max-w-3xl flex flex-col gap-7">
        <header className="flex flex-col gap-2">
          <h1 className="text-white font-semibold text-2xl">{title}</h1>
          {updatedAt && <p className="text-sm text-gray-400">Atualizado em {updatedAt}</p>}
        </header>

        {sections.map(({ heading, paragraphs }) => (
          <section key={heading} className="flex flex-col gap-2">
            <h2 className="text-white font-semibold text-lg">{heading}</h2>
            {paragraphs.map(paragraph => (
              <p key={paragraph} className="text-[15px] leading-relaxed text-gray-300">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </div>
  )
}
