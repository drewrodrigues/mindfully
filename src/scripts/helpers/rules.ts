async function disableDynamicRule(id: string) {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    disableRulesetIds: [id],
  })
}

async function enableDynamicRule(id: string) {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: [id],
  })
}

module.exports = {
  disableDynamicRule,
  enableDynamicRule,
}
