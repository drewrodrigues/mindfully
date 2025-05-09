// -----------------------------------------------------------------------------
// Dynamic rules are the only way we can set rules to redirect in manfiest 3+.
// But, dynamic rules must be set at runtime or saved to a file and then they
// will be automatically loaded. Since, we want users to dynamically add and
// remove rules, we save them to storage, and then upon load, we push them into
// dynamic rules. Thus, we have to keep the 2 in sync.
// -----------------------------------------------------------------------------

/*

! Change app entry to not rely on dynamic rules here

*/

import { ISavedRule } from './rules'

export type DynamicRule = chrome.declarativeNetRequest.Rule

export async function getDynamicRules(): Promise<DynamicRule[]> {
  const rules = await chrome.declarativeNetRequest.getDynamicRules()
  return rules
}

export async function deleteDynamicsRule(ruleMatcher: string): Promise<void> {}

export async function deleteDynamicsRules(rules: DynamicRule[]): Promise<void> {
  // await chrome.declarativeNetRequest.updateDynamicRules({
  //   removeRuleIds: rules.map((rule) => rule.id),
  // })
}

export async function addDynamicRule(rule: string): Promise<DynamicRule> {
  const builtRule = await _buildDynamicRuleFromRuleMatcher(rule)
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [builtRule],
  })
  return builtRule
}

export async function addDynamicRules(rules: ISavedRule[]): Promise<void> {
  for (const rule of rules) {
    await addDynamicRule(rule.matcher)
  }
}

async function _buildDynamicRuleFromRuleMatcher(
  rule: string
): Promise<DynamicRule> {
  const dynamicRuleId = await _getNextDynamicRuleId()

  const builtRule: DynamicRule = {
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

async function _getNextDynamicRuleId(): Promise<number> {
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
