// TODO: be consistent with casing
export type ElementSelector =
  | 'characterCount'
  | 'messageInput'
  | 'resist-button'
  | 'disable-button'
  | 'options-button'
  | 'character-count-met'
  | 'character-count-not-met'

export function getElement(selector: ElementSelector) {
  return document.querySelector(selector)
}
