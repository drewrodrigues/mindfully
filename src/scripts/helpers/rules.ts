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
}

const STORAGE_RULES = 'rules'

export async function getSavedRules(): Promise<IRule[]> {
  const results = await chrome.storage.sync.get(STORAGE_RULES)
  // * get() returns an empty object if the storage key is not set
  if (!results['rules']) return []
  return results.rules
}

export async function saveSavedRule(rule: string): Promise<IRule[]> {
  const existingSavedRules = await getSavedRules()
  const newRule: IRule = { id: uuidv4(), matcher: rule }
  const updatedRules = [newRule, ...existingSavedRules]

  _storeRules(updatedRules)

  return updatedRules
}

export async function deleteSavedRule(ruleId: string): Promise<IRule[]> {
  const existingSavedRules = await getSavedRules()
  const filteredRules = existingSavedRules.filter(
    (existingRule) => existingRule.id !== ruleId
  )

  _storeRules(filteredRules)

  return filteredRules
}

async function _storeRules(rules: IRule[]) {
  await chrome.storage.sync.set({ [STORAGE_RULES]: rules })
}
