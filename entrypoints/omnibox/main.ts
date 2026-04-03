import { checkIfJson } from '@/lib/json-viewer/check-if-json'
import { highlightContent } from '@/lib/json-viewer/highlight-content'
import { loadEditor } from '@/lib/json-viewer/scratch-pad/load-editor'

function onLoad(): void {
  const pre = document.getElementsByTagName('pre')[0]
  const query = window.location.search.substring(1)

  if (isScratchPad(query)) handleScratchPad(pre)
  else handleJSONHighlight(pre, query)
}

function handleScratchPad(pre: HTMLPreElement): void {
  pre.hidden = true
  loadEditor(pre)
}

function handleJSONHighlight(pre: HTMLPreElement, query: string): void {
  const rawJson = query.replace(/^json=/, '')
  pre.innerText = decodeURIComponent(rawJson)

  checkIfJson((pre) => {
    pre.hidden = true
    highlightContent(pre, true)
  }, pre)
}

function isScratchPad(query: string): boolean {
  return /scratch-page=true/.test(query)
}

document.addEventListener('DOMContentLoaded', onLoad, false)
