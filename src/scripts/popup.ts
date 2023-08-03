import { getElement } from './helpers/elements'
import { addDynamicRule } from './helpers/storage'
import { goToOptionsPage } from './helpers/navigation'

getElement('popupOptionsButton').addEventListener('click', () => {
  goToOptionsPage()
})

getElement('popupBlockButton').addEventListener('click', (e) => {
  e.preventDefault()

  chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(async (tabs) => {
      const fullUrl = tabs[0].url
      const domain = fullUrl.match(/(?<=https?:\/\/).*\.\w+/)[0]
      await addDynamicRule(domain)
      // ? maybe go to options page?
      chrome.tabs.remove(tabs[0].id)
      chrome.tabs.create({ active: true })
      goToOptionsPage()
    })
})
