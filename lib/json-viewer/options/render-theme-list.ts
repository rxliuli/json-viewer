import { formatJson } from '../jsl-format'
import { injectCSS } from '../load-css'
import { themeDarkness } from '../theme-darkness'
import { themes } from '../themes'
import type CodeMirror from 'codemirror'

const themeModules = import.meta.glob<string>('@/public/themes/**/*.css', {
  query: 'inline',
  import: 'default',
})

const themeDefault = 'default'
const themeJSONExample = {
  title: 'JSON Example',
  nested: {
    someInteger: 7,
    someBoolean: true,
    someArray: ['list of', 'fake strings', 'and fake keys'],
  },
}

function onThemeChange(input: HTMLSelectElement, editor: CodeMirror.Editor): void {
  const selectedTheme = input.options[input.selectedIndex].value
  const themeOption = selectedTheme.replace(/_/, ' ')

  const currentLinkTag = document.getElementById('selected-theme')
  if (currentLinkTag !== null) {
    document.head.removeChild(currentLinkTag)
  }

  if (selectedTheme === 'default') {
    editor.setOption('theme', themeOption)
  } else {
    const darkness = themeDarkness(selectedTheme)
    const key = `/public/themes/${darkness}/${selectedTheme}.css`
    const loader = themeModules[key]
    if (loader) {
      loader().then((css) => {
        injectCSS(css, 'selected-theme')
        editor.setOption('theme', themeOption)
      })
    }
  }
}

export function renderThemeList(CM: typeof CodeMirror, value: string): void {
  const themesInput = document.getElementById('themes') as HTMLSelectElement
  const themesExampleInput = document.getElementById('themes-example') as HTMLTextAreaElement
  themesExampleInput.innerHTML = formatJson(JSON.stringify(themeJSONExample))

  const themeEditor = CM.fromTextArea(themesExampleInput, {
    readOnly: true,
    mode: 'application/ld+json',
    lineWrapping: true,
    lineNumbers: true,
    tabSize: 2,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  })

  themesInput.onchange = () => {
    onThemeChange(themesInput, themeEditor)
  }

  const optionSelected = value
  themesInput.appendChild(createOption(themeDefault, optionSelected))
  themesInput.appendChild(createThemeGroup('Light', themes.light, optionSelected))
  themesInput.appendChild(createThemeGroup('Dark', themes.dark, optionSelected))

  if (optionSelected && optionSelected !== 'default') {
    themesInput.onchange(null as any)
  }
}

function createOption(theme: string, optionSelected: string): HTMLOptionElement {
  const option = document.createElement('option')
  option.value = theme
  option.text = theme
  if (theme === optionSelected) {
    option.selected = true
  }
  return option
}

function createGroup(label: string): HTMLOptGroupElement {
  const group = document.createElement('optgroup')
  group.label = label
  return group
}

function createThemeGroup(name: string, list: string[], optionSelected: string): HTMLOptGroupElement {
  const group = createGroup(name)
  list.forEach((theme) => {
    group.appendChild(createOption(theme, optionSelected))
  })
  return group
}
