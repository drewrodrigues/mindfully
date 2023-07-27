const { goToResistedPage, goToOptionsPage } = require('./helpers/navigation')

const ONE_SECOND = 1_000

function onClickResist(e) {
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

  // TODO: Redirect to a page that says the rule has been disabled (or temporarily)
  chrome.tabs.remove(tab.id)
}

function onOptionsPageClick() {
  goToOptionsPage()
}

function setCountdownUntilDisableButtonEnabled() {
  let secondsLeft = 60

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
  const interval = setInterval(tick, ONE_SECOND)
}

function setRandomBackgroundImage() {
  const BACKGROUND_COUNT = 11
  const randomNumber = parseInt(Math.random() * BACKGROUND_COUNT + 1)
  const image = chrome.runtime.getURL(
    `./src/assets/background${randomNumber}.jpg`
  )

  document.body.style.background = `url("${image}")`
  document.body.style.backgroundSize = 'cover'
}

function keepCharacterCountUpdated(e) {
  if (!e) return // ? input is triggered on mount?
  const characterCount = e.target.value.length

  // TODO: make this configurable
  if (characterCount >= 120) {
    CHARACTER_COUNT_MET.style.display = 'block'
    CHARACTER_COUNT_NOT_MET.style.display = 'none'
    CHARAC_
  } else {
    CHARACTER_COUNT_NOT_MET.style.display = 'block'
    CHARACTER_COUNT_MET.style.display = 'none'
    CHARACTER_COUNT.textContent = characterCount
  }
}

const CHARACTER_COUNT_MET = document.querySelector(
  '[data-id="character-count-met"]'
)
const CHARACTER_COUNT_NOT_MET = document.querySelector(
  '[data-id="character-count-not-met"]'
)
const CHARACTER_COUNT = document.querySelector('[data-id="characterCount"]')
const MESSAGE_INPUT = document.querySelector('[data-id="messageInput"]')
const RESIST_BUTTON = document.querySelector("[data-id='resist-button']")
const DISABLE_BUTTON = document.querySelector("[data-id='disable-button']")
const OPTIONS_BUTTON = document.querySelector("[data-id='options-button']")

RESIST_BUTTON.addEventListener('click', onClickResist)
DISABLE_BUTTON.addEventListener('click', onClickDisable)
OPTIONS_BUTTON.addEventListener('click', onOptionsPageClick)
MESSAGE_INPUT.addEventListener('input', keepCharacterCountUpdated)

keepCharacterCountUpdated()
setCountdownUntilDisableButtonEnabled()
setRandomBackgroundImage()
