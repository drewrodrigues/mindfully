import { log } from './utils/logger'
import { goToMindfulnessCheckPage, goToOptionsPage } from './utils/navigation'
import { checkForRuleMatch } from './utils/rules'

log('service worker registered')

chrome.action.onClicked.addListener(() => {
  goToOptionsPage()
})

// Occurs when changing a tab
chrome.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
  log('onUpdated')
  const ruleMatcher = await checkForRuleMatch(tab.url)
  if (ruleMatcher) goToMindfulnessCheckPage(tab.url, ruleMatcher)
})

// Occurs when re-opening a tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  log('onActivated')
  const tab = await chrome.tabs.get(activeInfo.tabId)
  const ruleMatcher = await checkForRuleMatch(tab.url)
  if (ruleMatcher) {
    // Without the setTimeout, we hit an error `Uncaught (in promise) Error: Tabs cannot be edited right now (user may be dragging a tab).`
    // TODO: make this more robust with some retries at 50ms
    setTimeout(() => {
      goToMindfulnessCheckPage(tab.url, ruleMatcher)
    }, 100)
  }
})

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.message === 'goToMindfulnessCheckPage') {
    goToMindfulnessCheckPage(sender.tab.url, message.ruleMatch)
  }
})
