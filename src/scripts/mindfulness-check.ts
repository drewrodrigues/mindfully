import { INote } from './helpers/notes'

import { getElement } from './helpers/elements'
import { goToOptionsPage, goToResistedPage } from './helpers/navigation'
import { deleteNote, getNotes, saveNote } from './helpers/notes'

function onClickResist(e: Event) {
  e.preventDefault()
  // If there's a note, we'll save it
  saveNote((NOTE_INPUT as HTMLInputElement).value)
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

const RESIST_BUTTON = getElement('resistButton')
const NOTE_INPUT = getElement('noteInput')
const OPTIONS_BUTTON = getElement('optionsButton')
const NOTE_CONTAINER = getElement('noteContainer')
const QUOTE = getElement('quote')

OPTIONS_BUTTON.addEventListener('click', onOptionsPageClick)
RESIST_BUTTON.addEventListener('click', onClickResist)

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
