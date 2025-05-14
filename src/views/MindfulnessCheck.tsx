import { createRoot } from 'react-dom/client'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { deleteNote, getNotes, INote, saveNote } from '../scripts/utils/notes'
import { goToOptionsPage, goToResistedPage } from '../scripts/utils/navigation'
import { getRuleByMatcher, updateRule } from '../scripts/utils/rules'

const QUOTES = [
  'With self-discipline most anything is possible.',
  "I can't always control my thoughts but I can choose how I respond to them.",
  'The first and best victory is to conquer self.',
  'You can never conquer the mountain. You can only conquer yourself.',
  'We are what we repeatedly do. Excellence then is not an act, but a habit.',
]

const randomQuoteNumber = Math.floor(Math.random() * QUOTES.length)
const randomQuote = QUOTES[randomQuoteNumber]

const params = new URLSearchParams(window.location.search)
const ruleHit = params.get('ruleHit')
const returnUrl = params.get('returnUrl')

function MindfulnessCheck() {
  const [notes, setNotes] = useState<INote[]>([])
  const [noteInput, setNoteInput] = useState<string>('')

  const noteWordCount = noteInput.split(' ').filter((word) => !!word).length
  const isResistButtonDisabled = !noteInput
  const dismissDuration = noteWordCount * 3

  function onClickResist(e: React.MouseEvent) {
    e.preventDefault()
    if (noteInput) saveNote(noteInput, ruleHit, 'resist')
    goToResistedPage()
  }

  async function onClickDismissButton(e: React.MouseEvent) {
    e.preventDefault()
    if (noteInput) {
      await saveNote(noteInput, ruleHit, 'dismiss')
      const rule = await getRuleByMatcher(ruleHit)
      const ONE_SECOND = 1_000
      await updateRule({
        ...rule,
        dismissedUntil: Date.now() + ONE_SECOND * dismissDuration,
      })
      window.location.href = returnUrl
    }
  }

  async function onNoteDeleteClick(note: INote) {
    await deleteNote(note.id)
    setNotes(notes.filter((_note) => _note !== note))
  }

  useEffect(() => {
    ;(async () => {
      const notes = await getNotes()
      setNotes(notes.reverse())
    })()
  }, [])

  return (
    <div>
      <header className="header">
        <h1 className="logo">Mindfully</h1>

        <button className="options-button" onClick={goToOptionsPage}>
          <span>Rules</span>
        </button>
      </header>

      <p className="quote">{randomQuote}</p>

      <main className="container">
        <form className="reflection-input">
          <textarea
            placeholder="Write about why you want to use view this website right now. For every word written, you can dismiss for 3 seconds."
            data-id="noteInput"
            onChange={(e) => setNoteInput(e.target.value)}
          ></textarea>

          <footer className="button-container">
            <a
              className={`button text-white ${
                isResistButtonDisabled ? 'button--disabled' : 'button-orange'
              }`}
              onClick={onClickDismissButton}
            >
              Dismiss for {dismissDuration} seconds
            </a>
            <button
              className="button text-white bold button-green"
              data-id="resistButton"
              onClick={onClickResist}
            >
              Resist
            </button>
          </footer>
        </form>

        <h2 className="section-header">Rule</h2>
        <p className="activity-empty-state">{ruleHit}</p>

        <h2 className="section-header">Activity</h2>
        <div className="note-container">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div className="note" key={note.id}>
                <section className="content-container">
                  <p className="note-content">{note.content}</p>
                </section>

                <footer>
                  <div
                    className={`note-indicator ${
                      note.type === 'dismiss'
                        ? 'note-indicator--dimiss'
                        : 'note-indicator--resist'
                    }`}
                  />

                  <span className="note-time">
                    {note.date.toLocaleString()}
                  </span>
                  <p className="rule-hit">{note.ruleHit}</p>
                </footer>
                <button
                  className="note-delete"
                  onClick={() => onNoteDeleteClick(note)}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <p className="activity-empty-state">No activity yet...</p>
          )}
        </div>
      </main>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<MindfulnessCheck />)
