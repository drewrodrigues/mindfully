// TODO: show rule ids on options
// TODO: show delete button

// TODO: show saved rules and which are enabled ('dynamic rules')
// TODO: allow enable, disabling rules

// TODO: reload options on re-mount

const { getDynamicRules, addDynamicRule } = require('./helpers/storage')

const WEBSITE_MATCHER = 'website-matcher'

const websiteContainer = document.querySelector("[data-id='websites']")
const websiteAdditionForm = document.querySelector(
  "[data-id='website-addition-form']"
)
const websiteMatcherInput = document.querySelector(
  "[data-id='website-matcher-input']"
)

let rules = null

websiteAdditionForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(websiteAdditionForm)
  const ruleMatcher = formData.get(WEBSITE_MATCHER).toLocaleLowerCase()
  const newRules = [ruleMatcher, ...rules]

  chrome.storage.sync.set({ rules: newRules }).then(async () => {
    const rule = await addDynamicRule(ruleMatcher)
    websiteContainer.prepend(RuleBubble(rule))
    websiteMatcherInput.value = ''
    rules = newRules
  })
})

async function renderWebsiteMatchesFromStorage() {
  rules = await getDynamicRules()
  console.log('Got rules', rules)

  const elementsToAdd = []
  for (const rule of rules) {
    elementsToAdd.unshift(RuleBubble(rule))
  }
  websiteContainer.append(...elementsToAdd)
}

function RuleBubble(rule) {
  const websiteElement = document.createElement('div')
  websiteElement.textContent = rule.condition.urlFilter
  websiteElement.className = 'bubble'
  return websiteElement
}

renderWebsiteMatchesFromStorage()
