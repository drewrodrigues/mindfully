// -----------------------------------------------------------------------------
// If these match a part of the URL, they will cause a redirect to the
// mindfulness page, which the user can either disable the rule after a
// countdown or can resist with an optional note.
//
// These are only used to load up dynamic rules on load. Since, they aren't
// written to a file, the other option we have is to persist them in chrome
// storage and then load up dynamic rules at runtime. So, we do that.
// -----------------------------------------------------------------------------

import { v4 as uuidv4 } from 'uuid'

export interface IRule {
  id: string
  matcher: string
  enabled?: boolean
  dismissedUntil?: number
}

const STORAGE_RULES = 'rules'

export async function getSavedRules(): Promise<IRule[]> {
  const results = await chrome.storage.sync.get(STORAGE_RULES)
  // * get() returns an empty object if the storage key is not set
  if (!results['rules']) return []
  return results.rules
}

// ? Idea: can abstract out the below 3 functions, to a function with a callback
// ? add that callback gets all rules and then returns how it wants it updated

export async function saveRule(rule: string): Promise<IRule> {
  const existingSavedRules = await getSavedRules()
  const newRule: IRule = { id: uuidv4(), matcher: rule, enabled: true }
  const updatedRules = [...existingSavedRules, newRule]

  await _storeRules(updatedRules)

  return newRule
}

export async function updateRule(rule: IRule): Promise<IRule[]> {
  const existingRules = await getSavedRules()
  const existingRulesWithUpdatedRule = existingRules.map((existingRule) => {
    if (existingRule.id === rule.id) {
      return rule
    } else {
      return existingRule
    }
  })

  await _storeRules(existingRulesWithUpdatedRule)

  return existingRulesWithUpdatedRule
}

export async function deleteRule(ruleId: string): Promise<IRule[]> {
  const savedRules = await getSavedRules()
  const filteredRules = savedRules.filter(
    (existingRule) => existingRule.id !== ruleId
  )

  await _storeRules(filteredRules)

  return filteredRules
}

export async function deleteRuleByMatcher(matcher: string): Promise<IRule[]> {
  const existingSavedRules = await getSavedRules()
  const filteredRules = existingSavedRules.filter(
    (existingSavedRule) => existingSavedRule.matcher !== matcher
  )

  await _storeRules(filteredRules)

  return filteredRules
}

async function _storeRules(rules: IRule[]) {
  await chrome.storage.sync.set({ [STORAGE_RULES]: rules })
}

export async function getRuleByMatcher(matcher: string) {
  const savedRules = await getSavedRules()
  const rule = savedRules.find(
    (existingRule) => existingRule.matcher === matcher
  )
  return rule
}

export async function checkForRuleMatch(
  tabUrl: string
): Promise<string | null> {
  if (tabUrl.startsWith('chrome')) return

  const rules = await getSavedRules()
  for (const rule of rules) {
    const isPastDismiss = rule.dismissedUntil
      ? rule.dismissedUntil <= Date.now()
      : true
    if (
      tabUrl.toLocaleLowerCase().includes(rule.matcher.toLocaleLowerCase()) &&
      isPastDismiss
    ) {
      return rule.matcher
    }
  }

  return null
}
