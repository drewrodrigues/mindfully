// TODO: be consistent with casing
// TODO: add some validation to check that these are valid -- otherwise, crash it
export type ElementSelector =
  | 'matchedRule'
  | 'popupOptionsButton'
  | 'popupBlockButton'
  | 'characterCount'
  | 'noteInput'
  | 'noteContainer'
  | 'resist-button'
  | 'disable-button'
  | 'options-button'
  | 'character-count-met'
  | 'character-count-not-met'

export function getElement(selector: ElementSelector) {
  return document.querySelector(`[data-id="${selector}"]`)
}
