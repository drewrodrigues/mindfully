import { goToErrorPage } from './navigation'

export function addErrorBoundary() {
  window.addEventListener(
    'unhandledrejection',
    (error: PromiseRejectionEvent) => {
      goToErrorPage(error.reason)
    }
  )
}
