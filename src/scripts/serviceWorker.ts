import {
  addDynamicRules,
  deleteDynamicsRules,
  getDynamicRules,
} from './helpers/dynamicRule'
import { getSavedRules } from './helpers/rules'
;(async () => {
  try {
    const savedRules = await getSavedRules()
    const dynamicRules = await getDynamicRules()

    // If there are any dynamic rules still in memory, we'll clean them up
    if (dynamicRules.length) {
      await deleteDynamicsRules(dynamicRules)
    }

    // And then sync them up to the saved rules from storage
    if (savedRules.length) {
      await addDynamicRules(savedRules)
    }
  } catch (e) {
    console.error(e)
  }
})()
