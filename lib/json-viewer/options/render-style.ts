import type CodeMirror from 'codemirror'

export function renderStyle(CM: typeof CodeMirror, value: string): CodeMirror.Editor {
  const styleInput = document.getElementById('style') as HTMLTextAreaElement
  styleInput.innerHTML = value

  return CM.fromTextArea(styleInput, {
    mode: 'css',
    lineWrapping: true,
    lineNumbers: true,
    tabSize: 2,
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
  })
}
