export async function disableDynamicRule(id: string) {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    disableRulesetIds: [id],
  })
}

export async function enableDynamicRule(id: string) {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: [id],
  })
}
