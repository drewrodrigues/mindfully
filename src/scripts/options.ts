import { addErrorBoundary } from './utils/addErrorBoundary'
import { createElement, getElement } from './utils/elements'
import {
  IRule,
  deleteRuleByMatcher,
  getSavedRules,
  saveRule,
  updateRule,
} from './utils/rules'

const WEBSITE_MATCHER = 'website-matcher'

const websiteContainer = getElement('websites')
const websiteAdditionForm = getElement('websiteAdditionForm')
const websiteMatcherInput = getElement(
  'websiteMatcherInput'
) as HTMLInputElement

websiteAdditionForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(websiteAdditionForm as HTMLFormElement)
  const ruleMatcher = formData
    .get(WEBSITE_MATCHER)
    .toString()
    .toLocaleLowerCase()
  const savedRule = await saveRule(ruleMatcher)

  websiteContainer.prepend(RuleBubble(savedRule))
  websiteMatcherInput.value = ''
})

async function renderRuleMatchers() {
  const savedRules = await getSavedRules()
  const elementsToRender = []

  for (const savedRule of savedRules) {
    elementsToRender.unshift(RuleBubble(savedRule))
  }

  websiteContainer.innerHTML = null
  websiteContainer.append(...elementsToRender)
}

function RuleBubble(rule: IRule) {
  const ruleElement = createElement('div', {
    textContent: rule.matcher,
    className: 'bubble',
  })

  const aside = createElement('aside')
  ruleElement.append(aside)

  aside.appendChild(
    DeleteButton({
      onClick: async () => {
        await deleteRuleByMatcher(rule.matcher)
        renderRuleMatchers()
      },
    })
  )

  aside.appendChild(
    ToggleRule({
      enabled: rule.enabled,
      onToggle: async () => {
        await updateRule({ ...rule, enabled: !rule.enabled })
        renderRuleMatchers()
      },
    })
  )

  return ruleElement
}

function ToggleRule(props: { enabled: boolean; onToggle: () => void }) {
  const toggleCircle = createElement('div', {
    className: `toggle-circle`,
  })

  return createElement('div', {
    className: `toggle-container ${
      props.enabled ? 'toggle-container--enabled' : ''
    }`,
    children: [toggleCircle],
    onClick: props.onToggle,
  })
}

// TODO: create -- UIElement class to abstract class setting and text setting, etc
function DeleteButton({ onClick }: { onClick: () => void }) {
  const deleteButtonElement = createElement('button', {
    textContent: 'X',
    className: 'bubble-delete-button',
    onClick,
  })
  return deleteButtonElement
}

addErrorBoundary()
renderRuleMatchers()
