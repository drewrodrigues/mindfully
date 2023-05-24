console.log('Service worker registered')
;(async () => {
  try {
    // const staticRuleCount = await chrome.declarativeNetRequest.getSessionRules()
    // console.log(staticRuleCount)
    // const enabledRules = await chrome.declarativeNetRequest.getEnabledRulesets()
    // console.log(enabledRules)
    // TODO: sync these with a settins/config page
    // console.log('Checking dynamic rules')
    // let dynamicRuleCount = await chrome.declarativeNetRequest.getDynamicRules()
    // console.log(dynamicRuleCount)
    // console.log('Setting dynamic rule')
    // await chrome.declarativeNetRequest.updateDynamicRules({
    //   addRules: [
    //     {
    //       id: 10002,
    //       priority: 1,
    //       action: {
    //         type: 'redirect',
    //         redirect: { extensionPath: '/src/views/mindfulness-check.html' },
    //       },
    //       condition: {
    //         urlFilter: 'peanuts',
    //         resourceTypes: ['main_frame'],
    //       },
    //     },
    //   ],
    // })
    // console.log('Checking dynamic rule count')
    // dynamicRuleCount = await chrome.declarativeNetRequest.getDynamicRules()
    // console.log(dynamicRuleCount)
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
