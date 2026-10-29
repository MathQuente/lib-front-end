export const SUPPORT_EMAIL = 'euzerei.suporte@gmail.com'

export function mailtoHref(subject?: string) {
  return subject
    ? `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${SUPPORT_EMAIL}`
}
