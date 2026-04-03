import { checkIfJson } from '@/lib/json-viewer/check-if-json'
import { highlightContent } from '@/lib/json-viewer/highlight-content'

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_end',
  main() {
    checkIfJson((pre) => {
      pre.hidden = true
      highlightContent(pre)
    })
  },
})
