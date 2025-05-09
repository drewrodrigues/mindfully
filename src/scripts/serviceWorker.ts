import { goToMindfulnessCheckPage, goToOptionsPage } from './utils/navigation'
import { getSavedRules } from './utils/rules'

console.log('service worker registered')

chrome.action.onClicked.addListener(() => {
  goToOptionsPage()
})

chrome.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
  const ruleMatcher = await checkForRuleMatch(tab.url)
  if (ruleMatcher) goToMindfulnessCheckPage(tab.url, ruleMatcher)
})

chrome.tabs.onActivated.addListener(async (activeInfo) => {
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

async function checkForRuleMatch(tabUrl: string): Promise<string | null> {
  if (tabUrl.startsWith('chrome')) return
  const rules = await getSavedRules()
  for (const rule of rules) {
    if (tabUrl.toLocaleLowerCase().includes(rule.matcher.toLocaleLowerCase())) {
      return rule.matcher
    }
  }
  return null
}
