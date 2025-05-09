export type ElementSelector =
  | 'popupOptionsButton'
  | 'popupBlockButton'
  | 'characterCount'
  | 'errorBoundaryMessage'
  | 'noteInput'
  | 'noteContainer'
  | 'resistButton'
  | 'returnButton'
  | 'optionsButton'
  | 'quote'
  | 'websiteMatcherInput'
  | 'websiteAdditionForm'
  | 'websites'

export function getElement(selector: ElementSelector) {
  return document.querySelector(`[data-id="${selector}"]`)
}

interface CreateElementOptions extends Record<string, any> {
  children?: HTMLElement[]
  className?: string
  onClick?: (e?: Event) => void
  textContent?: string
}

export function createElement(
  tagName: keyof HTMLElementTagNameMap,
  props: CreateElementOptions = {}
) {
  const element = document.createElement(tagName)
  element.className = props.className

  if (props.children) {
    for (const child of props.children) {
      element.appendChild(child)
    }
  }

  if (props.onClick) {
    // TODO: generalize this
    element.addEventListener('click', props.onClick)
  }

  if (props.textContent) {
    // ! we can loop through props and assign them
    element.textContent = props.textContent
  }

  return element
}
