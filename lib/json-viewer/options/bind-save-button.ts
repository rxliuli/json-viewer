import type CodeMirror from 'codemirror'

export function bindSaveButton(
  editors: CodeMirror.Editor[],
  onSaveClicked: (output: Record<string, string>) => void,
): void {
  const form = document.getElementById('options') as HTMLFormElement
  form.onsubmit = () => false

  const saveButton = document.getElementById('save')!
  saveButton.onclick = (e) => {
    e.preventDefault()

    editors.forEach((editor) => {
      editor.save()
    })

    const output: Record<string, string> = {}
    for (let i = 0; i < form.elements.length; i++) {
      const el = form.elements[i] as HTMLInputElement
      if (!/-example$/.test(el.name) && el.name.length !== 0) {
        output[el.name] = el.value
      }
    }

    onSaveClicked(output)
  }
}
