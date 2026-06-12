import type {
  ChangeEvent,
  ComponentProps,
  InputHTMLAttributes,
  ReactNode,
  RefObject
} from 'react'
import type { FieldError } from 'react-hook-form'
import type { MenuItem } from '../types/sidebar'

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'cancel' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  icon: ReactNode
  error?: FieldError
}

export interface SearchInputProps {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
}

export interface IconButtonProps extends ComponentProps<'button'> {
  transparent?: boolean
}

export interface SideBarItemProps extends MenuItem {
  active: boolean
}

export interface SearchBarProps {
  isMobile: boolean
  inputRef?: RefObject<HTMLInputElement>
  autoFocus?: boolean
}

export interface EmptyStateProps {
  title?: string
  description: ReactNode
}
