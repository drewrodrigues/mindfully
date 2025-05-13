import { INote } from './utils/notes'

import { createElement, getElement } from './utils/elements'
import { goToOptionsPage, goToResistedPage } from './utils/navigation'
import { deleteNote, getNotes, saveNote } from './utils/notes'
import { addErrorBoundary } from './utils/addErrorBoundary'
import { getRuleByMatcher, updateRule } from './utils/rules'

const params = new URLSearchParams(window.location.search)
const ruleHit = params.get('ruleHit')
const returnUrl = params.get('returnUrl')

function onClickResist(e: Event) {
  e.preventDefault()
  // If there's a note, we'll save it
  saveNote((NOTE_INPUT as HTMLInputElement).value, ruleHit)
  goToResistedPage()
}

function onOptionsPageClick() {
  goToOptionsPage()
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

function Note(note: INote) {
  const noteElement = createElement('div', { className: 'note' })

  const footerElement = document.createElement('footer')
  const indicator = createElement('div', { className: 'note-indicator' })
  footerElement.appendChild(indicator)

  // Content container
  const contentContainer = createElement('section', {
    className: 'content-container',
  })
  // - Note Content
  const contentElement = createElement('p', {
    textContent: note.content,
    className: 'note-content',
  })
  contentContainer.appendChild(contentElement)

  // Footer
  const time = createElement('span', {
    textContent: note.date.toLocaleString(),
    className: 'note-time',
  })
  noteElement.appendChild(contentContainer)
  footerElement.appendChild(time)
  // - Note Rule hit
  const ruleHitElement = document.createElement('p')
  ruleHitElement.textContent = note.ruleHit
  ruleHitElement.classList.add('rule-hit')
  footerElement.appendChild(ruleHitElement)
  noteElement.appendChild(footerElement)

  const deleteElement = createElement('button', {
    className: 'note-delete',
    textContent: 'X',
  })
  deleteElement.addEventListener('click', async (e) => {
    e.preventDefault()
    await deleteNote(note.id)
    renderNotesFromStorage()
  })
  noteElement.appendChild(deleteElement)

  return noteElement
}

addErrorBoundary()

const RESIST_BUTTON = getElement('resistButton')
const DISMISS_BUTTON = getElement('dismissButton')
const NOTE_INPUT = getElement('noteInput')
const OPTIONS_BUTTON = getElement('optionsButton')
const NOTE_CONTAINER = getElement('noteContainer')
const QUOTE = getElement('quote')
const RULE_HIT = getElement('ruleHit')

OPTIONS_BUTTON.addEventListener('click', onOptionsPageClick)
RESIST_BUTTON.addEventListener('click', onClickResist)
NOTE_INPUT.addEventListener('keyup', updateDismiss)
RULE_HIT.textContent = ruleHit

let dismissMultiplier = 0

function updateDismiss(e: Event) {
  // @ts-ignore
  const wordCount = e.target.value
    .split(' ')
    .filter((word: string) => !!word).length
  // dismissMultiplier = Math.floor(wordCount / 25)
  dismissMultiplier = 1
  if (dismissMultiplier === 0) {
    DISMISS_BUTTON.textContent = `${
      25 - wordCount
    } more words = 1 minute dismiss`
  } else {
    DISMISS_BUTTON.textContent = `Dismiss for ${dismissMultiplier} minutes...`
    DISMISS_BUTTON.setAttribute('disabled', 'false')
    DISMISS_BUTTON.classList.add('button-blue')
    DISMISS_BUTTON.classList.remove('button--disabled')
    DISMISS_BUTTON.setAttribute('href', returnUrl)
    DISMISS_BUTTON.addEventListener('click', async () => {
      // TODO: dismiss rule for n amount of time
      const rule = await getRuleByMatcher(ruleHit)
      updateRule({
        ...rule,
        dismissedUntil: Date.now() + 1_000 * 60 * dismissMultiplier,
      })
    })
  }
}

const QUOTES = [
  'With self-discipline most anything is possible.',
  "I can't always control my thoughts but I can choose how I respond to them.",
  'The first and best victory is to conquer self.',
  'You can never conquer the mountain. You can only conquer yourself.',
  'We are what we repeatedly do. Excellence then is not an act, but a habit.',
]

const randomQuoteNumber = Math.floor(Math.random() * QUOTES.length)
QUOTE.textContent = QUOTES[randomQuoteNumber]

renderNotesFromStorage()
