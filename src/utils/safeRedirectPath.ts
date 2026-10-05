export function safeRedirectPath(path: string | null): string {
  if (!path || !path.startsWith('/')) return '/'
  if (path.startsWith('//') || path.includes('\\')) return '/'
  return path
}
