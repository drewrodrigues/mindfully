import { goToMindfulnessCheckPage, goToOptionsPage } from './utils/navigation'

// ! Right now we're using dynamic rules and cannot determine the actual source
// ! See if there's a method to not using DRs with manifest version

// addErrorBoundary() // TODO: may need to fix this. Not sure why it can't reference the window
// ;(async () => {
//   try {
//     const savedRules = await getSavedRules()
//     const dynamicRules = await getDynamicRules()

//     // If there are any dynamic rules still in memory, we'll clean them up
//     if (dynamicRules.length) {
//       await deleteDynamicsRules(dynamicRules)
//     }

//     // And then sync them up to the saved rules from storage
//     if (savedRules.length) {
//       await addDynamicRules(savedRules)
//     }
//   } catch (e) {
//     console.error(e)
//   }
// })()

console.log('service worker registered')

chrome.action.onClicked.addListener(() => {
  goToOptionsPage()
})

/**
 * We do this because we can't use `chrome.runtime.getURL` in content scripts
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  goToMindfulnessCheckPage(sender.tab.url)
  console.log(request, sender, sendResponse)
  console.log(sender.tab.url)
  sendResponse('response back')
})
