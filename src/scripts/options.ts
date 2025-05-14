import { addErrorBoundary } from './utils/addErrorBoundary'
import { createElement } from './utils/elements'
import { IRule, deleteRuleByMatcher, updateRule } from './utils/rules'

// TODO: new Date(1747169524244).toLocaleTimeString()
// Re-write really quick with React, vanilla JS is boring

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
      },
    })
  )

  aside.appendChild(
    ToggleRule({
      enabled: rule.enabled,
      onToggle: async () => {
        await updateRule({ ...rule, enabled: !rule.enabled })
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
