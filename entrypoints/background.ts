import { messager } from '@/lib/message'

export default defineBackground(() => {
  messager.onMessage('openOptions', () => {
    browser.runtime.openOptionsPage()
  })

  // Omnibox support (not available in Safari)
  if (browser.omnibox) {
    browser.omnibox.onInputChanged.addListener((text, suggest) => {
      console.log('[JSONViewer] inputChanged: ' + text)
      suggest([
        {
          content: 'Format JSON',
          description: '(Format JSON) Open a page with json highlighted',
        },
        {
          content: 'Scratch pad',
          description: '(Scratch pad) Area to write and format/highlight JSON',
        },
      ])
    })

    browser.omnibox.onInputEntered.addListener((text) => {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const omniboxUrl = browser.runtime.getURL('/omnibox.html')
        const path = /scratch pad/i.test(text)
          ? '?scratch-page=true'
          : '?json=' + encodeURIComponent(text)
        const url = omniboxUrl + path

        console.log('[JSONViewer] Opening: ' + url)

        if (tabs[0]?.id) {
          browser.tabs.update(tabs[0].id, { url })
        }
      })
    })
  }
})
