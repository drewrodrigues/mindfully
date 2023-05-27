const {
  getSavedRules,
  getDynamicRules,
  deleteRules,
  addDynamicRules,
} = require('./helpers/storage')

console.log('Service worker registered')
;(async () => {
  try {
    const savedRules = await getSavedRules()
    let dynamicRules = await getDynamicRules()
    console.dir({ savedRules, dynamicRules })

    const anyDynamicRules = dynamicRules.length
    if (anyDynamicRules) {
      console.log('Cleaning up existing rules')
      await deleteRules(dynamicRules)
    }

    if (savedRules) {
      console.log('Adding saved rules to dynamic rules')
      await addDynamicRules(savedRules)
    }

    dynamicRules = await getDynamicRules()
    console.log({ dynamicRules })
  } catch (e) {
    console.error(e)
  }
})()

// chrome.webRequest.onBeforeRequest.addListener(
//   (details) => {
//     console.log("onBeforeRequest", details);
//   },
//   { urls: ["<all_urls>"] },
//   ["blocking"]
// );
