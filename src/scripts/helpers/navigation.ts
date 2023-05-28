export function goToOptionsPage() {
  chrome.runtime.openOptionsPage()
}

export function goToResistedPage() {
  const resistedUrl = chrome.runtime.getURL('./src/views/resisted.html')
  console.log(resistedUrl)
  chrome.tabs.update({
    url: resistedUrl,
  })
}
