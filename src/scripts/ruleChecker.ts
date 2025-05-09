import { goToMindfulnessCheckPage } from './utils/navigation'
import { getSavedRules } from './utils/rules'

;(async () => {
  console.log('grabbing rules')
  const rules = await getSavedRules()
  console.log({ rules })

  for (const rule of rules) {
    if (window.location.host.includes(rule.matcher)) {
      goToMindfulnessCheckPage(rule.matcher)
      return
    }
  }
})()

console.log(window.location.href)

// console.log('loaded ruleCheck')
// chrome.runtime
//   .sendMessage({ greeting: 'hello' })
//   .then(() => {
//     console.log('sent message over to service worker')
//   })
//   .catch(() => {
//     console.error('failed to send message to service worker')
//   })
