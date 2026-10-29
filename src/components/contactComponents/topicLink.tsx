import { mailtoHref } from './supportEmail'

export function TopicLink({
  title,
  hint,
  subject,
  about,
}: {
  title: string
  hint: string
  subject: string
  about: string
}) {
  return (
    <a
      href={mailtoHref(subject)}
      className="flex min-h-[5.5rem] items-center justify-between gap-4 rounded-lg bg-dark-bg-lighter px-3.5 py-2.5 transition-colors hover:bg-dark-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
    >
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-semibold text-white">{title}</span>
        <span className="text-[13px] text-gray-400">{hint}</span>
      </span>
      <span className="shrink-0 text-[13px] font-semibold text-primary-link">
        Escrever
        <span className="sr-only"> sobre {about}</span>
      </span>
    </a>
  )
}
