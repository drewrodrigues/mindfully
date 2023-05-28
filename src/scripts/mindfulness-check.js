const { goToResistedPage, goToOptionsPage } = require('./helpers/navigation')
// const rules = require('./helpers/rules.ts')

// TODO: add countdown until you can disable a rule (15 seconds?)
// TODO: make rule disablement temporary

document
  .querySelector("[data-id='resist-button']")
  .addEventListener('click', onClickResist)

const DISABLE_BUTTON = document.querySelector("[data-id='disable-button']")
DISABLE_BUTTON.addEventListener('click', onClickDisable)

document
  .querySelector("[data-id='options-button']")
  .addEventListener('click', onOptionsPageClick)

function onClickResist(e) {
  // TODO: redirect to great job resisting page
  // TODO: store information about resisting
  e.preventDefault()
  goToResistedPage()
}

async function onClickDisable(e) {
  e.preventDefault()

  const tab = await chrome.tabs.getCurrent()
  const { rulesMatchedInfo: matchedRules } =
    await chrome.declarativeNetRequest.getMatchedRules({
      tabId: tab.id,
    })

  const ruleIdsToDisable = matchedRules.map((rule) => rule.rule.ruleId)

  // disable rule temporarily
  console.log('Disabling dynamic rules', ruleIdsToDisable)

  // ! TODO: it looks like they'll have to be explicitly removed for some time from dynamic rules
  // * this means we could show they're enabled if they are a dynamic rule and saved
  // * otherwise, they're disabled if they're saved and not a dynamic rule
  // ? maybe there's a way to disable dynamic or session rules temporarily?
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIdsToDisable,
  })

  // re-enable rule
  // ! might have to go into a service worker
  // setTimeout(async () => {
  //   console.log('Re-enabling disabled rule')
  //   await chrome.declarativeNetRequest.updateEnabledRulesets({
  //     enableRulesetIds: matchedRules.map((rule) => `${rule.rule.ruleId}`),
  //   })
  // }, 10_000)

  chrome.tabs.remove(tab.id)
}

function onOptionsPageClick() {
  goToOptionsPage()
}

function setCountdownUntilDisableButtonEnabled() {
  let secondsLeft = 15

  function tick() {
    if (secondsLeft === 0) {
      DISABLE_BUTTON.textContent = 'Disable Rule'
      DISABLE_BUTTON.disabled = false
      clearInterval(interval)
    } else {
      DISABLE_BUTTON.textContent = `Disable allowed in ${secondsLeft}...`
      secondsLeft--
    }
  }

  tick()
  const interval = setInterval(tick, 1_000)
}

setCountdownUntilDisableButtonEnabled()
