// TODO: change page name to rules

import { DynamicRule, addDynamicRule, deleteDynamicsRule, getDynamicRules } from './helpers/dynamicRule'
import { getElement } from './helpers/elements'
import { deleteSavedRule, deleteSavedRuleByMatcher } from './helpers/rules'

const { saveSavedRule } = require('./helpers/rules')

const WEBSITE_MATCHER = 'website-matcher'

const websiteContainer = getElement('websites')
const websiteAdditionForm = getElement('website-addition-form')
const websiteMatcherInput = getElement(
  'website-matcher-input'
) as HTMLInputElement

websiteAdditionForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(websiteAdditionForm as HTMLFormElement)
  const ruleMatcher = formData
    .get(WEBSITE_MATCHER)
    .toString()
    .toLocaleLowerCase()
  await saveSavedRule(ruleMatcher)

  const dynamicRule = await addDynamicRule(ruleMatcher)
  websiteContainer.prepend(RuleBubble(dynamicRule))
  websiteMatcherInput.value = ''
})

async function renderRuleMatchers() {
  const dynamicRules = await getDynamicRules()
  const elementsToRender = []

  for (const dynamicRule of dynamicRules) {
    elementsToRender.unshift(RuleBubble(dynamicRule))
  }

  websiteContainer.innerHTML = null
  websiteContainer.append(...elementsToRender)
}

function RuleBubble(rule: DynamicRule) {
  const websiteElement = document.createElement('div')
  websiteElement.textContent = rule.condition.urlFilter
  websiteElement.className = 'bubble'

  websiteElement.appendChild(
    DeleteButton({
      onClick: async () => {
        await deleteSavedRuleByMatcher(rule.condition.urlFilter)
        await deleteDynamicsRule(rule)
        renderRuleMatchers()
      },
    })
  )

  return websiteElement
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
