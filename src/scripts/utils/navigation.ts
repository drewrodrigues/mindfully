export function goToMindfulnessCheckPage(hitRule: string) {
  // TODO: pass a param of where the window was so we can display and log it
  const resistedUrl = chrome.runtime.getURL(
    './src/views/mindfulness-check.html'
  )
  chrome.tabs.update({
    url: `${resistedUrl}?testingQueryParam`,
  })
}

export function goToOptionsPage() {
  chrome.runtime.openOptionsPage()
}

export function goToResistedPage() {
  // TODO: not sure these URLs will work when packaged
  const resistedUrl = chrome.runtime.getURL('./src/views/resisted.html')
  chrome.tabs.update({
    url: resistedUrl,
  })
}

export function goToErrorPage(error: Error | string) {
  // TODO: not sure these URLs will work when packaged
  const errorUrl = chrome.runtime.getURL('./src/views/error.html')
  const url = new URL(errorUrl)
  url.searchParams.append(
    'errorMessage',
    typeof error === 'object' ? error.message : error
  )

  chrome.tabs.update({
    url: url.toString(),
  })
}
