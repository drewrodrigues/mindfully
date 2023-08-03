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

export interface ISavedRule {
  id: string
  matcher: string
  enabled?: boolean
}

const STORAGE_RULES = 'rules'

export async function getSavedRules(): Promise<ISavedRule[]> {
  const results = await chrome.storage.sync.get(STORAGE_RULES)
  // * get() returns an empty object if the storage key is not set
  if (!results['rules']) return []
  return results.rules
}

// Idea: can abstract out the below 3 functions, to a function with a callback
// add that callback gets all rules and then returns how it wants it updated

export async function saveSavedRule(rule: string): Promise<ISavedRule> {
  const existingSavedRules = await getSavedRules()
  const newRule: ISavedRule = { id: uuidv4(), matcher: rule, enabled: true }
  const updatedRules = [...existingSavedRules, newRule]

  await _storeRules(updatedRules)

  return newRule
}

export async function updateSavedRule(rule: ISavedRule): Promise<ISavedRule[]> {
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

export async function deleteSavedRule(ruleId: string): Promise<ISavedRule[]> {
  const existingSavedRules = await getSavedRules()
  const filteredRules = existingSavedRules.filter(
    (existingRule) => existingRule.id !== ruleId
  )

  await _storeRules(filteredRules)

  return filteredRules
}

export async function deleteSavedRuleByMatcher(
  matcher: string
): Promise<ISavedRule[]> {
  const existingSavedRules = await getSavedRules()
  const filteredRules = existingSavedRules.filter(
    (existingSavedRule) => existingSavedRule.matcher !== matcher
  )

  await _storeRules(filteredRules)

  return filteredRules
}

async function _storeRules(rules: ISavedRule[]) {
  await chrome.storage.sync.set({ [STORAGE_RULES]: rules })
}
