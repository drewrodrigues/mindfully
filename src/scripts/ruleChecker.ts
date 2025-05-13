import { checkForRuleMatch } from './utils/rules'

// this handles the case where a user dimisses a rule and then
// they are on the page for a while (JS based page updates) and
// the `updated` event is never triggered to enact the rule after
// dismissal passes.
setInterval(async () => {
  const ruleMatch = await checkForRuleMatch(window.location.href)
  if (ruleMatch) {
    chrome.runtime.sendMessage({
      message: 'goToMindfulnessCheckPage',
      ruleMatch,
    })
  }
}, 5_000)
