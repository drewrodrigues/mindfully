// -----------------------------------------------------------------------------
// Dynamic rules are the only way we can set rules to redirect in manfiest 3+.
// But, dynamic rules must be set at runtime or saved to a file and then they
// will be automatically loaded. Since, we want users to dynamically add and
// remove rules, we save them to storage, and then upon load, we push them into
// dynamic rules. Thus, we have to keep the 2 in sync.
// -----------------------------------------------------------------------------

const STORAGE_RULES = 'rules'

export async function getSavedRules() {
  const results = await chrome.storage.sync.get(STORAGE_RULES)
  const rules = results.rules
  return rules
}

export async function getDynamicRules() {
  const rules = await chrome.declarativeNetRequest.getDynamicRules()
  return rules
}

export async function deleteRules(rules: chrome.declarativeNetRequest.Rule[]) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map((rule) => rule.id),
  })
}

export async function addDynamicRule(rule: string): Promise<void> {
  const builtRule = await _buildDynamicRuleFromRuleString(rule)
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [builtRule],
  })
}

export async function addDynamicRules(rules: string[]): Promise<void> {
  for (const rule of rules) {
    await addDynamicRule(rule)
  }
}

async function _buildDynamicRuleFromRuleString(
  rule: string
): Promise<chrome.declarativeNetRequest.Rule> {
  const dynamicRuleId = await _getNextDynamicRuleId()

  const builtRule: chrome.declarativeNetRequest.Rule = {
    id: dynamicRuleId,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
      redirect: { extensionPath: '/src/views/mindfulness-check.html' },
    },
    condition: {
      urlFilter: rule,
      resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
    },
  }

  return builtRule
}

async function _getNextDynamicRuleId() {
  const rules = await getDynamicRules()
  if (!rules) return 1

  let nextRuleId = 1

  for (const rule of rules) {
    if (rule.id >= nextRuleId) {
      nextRuleId = rule.id + 1
    }
  }

  return nextRuleId
}
