module.exports = function goToOptionsPage() {
  chrome.runtime.openOptionsPage()
}

module.exports = function goToResistedPage() {
  const resistedUrl = chrome.runtime.getURL('./src/views/resisted.html')
  console.log(resistedUrl)
  chrome.tabs.update({
    url: resistedUrl,
  })
}
