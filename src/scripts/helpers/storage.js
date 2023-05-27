const STORAGE_RULES = 'rules'

let maxDynamicRuleId = 0

export async function getSavedRules() {
  console.log('Getting saved rules')
  const results = await chrome.storage.sync.get(STORAGE_RULES)
  const rules = results.rules
  if (rules) {
    _updateMaxDynamicRule(rules)
  }
  return rules
}

export async function getDynamicRules() {
  console.log('Getting rules')
  const rules = await chrome.declarativeNetRequest.getDynamicRules()
  _updateMaxDynamicRule(rules)
  return rules
}

export async function deleteRules(rules) {
  console.log('Deleting rules')
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map((rule) => rule.id),
  })
  // TODO: update maxDynamicRule
}

export async function addDynamicRule(rule) {
  const builtRule = _buildDynamicRuleFromRuleString(rule)
  const ruleToAdd = [builtRule]
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: ruleToAdd,
  })
  _updateMaxDynamicRule(ruleToAdd)
  return builtRule
}

export async function addDynamicRules(rules) {
  const rulesToAdd = rules.map((rule) => _buildDynamicRuleFromRuleString(rule))
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rulesToAdd,
  })
  _updateMaxDynamicRule(rulesToAdd)
  _updateMaxDynamicRule(rulesToAdd)
}

function _buildDynamicRuleFromRuleString(rule) {
  const builtRule = {
    id: maxDynamicRuleId + 1,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: { extensionPath: '/src/views/mindfulness-check.html' },
    },
    condition: {
      urlFilter: rule,
      resourceTypes: ['main_frame'],
    },
  }
  return builtRule
}

function _updateMaxDynamicRule(rules) {
  rules.forEach((rule) => {
    if (rule.id > maxDynamicRuleId) {
      maxDynamicRuleId = rule.id
    }
  })
}
