const hoursFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })
const detailedHoursFormat = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
})

export const NO_HOURS_LABEL = 'sem horas registradas'

export function formatHours(hours: number) {
  return `${hoursFormat.format(hours)} h`
}

export function formatHoursDetailed(hours: number) {
  return `${detailedHoursFormat.format(hours)} h`
}

export function formatHoursOrNone(hours: number | null) {
  return hours === null ? NO_HOURS_LABEL : formatHours(hours)
}

export function formatHoursSpoken(hours: number) {
  const value = hoursFormat.format(hours)
  return `${value} ${value === '1' ? 'hora' : 'horas'}`
}
