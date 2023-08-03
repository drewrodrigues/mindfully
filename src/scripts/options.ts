// TODO: change page name to rules

import { DynamicRule, deleteDynamicsRule } from './helpers/dynamicRule'
import { getElement } from './helpers/elements'

const { saveSavedRule } = require('./helpers/rules')
const { getDynamicRules, addDynamicRule } = require('./helpers/storage')

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

async function renderWebsiteMatchesFromStorage() {
  const rules = await getDynamicRules()
  console.log('Got rules', rules)

  const elementsToAdd = []
  for (const rule of rules) {
    elementsToAdd.unshift(RuleBubble(rule))
  }
  websiteContainer.innerHTML = null
  websiteContainer.append(...elementsToAdd)
}

function RuleBubble(rule: DynamicRule) {
  const websiteElement = document.createElement('div')
  websiteElement.textContent = rule.condition.urlFilter
  websiteElement.className = 'bubble'

  websiteElement.appendChild(
    DeleteButton(() => {
      // ! this should be deleteRule and then deleteDynamicRule
      deleteDynamicsRule(rule)
      renderWebsiteMatchesFromStorage()
    })
  )

  return websiteElement
}

function DeleteButton(onClick: () => void) {
  const deleteButtonElement = document.createElement('button')
  deleteButtonElement.textContent = 'X' // TODO: change me to an icon
  deleteButtonElement.className = 'bubble-delete-button'
  deleteButtonElement.addEventListener('click', onClick)
  return deleteButtonElement
}

renderWebsiteMatchesFromStorage()
