import { addDynamicRule, deleteDynamicsRule } from './helpers/dynamicRule'
import { createElement, getElement } from './helpers/elements'
import {
  ISavedRule,
  deleteSavedRuleByMatcher,
  getSavedRules,
  updateSavedRule,
} from './helpers/rules'

const { saveSavedRule } = require('./helpers/rules')

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

  await addDynamicRule(ruleMatcher)
  websiteContainer.prepend(RuleBubble(savedRule))
  websiteMatcherInput.value = ''
})

async function renderRuleMatchers() {
  const savedRules = await getSavedRules()
  // * we'll sync up dynamic rules in the background and use the saved rules as the source of truth
  console.log({ savedRules })
  const elementsToRender = []

  for (const savedRule of savedRules) {
    elementsToRender.unshift(RuleBubble(savedRule))
  }

  websiteContainer.innerHTML = null
  websiteContainer.append(...elementsToRender)
}

function RuleBubble(rule: ISavedRule) {
  const ruleElement = document.createElement('div')
  ruleElement.textContent = rule.matcher
  ruleElement.className = 'bubble'

  ruleElement.appendChild(
    DeleteButton({
      onClick: async () => {
        await deleteSavedRuleByMatcher(rule.matcher)
        await deleteDynamicsRule(rule.matcher)
        renderRuleMatchers()
      },
    })
  )

  ruleElement.appendChild(
    ToggleRule({
      enabled: rule.enabled,
      onToggle: async () => {
        await updateSavedRule({ ...rule, enabled: !rule.enabled })
        if (rule.enabled) {
          await deleteDynamicsRule(rule.matcher)
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
  const deleteButtonElement = document.createElement('button')
  deleteButtonElement.textContent = 'X'
  deleteButtonElement.className = 'bubble-delete-button'
  deleteButtonElement.addEventListener('click', onClick)
  return deleteButtonElement
}

renderRuleMatchers()
