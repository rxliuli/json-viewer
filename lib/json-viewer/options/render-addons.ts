import { formatJson } from '../jsl-format'
import type CodeMirror from 'codemirror'

export function renderAddons(CM: typeof CodeMirror, value: Record<string, any>): CodeMirror.Editor {
  const addonsInput = document.getElementById('addons') as HTMLTextAreaElement
  addonsInput.innerHTML = formatJson(JSON.stringify(value))

  return CM.fromTextArea(addonsInput, {
    mode: 'application/ld+json',
    lineWrapping: true,
    lineNumbers: true,
    tabSize: 2,
  })
}
