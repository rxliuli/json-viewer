import { svgGear } from './svg-gear'
import { svgRaw } from './svg-raw'
import { svgUnfold } from './svg-unfold'
import { themeDarkness } from '../theme-darkness'
import { messager } from '@/lib/message'
import type { JsonViewerOptions } from '../storage'
import type { Highlighter } from '../highlighter'

export function renderExtras(
  pre: HTMLPreElement,
  options: JsonViewerOptions,
  highlighter: Highlighter,
): void {
  const extras = document.createElement('div')
  extras.className = 'extras'

  // Add dark-theme class for dark themes to style icons
  if (options.theme && options.theme !== 'default') {
    const darkness = themeDarkness(options.theme)
    if (darkness === 'dark') {
      extras.className += ' dark-theme'
    }
  }

  if (!options.addons.autoHighlight) {
    extras.className += ' auto-highlight-off'
  }

  const optionsLink = document.createElement('a')
  optionsLink.className = 'json_viewer icon gear'
  optionsLink.href = '#'
  optionsLink.title = 'Options'
  optionsLink.innerHTML = svgGear
  optionsLink.onclick = (e) => {
    e.preventDefault()
    messager.sendMessage('openOptions', undefined)
  }

  const rawLink = document.createElement('a')
  rawLink.className = 'json_viewer icon raw'
  rawLink.href = '#'
  rawLink.title = 'Original JSON toggle'
  rawLink.innerHTML = svgRaw
  rawLink.onclick = (e) => {
    e.preventDefault()

    if (pre.hidden) {
      highlighter.hide()
      pre.hidden = false
      extras.className += ' auto-highlight-off'
    } else {
      highlighter.show()
      pre.hidden = true
      extras.className = extras.className.replace(/\s+auto-highlight-off/, '')
    }
  }

  const unfoldLink = document.createElement('a')
  unfoldLink.className = 'json_viewer icon unfold'
  unfoldLink.href = '#'
  unfoldLink.title = 'Fold/Unfold all toggle'
  unfoldLink.innerHTML = svgUnfold
  unfoldLink.onclick = (e) => {
    e.preventDefault()
    const value = pre.getAttribute('data-folded')

    if (value === 'true') {
      highlighter.unfoldAll()
      pre.setAttribute('data-folded', 'false')
    } else {
      highlighter.fold()
      pre.setAttribute('data-folded', 'true')
    }
  }

  extras.appendChild(optionsLink)
  extras.appendChild(rawLink)

  pre.setAttribute(
    'data-folded',
    String(options.addons.alwaysFold || options.addons.awaysFold || false),
  )
  extras.appendChild(unfoldLink)

  document.body.appendChild(extras)
}
