module.exports = async function disableDynamicRule(id: string) {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    disableRulesetIds: [id],
  })
}

module.exports = async function enableDynamicRule(id: string) {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: [id],
  })
}
