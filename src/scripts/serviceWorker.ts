import { goToMindfulnessCheckPage, goToOptionsPage } from './utils/navigation'
import { getSavedRules } from './utils/rules'

console.log('service worker registered')

chrome.action.onClicked.addListener(() => {
  goToOptionsPage()
})

/**
 * We do this because we can't use `chrome.runtime.getURL` in content scripts
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('chrome.runtime.onMessage.addListener')
  console.log(request)
  if (request.message === 'goToMindfulnessCheckPage') {
    console.log('Going to mindfulness page')
    goToMindfulnessCheckPage(request.options.returnUrl, request.options.ruleHit)
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('Tab updated', { tabId, changeInfo, tab })

  const rules = await getSavedRules()
  for (const rule of rules) {
    if (tab.url.includes(rule.matcher))
      goToMindfulnessCheckPage(tab.url, rule.matcher)
  }
})

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('activated', { activeInfo })

  const tab = await chrome.tabs.get(activeInfo.tabId)
  const rules = await getSavedRules()
  console.log({ tab })

  for (const rule of rules) {
    if (tab.url.includes(rule.matcher))
      // Without the setTimeout, we hit an error `Uncaught (in promise) Error: Tabs cannot be edited right now (user may be dragging a tab).`
      // TODO: make this more robust with some retries at 50ms
      setTimeout(() => {
        goToMindfulnessCheckPage(tab.url, rule.matcher)
      }, 100)
  }
})
