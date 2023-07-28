// -----------------------------------------------------------------------------
// Notes are for the user to write about why they are trying to visit a website
// and take some time out to reflect about their behavior. During this time,
// they will have a set amount of time before they can submit. But, it must be
// a minimum character requirement in addition to waiting for the countdown.
// -----------------------------------------------------------------------------

// TODO: Store stats for how many times we've:
// - disabled rules
// - resisted

// ? Is chrome storage scoped to each plugin?
const NOTE_STORAGE_KEY = 'notes'

export async function getNotes() {
  const results = await chrome.storage.sync.get(NOTE_STORAGE_KEY)
  console.log({ results })
  const notes = results.notes // ! double check this
  return notes
}

export async function getNotesFromToday() {
  // TODO
}

export async function saveNote(content: string) {
  const notes = await getNotes()
  const updatedNotes: object[] = notes ? notes : []
  updatedNotes.push({ content, date: new Date() })
  console.log(updatedNotes)
  try {
    await chrome.storage.sync.set({
      // ? new Date() or? is this localized?
      [NOTE_STORAGE_KEY]: updatedNotes,
    })
    console.log('✅ Saved note')
  } catch (e) {
    console.error('❌ Failed to save note', e)
  }
}
