import { INote } from './utils/notes'

import { getElement } from './utils/elements'
import { goToOptionsPage, goToResistedPage } from './utils/navigation'
import { deleteNote, getNotes, saveNote } from './utils/notes'
import { addErrorBoundary } from './utils/addErrorBoundary'

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
  const noteElement = document.createElement('div')
  noteElement.classList.add('note')

  const footerElement = document.createElement('footer')
  const indicator = document.createElement('div')
  indicator.classList.add('note-indicator')
  footerElement.appendChild(indicator)

  // Content container
  const contentContainer = document.createElement('section')
  contentContainer.classList.add('content-container')
  // - Note Rule hit
  const ruleHitElement = document.createElement('p')
  ruleHitElement.textContent = note.ruleHit
  ruleHitElement.classList.add('rule-hit')
  contentContainer.appendChild(ruleHitElement)
  // - Note Content
  const contentElement = document.createElement('p')
  contentElement.textContent = note.content
  contentElement.classList.add('note-content')
  contentContainer.appendChild(contentElement)

  // Footer
  const time = document.createElement('span')
  time.textContent = note.date.toLocaleString()
  time.classList.add('note-time')
  noteElement.appendChild(contentContainer)
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

addErrorBoundary()

const RESIST_BUTTON = getElement('resistButton')
const RETURN_BUTTON = getElement('returnButton')
const NOTE_INPUT = getElement('noteInput')
const OPTIONS_BUTTON = getElement('optionsButton')
const NOTE_CONTAINER = getElement('noteContainer')
const QUOTE = getElement('quote')

OPTIONS_BUTTON.addEventListener('click', onOptionsPageClick)
RESIST_BUTTON.addEventListener('click', onClickResist)

let timeLeft = 30
function countdownButtonTick(interval?: NodeJS.Timer) {
  if (timeLeft === 0) {
    // TODO: @drew -- use ruleHit from query param
    RETURN_BUTTON.textContent = 'Return to Page'
    RETURN_BUTTON.setAttribute('disabled', 'false')
    RETURN_BUTTON.classList.add('button-green')
    RETURN_BUTTON.classList.remove('button--disabled')
    RETURN_BUTTON.setAttribute('href', returnUrl)
    clearInterval(interval)
    // ? hmm -- do we want to disable the rule for a short period of time?
    // ? what are the options? Because the rule will still be enabled...
    // ? We can 'bless' the current tab to allow it to bypass the rule now
  } else {
    RETURN_BUTTON.textContent = `Can return to page in ${timeLeft}...`
    timeLeft--
  }
}
countdownButtonTick(null)
const interval = setInterval(() => countdownButtonTick(interval), 1_000)

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
