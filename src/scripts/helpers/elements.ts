export type ElementSelector =
  | 'matchedRule'
  | 'popupOptionsButton'
  | 'popupBlockButton'
  | 'characterCount'
  | 'noteInput'
  | 'noteContainer'
  | 'resistButton'
  | 'disableButton'
  | 'optionsButton'
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

  return element
}
