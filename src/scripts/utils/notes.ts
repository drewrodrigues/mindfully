// -----------------------------------------------------------------------------
// Notes are for the user to write about why they are trying to visit a website
// and take some time out to reflect about their behavior. During this time,
// they will have a set amount of time before they can submit. But, it must be
// a minimum character requirement in addition to waiting for the countdown.
// -----------------------------------------------------------------------------

// TODO: Store stats for how many times we've:
// TODO: create `Model` for Activities that auto creates UUIDs for ID
// ? maybe even create a little library for abstracting storage crud operations w/ callbacks
// TODO: refactor this -- saving date after loading logic is ugly
// - disabled rules
// - resisted

import { v4 as uuidv4 } from 'uuid'

export interface INote {
  id: string
  content: string
  date: string
  ruleHit: string
}

// ? Is chrome storage scoped to each plugin?
const NOTE_STORAGE_KEY = 'notes'

export async function getNotes(): Promise<INote[]> {
  const results = await chrome.storage.sync.get(NOTE_STORAGE_KEY)
  if (!results.notes) return []

  console.log({ noteResult: results })
  const notes = results.notes.map((note: INote) => ({
    ...note,
    date: new Date(note.date),
  }))

  return notes
}

export async function saveNote(content: string, ruleHit: string) {
  const notes = (await getNotes()).map((note) => ({
    ...note,
    date: new Date(note.date).toJSON(),
  }))
  const updatedNotes: object[] = notes ? notes : []
  updatedNotes.push({
    content,
    date: new Date().toJSON(),
    id: uuidv4(),
    ruleHit,
  })
  console.log({ updatedNotes })
  try {
    await chrome.storage.sync.set({
      [NOTE_STORAGE_KEY]: updatedNotes,
    })
    console.log('✅ Saved note')
  } catch (e) {
    console.error('❌ Failed to save note', e)
  }
}

export async function deleteNote(noteId: string) {
  const notes = await getNotes()
  const filteredNotes = notes.filter((note) => note.id !== noteId)

  await chrome.storage.sync.set({
    [NOTE_STORAGE_KEY]: filteredNotes.map((note) => ({
      ...note,
      date: new Date(note.date).toJSON(),
    })),
  })

  return filteredNotes
}
