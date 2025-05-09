// -----------------------------------------------------------------------------
// Parse error message from search string in redirect and show it in the page
// -----------------------------------------------------------------------------

import { getElement } from './utils/elements'

const searchParams = new URLSearchParams(window.location.search)
const errorMessage = searchParams.get('errorMessage')

const errorBoundaryMessageElement = getElement('errorBoundaryMessage')
errorBoundaryMessageElement.textContent = errorMessage
