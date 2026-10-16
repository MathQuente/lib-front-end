const LIST_STEPS_KEY = 'listSteps'

export function pushListState(url: URL) {
  const steps = listStepsInHistory() + 1
  window.history.pushState({ [LIST_STEPS_KEY]: steps }, '', url)
}

export function listStepsInHistory() {
  return Number(window.history.state?.[LIST_STEPS_KEY] ?? 0) || 0
}
