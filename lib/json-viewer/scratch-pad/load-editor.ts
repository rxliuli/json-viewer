import { merge } from '../merge'
import { Highlighter } from '../highlighter'
import { getOptions } from '../viewer/get-options'
import { loadRequiredCss } from '../viewer/load-required-css'
import { renderExtras } from '../viewer/render-extras'
import { renderFormatButton } from './render-format-button'
import { formatJson } from '../jsl-format'
import { isJSON } from '../check-if-json'
import { exposeJson } from '../viewer/expose-json'
import type { JsonViewerOptions } from '../storage'

export function loadEditor(pre: HTMLPreElement): void {
  getOptions()
    .then((options) => {
      return loadRequiredCss(options).then(() => {
        const scratchPadOptions = merge(
          {},
          options,
        ) as unknown as JsonViewerOptions
        scratchPadOptions.structure.readOnly = false

        const highlighter = new Highlighter('', scratchPadOptions)
        highlighter.highlight()

        renderExtras(pre, options, highlighter)
        renderFormatButton(() => {
          const text = highlighter.editor.getValue()
          highlighter.editor.setValue(formatJson(text))
          if (isJSON(text)) {
            exposeJson(text)
          }
        })
      })
    })
    .catch((e: Error) => {
      console.error('[JSONViewer] error: ' + e.message, e)
    })
}
