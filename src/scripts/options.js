// TODO: show rule ids on options
// TODO: show delete button
// TODO: show saved rules and which are enabled ('dynamic rules')
// TODO: allow enable, disabling rules
// TODO: reload options on re-mount

const {
  getDynamicRules,
  addDynamicRule,
  deleteRules,
  getSavedRules,
} = require('./helpers/storage')

const WEBSITE_MATCHER = 'website-matcher'

const websiteContainer = document.querySelector("[data-id='websites']")
const websiteAdditionForm = document.querySelector(
  "[data-id='website-addition-form']"
)
const websiteMatcherInput = document.querySelector(
  "[data-id='website-matcher-input']"
)

websiteAdditionForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(websiteAdditionForm)
  const ruleMatcher = formData.get(WEBSITE_MATCHER).toLocaleLowerCase()
  const rules = await getSavedRules()
  const newRules = [ruleMatcher, ...rules]

  // TODO: pull this out into Storage.ts (all storage interactions should be pass over there)
  chrome.storage.sync.set({ rules: newRules }).then(async () => {
    const rule = await addDynamicRule(ruleMatcher)
    websiteContainer.prepend(RuleBubble(rule))
    websiteMatcherInput.value = ''
  })
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

function RuleBubble(rule) {
  const websiteElement = document.createElement('div')
  websiteElement.textContent = rule.condition.urlFilter
  websiteElement.className = 'bubble'

  websiteElement.appendChild(
    DeleteButton(() => {
      deleteRules([rule])
      renderWebsiteMatchesFromStorage()
    })
  )

  return websiteElement
}

function DeleteButton(onClick) {
  const deleteButtonElement = document.createElement('button')
  deleteButtonElement.textContent = 'X' // TODO: change me to an icon
  deleteButtonElement.className = 'bubble-delete-button'
  deleteButtonElement.addEventListener('click', onClick)
  return deleteButtonElement
}

renderWebsiteMatchesFromStorage()
