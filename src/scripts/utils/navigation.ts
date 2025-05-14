import { log } from './logger'

export async function goToMindfulnessCheckPage(
  returnUrl: string,
  ruleHit: string
) {
  log('goToMindfulnessCheckPage()')
  const resistedUrl = chrome.runtime.getURL('./mindfulness.html')
  // TODO: encode these safer
  await chrome.tabs.update({
    url: `${resistedUrl}?returnUrl=${returnUrl}&ruleHit=${ruleHit}`,
  })
}

export function goToOptionsPage() {
  chrome.runtime.openOptionsPage()
}

export function goToResistedPage() {
  const resistedUrl = chrome.runtime.getURL('./resisted.html')
  chrome.tabs.update({
    url: resistedUrl,
  })
}

export function goToErrorPage(error: Error | string) {
  const errorUrl = chrome.runtime.getURL('./error.html')
  const url = new URL(errorUrl)
  url.searchParams.append(
    'errorMessage',
    typeof error === 'object' ? error.message : error
  )

  chrome.tabs.update({
    url: url.toString(),
  })
}
