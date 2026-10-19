export function isValidIgdbId(id: string | undefined): id is string {
  return id !== undefined && /^[1-9]\d{0,9}$/.test(id)
}
