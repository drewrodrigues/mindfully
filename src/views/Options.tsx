import { createRoot } from 'react-dom/client'
import React, { FormEvent, useEffect, useState } from 'react'
import {
  deleteRuleByMatcher,
  getSavedRules,
  IRule,
  saveRule,
} from '../scripts/utils/rules'

function Options() {
  const [websiteMatcher, setWebsiteMatcher] = useState<string>('')
  const [rules, setRules] = useState<IRule[]>([])

  async function onRuleAdd(e: FormEvent) {
    e.preventDefault()
    if (!websiteMatcher) return
    const rule = await saveRule(websiteMatcher)
    setWebsiteMatcher('')
    setRules([...rules, rule])
  }

  async function onDeleteRuleClick(rule: IRule) {
    await deleteRuleByMatcher(rule.matcher)
    setRules(rules.filter((_rule) => _rule !== rule))
  }

  useEffect(() => {
    ;(async () => {
      const _rules = await getSavedRules()
      console.log(_rules)
      setRules(_rules)
    })()
  }, [])

  return (
    <div>
      <header className="header">
        <h1 className="logo">Mindfully</h1>

        <p>Rules</p>
      </header>

      <main className="option-container">
        <form
          className="website-add-container bubble"
          data-id="websiteAdditionForm"
          onSubmit={onRuleAdd}
        >
          <input
            type="text"
            placeholder="Add a new website here..."
            className="website-input"
            name="website-matcher"
            data-id="websiteMatcherInput"
            autoFocus
            onChange={(e) => setWebsiteMatcher(e.target.value)}
            value={websiteMatcher}
          />
          <button className="website-button">Add</button>
        </form>

        <h3 className="section-header">Rules</h3>
        <div className="website-container">
          {rules.map((rule) => (
            <div className="bubble" key={rule.id}>
              {rule.matcher}

              <aside>
                <button
                  className="bubble-delete-button"
                  onClick={() => onDeleteRuleClick(rule)}
                >
                  X
                </button>
              </aside>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<Options />)
