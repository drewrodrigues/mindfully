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

// ! side effect for maxDynamicRuleId
// TODO: fixme -- so that this isn't a global variable and is correct when used
// TODO: within below functions

export async function getSavedRules() {
  console.log('Getting saved rules')
  const results = await chrome.storage.sync.get(STORAGE_RULES)
  const rules = results.rules
  return rules
}

export async function getDynamicRules() {
  console.log('Getting rules')
  const rules = await chrome.declarativeNetRequest.getDynamicRules()
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
  const builtRule = await _buildDynamicRuleFromRuleString(rule)
  const ruleToAdd = [builtRule]
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: ruleToAdd,
  })
  return builtRule
}

export async function addDynamicRules(rules) {
  for (const rule of rules) {
    const builtRule = await _buildDynamicRuleFromRuleString(rule)
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [builtRule],
    })
  }
}

async function _buildDynamicRuleFromRuleString(rule) {
  const dynamicRuleId = await _getNextDynamicRuleId()

  const builtRule = {
    id: dynamicRuleId,
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

async function _getNextDynamicRuleId() {
  const rules = await getDynamicRules()
  console.log({ getDynamicRules: rules })
  if (!rules) return 1

  let nextRuleId = 1

  console.log('Checking rules')
  for (const rule of rules) {
    if (rule.id >= nextRuleId) {
      nextRuleId = rule.id + 1
    }
  }

  console.log('nextRuleId', nextRuleId)

  return nextRuleId
}
