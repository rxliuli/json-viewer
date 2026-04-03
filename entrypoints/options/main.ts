import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/mode/css/css'
import sweetAlert from 'sweetalert'

import '@/public/assets/default-theme.css'
import '@/public/assets/editor-custom.css'
import './options.scss'

import { loadOptions, saveOptions } from '@/lib/json-viewer/storage'
import { renderThemeList } from '@/lib/json-viewer/options/render-theme-list'
import { renderAddons } from '@/lib/json-viewer/options/render-addons'
import { renderStructure } from '@/lib/json-viewer/options/render-structure'
import { renderStyle } from '@/lib/json-viewer/options/render-style'
import { bindSaveButton } from '@/lib/json-viewer/options/bind-save-button'
import { bindResetButton } from '@/lib/json-viewer/options/bind-reset-button'

function isValidJSON(pseudoJSON: string): boolean {
  try {
    JSON.parse(pseudoJSON)
    return true
  } catch {
    return false
  }
}

function renderVersion(): void {
  const version = browser.runtime.getManifest().version
  const versionLink = document.getElementsByClassName(
    'version',
  )[0] as HTMLAnchorElement
  versionLink.innerHTML = version
  versionLink.href = 'https://github.com/tulios/json-viewer/tree/' + version
}

async function onLoaded(): Promise<void> {
  const currentOptions = await loadOptions()

  renderVersion()
  renderThemeList(CodeMirror, currentOptions.theme)
  const addonsEditor = renderAddons(CodeMirror, currentOptions.addons)
  const structureEditor = renderStructure(CodeMirror, currentOptions.structure)
  const styleEditor = renderStyle(CodeMirror, currentOptions.style)

  bindResetButton()
  bindSaveButton(
    [addonsEditor, structureEditor, styleEditor],
    (options) => {
      if (!isValidJSON(options.addons)) {
        sweetAlert('Ops!', '"Add-ons" isn\'t a valid JSON', 'error')
      } else if (!isValidJSON(options.structure)) {
        sweetAlert('Ops!', '"Structure" isn\'t a valid JSON', 'error')
      } else {
        saveOptions(options).then(() => {
          sweetAlert('Success', 'Options saved!', 'success')
        })
      }
    },
  )
}

document.addEventListener('DOMContentLoaded', onLoaded, false)
