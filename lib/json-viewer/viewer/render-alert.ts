import { injectCSS } from '../load-css'
import type { JsonViewerOptions } from '../storage'
import viewerAlertCss from '@/public/assets/viewer-alert.css?inline'

export function renderAlert(
  pre: HTMLPreElement,
  options: JsonViewerOptions,
  content: HTMLElement,
): void {
  const alertContainer = document.createElement('div')
  alertContainer.className = 'json-viewer-alert'
  alertContainer.appendChild(content)

  const closeBtn = document.createElement('a')
  closeBtn.className = 'close'
  closeBtn.href = '#'
  closeBtn.title = 'Close'
  closeBtn.innerHTML = '&times;'
  closeBtn.onclick = (e) => {
    e.preventDefault()
    alertContainer.parentNode?.removeChild(alertContainer)
  }

  alertContainer.appendChild(closeBtn)

  injectCSS(viewerAlertCss, 'json-viewer-alert-css')
  document.body.appendChild(alertContainer)
}
