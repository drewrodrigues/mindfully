import { INote } from './helpers/notes'

import { getElement } from './helpers/elements'
import { goToResistedPage, goToOptionsPage } from './helpers/navigation'
import { getNotes, saveNote, deleteNote } from './helpers/notes'

const ONE_SECOND = 1_000

function onClickResist(e: Event) {
  e.preventDefault()
  // If there's a note, we'll save it
  saveNote((NOTE_INPUT as HTMLInputElement).value)
  goToResistedPage()
}

async function onClickDisable(e: Event) {
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
  const randomNumber = Math.random() * BACKGROUND_COUNT + 1
  const image = chrome.runtime.getURL(
    `./src/assets/background${randomNumber}.jpg`
  )

  document.body.style.background = `url("${image}")`
  document.body.style.backgroundSize = 'cover'
}

async function renderNotesFromStorage() {
  const notes = await getNotes()
  NOTE_CONTAINER.innerHTML = null

  if (notes.length) {
    const noteElements = []

    for (const note of notes) {
      const noteElement = Note(note)

      noteElements.unshift(noteElement)
    }

    NOTE_CONTAINER.append(...noteElements)
  } else {
    // ? Can we abstract out components a bit better? Element('elementName', options)
    const emptyStateText = document.createElement('p')
    emptyStateText.className = 'activity-empty-state'
    emptyStateText.textContent = 'No activity yet...'
    NOTE_CONTAINER.innerHTML = null
    NOTE_CONTAINER.append(emptyStateText)
  }
}

// TODO: a way to render these raw like in story book?
function Note(note: INote) {
  const noteElement = document.createElement('div')
  noteElement.classList.add('note')

  const footerElement = document.createElement('footer')
  const indicator = document.createElement('div')
  indicator.classList.add('note-indicator')
  footerElement.appendChild(indicator)
  const contentElement = document.createElement('p')
  contentElement.textContent = note.content
  const time = document.createElement('span')
  time.textContent = note.date.toLocaleString()
  time.classList.add('note-time')
  if (note.content) {
    noteElement.appendChild(contentElement)
  }
  footerElement.appendChild(time)
  noteElement.appendChild(footerElement)

  const deleteElement = document.createElement('button')
  deleteElement.classList.add('note-delete')
  deleteElement.textContent = 'X'
  deleteElement.addEventListener('click', async (e) => {
    e.preventDefault()
    await deleteNote(note.id)
    renderNotesFromStorage()
  })
  noteElement.appendChild(deleteElement)

  return noteElement
}

async function renderMatchedRule() {
  // MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL can be thrown if there are too many
  // matched requests. So, we'll catch and put a different message.

  let ruleMatchedText = 'Rule '
  try {
    const matchedRules = await chrome.declarativeNetRequest.getMatchedRules()
    const allRules = await chrome.declarativeNetRequest.getDynamicRules()

    const matchedRuleUrlFilter = allRules.find(
      (allRule) => allRule.id === matchedRules.rulesMatchedInfo[0].rule.ruleId
    )?.condition.urlFilter

    ruleMatchedText = matchedRuleUrlFilter
  } catch (e) {
    console.error(e)
  }

  const matchedRuleElement = getElement('matchedRule')
  matchedRuleElement.textContent = ruleMatchedText
}

const RESIST_BUTTON = getElement('resistButton')
const NOTE_INPUT = getElement('noteInput')
const DISABLE_BUTTON = getElement('disableButton')
const OPTIONS_BUTTON = getElement('optionsButton')
const NOTE_CONTAINER = getElement('noteContainer')

RESIST_BUTTON.addEventListener('click', onClickResist)
DISABLE_BUTTON.addEventListener('click', onClickDisable)
OPTIONS_BUTTON.addEventListener('click', onOptionsPageClick)

setCountdownUntilDisableButtonEnabled()
// setRandomBackgroundImage()
renderNotesFromStorage()
renderMatchedRule()
