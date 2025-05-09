import { addErrorBoundary } from './utils/addErrorBoundary'
import { addDynamicRule, deleteDynamicsRule } from './utils/dynamicRule'
import { createElement, getElement } from './utils/elements'
import { goToErrorPage } from './utils/navigation'
import {
  ISavedRule,
  deleteSavedRuleByMatcher,
  getSavedRules,
  updateSavedRule,
} from './utils/rules'

const { saveSavedRule } = require('./utils/rules')

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
  const savedRule = await saveSavedRule(ruleMatcher)

  // await addDynamicRule(ruleMatcher) // ! we don't need this anymore
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

function RuleBubble(rule: ISavedRule) {
  const ruleElement = createElement('div', {
    textContent: rule.matcher,
    className: 'bubble',
  })

  const aside = createElement('aside')
  ruleElement.append(aside)

  aside.appendChild(
    DeleteButton({
      onClick: async () => {
        await deleteSavedRuleByMatcher(rule.matcher)
        // await deleteDynamicsRule(rule.matcher)
        renderRuleMatchers()
      },
    })
  )

  aside.appendChild(
    ToggleRule({
      enabled: rule.enabled,
      onToggle: async () => {
        await updateSavedRule({ ...rule, enabled: !rule.enabled })
        if (rule.enabled) {
          // await deleteDynamicsRule(rule.matcher)
        } else {
          await addDynamicRule(rule.matcher)
        }
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
