import { useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { focusRing } from '../styles/focus'
import { sectionTitleClass } from './aboutComponents/styles'
import { LegalToc, type LegalTocItem } from './legalToc'

export type LegalSection = {
  heading: string
  paragraphs: string[]
}

const OTHER_PAGES = [
  { to: '/termos', title: 'Termos de uso' },
  { to: '/privacidade', title: 'Política de privacidade' },
  { to: '/contato', title: 'Contato' },
]

function splitHeading(heading: string, index: number) {
  const match = heading.match(/^(\d+)\.\s*(.*)$/)
  return match
    ? { number: match[1], title: match[2] }
    : { number: String(index + 1), title: heading }
}

export function LegalPage({
  title,
  updatedAt,
  sections,
}: {
  title: string
  updatedAt?: string
  sections: LegalSection[]
}) {
  useDocumentTitle(title)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  const items = useMemo<LegalTocItem[]>(
    () =>
      sections.map((section, index) => ({
        id: `secao-${index + 1}`,
        ...splitHeading(section.heading, index),
      })),
    [sections]
  )

  return (
    <div className="flex justify-center pt-2 pb-8 md:pt-4 md:pb-12">
      <article className="flex w-full min-w-0 flex-col gap-12">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-[clamp(2rem,6vw,4.25rem)] font-extrabold leading-none tracking-tight text-white">
            {title}
          </h1>
          {updatedAt && (
            <p className="text-sm text-gray-400">Atualizado em {updatedAt}</p>
          )}
        </header>

        <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14">
          <LegalToc items={items} />

          <div className="flex min-w-0 flex-col">
            {sections.map(({ paragraphs }, index) => {
              const { id, number, title: sectionTitle } = items[index]
              return (
                <section
                  key={id}
                  id={id}
                  aria-labelledby={`${id}-titulo`}
                  className="grid scroll-mt-4 gap-x-2 gap-y-2 border-t border-dark-border py-6 first:border-t-0 first:pt-0 sm:grid-cols-[3.2rem_minmax(0,1fr)]"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl font-extrabold leading-none text-primary-light"
                  >
                    {number}
                  </span>
                  <div className="flex min-w-0 flex-col gap-2.5">
                    <h2
                      id={`${id}-titulo`}
                      className="font-display text-[clamp(1.05rem,2vw,1.25rem)] font-extrabold text-white"
                    >
                      <span className="sr-only">{number}. </span>
                      {sectionTitle}
                    </h2>
                    {paragraphs.map(paragraph => (
                      <p
                        key={paragraph}
                        className="max-w-[68ch] text-[15px] leading-relaxed text-gray-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>

        <section aria-labelledby="legal-outras" className="flex flex-col gap-4">
          <h2 id="legal-outras" className={sectionTitleClass}>
            Outras páginas
          </h2>
          <ul className="grid list-none gap-2 sm:grid-cols-3">
            {OTHER_PAGES.map(({ to, title: pageTitle }) => {
              const isCurrent = pathname === to
              return (
                <li key={to} className="min-w-0">
                  <Link
                    to={to}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`flex h-full min-h-[3.5rem] items-center rounded-lg border border-dark-border px-4 py-3 font-semibold transition-colors hover:bg-dark-bg-lighter ${focusRing} ${
                      isCurrent ? 'text-gray-400' : 'text-primary-link'
                    }`}
                  >
                    {pageTitle}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      </article>
    </div>
  )
}
