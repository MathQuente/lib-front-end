import { focusRing } from '../../styles/focus'
import { buttonClasses } from '../button'

export const sectionTitleClass =
  'font-display text-base font-extrabold text-white sm:text-lg'

export const textLinkClass = `rounded-sm text-primary-link underline underline-offset-4 transition-colors hover:text-white ${focusRing}`

export const primaryButtonClass = buttonClasses({
  variant: 'primary',
  size: 'md',
  className: 'min-h-11',
})

export const secondaryButtonClass = buttonClasses({
  variant: 'secondary',
  size: 'md',
  className: 'min-h-11',
})
