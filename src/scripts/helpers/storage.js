// -----------------------------------------------------------------------------
// Dynamic rules are the only way we can set rules to redirect in manfiest 3+.
// But, dynamic rules must be set at runtime or saved to a file and then they
// will be automatically loaded. Since, we want users to dynamically add and
// remove rules, we save them to storage, and then upon load, we push them into
// dynamic rules. Thus, we have to keep the 2 in sync.
// -----------------------------------------------------------------------------

// TODO: rename this to rules

const STORAGE_RULES = 'rules'

// * For keeping track of the next dynamic ID we can use. Chrome doesn't
// * automatically set this value, so we must first read from storage and then
// * use +1 what we find.
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
