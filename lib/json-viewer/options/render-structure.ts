import { formatJson } from '../jsl-format'
import type CodeMirror from 'codemirror'

export function renderStructure(CM: typeof CodeMirror, value: Record<string, any>): CodeMirror.Editor {
  const structureInput = document.getElementById('structure') as HTMLTextAreaElement
  structureInput.innerHTML = formatJson(JSON.stringify(value))

  return CM.fromTextArea(structureInput, {
    mode: 'application/ld+json',
    lineWrapping: true,
    lineNumbers: true,
    tabSize: 2,
  })
}
