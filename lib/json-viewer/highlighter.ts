import CodeMirror from 'codemirror'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/scroll/annotatescrollbar'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/search'
import 'codemirror/mode/javascript/javascript'
import { merge } from './merge'
import { defaults } from './options/defaults'
import { URL_PATTERN } from './url-pattern'
import type { JsonViewerOptions } from './storage'

const F_LETTER = 70

export class Highlighter {
  options: JsonViewerOptions
  text: string
  defaultSearch: boolean
  theme: string
  editor!: CodeMirror.Editor

  constructor(jsonText: string, options: JsonViewerOptions) {
    this.options = options || ({} as JsonViewerOptions)
    this.text = jsonText
    this.defaultSearch = false
    this.theme = this.options.theme || 'default'
    this.theme = this.theme.replace(/_/, ' ')
  }

  highlight(): void {
    this.editor = CodeMirror(document.body, this.getEditorOptions() as any)
    if (!this.alwaysRenderAllContent()) this.preventDefaultSearch()
    if (this.isReadOnly())
      this.getDOMEditor()!.className += ' read-only'

    this.bindRenderLine()
    this.bindMousedown()
    this.editor.refresh()
    this.editor.focus()
  }

  hide(): void {
    this.getDOMEditor()!.hidden = true
    this.defaultSearch = true
  }

  show(): void {
    this.getDOMEditor()!.hidden = false
    this.defaultSearch = false
  }

  getDOMEditor(): HTMLElement | null {
    return document.getElementsByClassName('CodeMirror')[0] as HTMLElement
  }

  fold(): void {
    let skippedRoot = false
    const firstLine = this.editor.firstLine()
    const lastLine = this.editor.lastLine()

    for (let line = firstLine; line <= lastLine; line++) {
      if (!skippedRoot) {
        if (/(\[|\{)/.test(this.editor.getLine(line)!.trim()))
          skippedRoot = true
      } else {
        this.editor.foldCode({ line, ch: 0 }, undefined, 'fold')
      }
    }
  }

  unfoldAll(): void {
    for (let line = 0; line < this.editor.lineCount(); line++) {
      this.editor.foldCode({ line, ch: 0 }, undefined, 'unfold')
    }
  }

  bindRenderLine(): void {
    this.editor.off('renderLine', undefined as any)
    this.editor.on('renderLine', (_cm: any, _line: any, element: HTMLElement) => {
      const elementsNode = element.getElementsByClassName('cm-string')
      if (!elementsNode || elementsNode.length === 0) return

      const elements: HTMLElement[] = []
      for (let i = 0; i < elementsNode.length; i++) {
        elements.push(elementsNode[i] as HTMLElement)
      }

      const textContent = elements.reduce(
        (str, node) => str + node.textContent,
        '',
      )

      const text = this.removeQuotes(textContent)

      if (text.match(URL_PATTERN) && this.clickableUrls()) {
        const decodedText = this.decodeText(text)
        elements.forEach((node) => {
          if (this.wrapLinkWithAnchorTag()) {
            const linkTag = document.createElement('a')
            linkTag.href = decodedText
            linkTag.setAttribute('target', '_blank')
            linkTag.classList.add('cm-string')

            Array.from(node.childNodes).forEach((child) => {
              linkTag.appendChild(child)
            })

            linkTag.addEventListener('contextmenu', (e) => {
              if (e.bubbles) e.cancelBubble = true
            })

            node.appendChild(linkTag)
          } else {
            node.classList.add('cm-string-link')
            node.setAttribute('data-url', decodedText)
          }
        })
      }
    })
  }

  bindMousedown(): void {
    this.editor.off('mousedown', undefined as any)
    this.editor.on('mousedown', (_cm: any, event: MouseEvent) => {
      const element = event.target as HTMLElement
      if (element.classList.contains('cm-string-link')) {
        const url = element.getAttribute('data-url')
        let target: string = '_self'
        if (this.openLinksInNewWindow()) {
          target = '_blank'
        }
        window.open(url!, target)
      }
    })
  }

  removeQuotes(text: string): string {
    return text.replace(/^\"+/, '').replace(/\"+$/, '')
  }

  includeQuotes(text: string): string {
    return '"' + text + '"'
  }

  decodeText(text: string): string {
    const div = document.createElement('div')
    div.innerHTML = text
    return div.firstChild ? (div.firstChild as Text).nodeValue || '' : ''
  }

  getEditorOptions(): Record<string, any> {
    const obligatory: Record<string, any> = {
      value: this.text,
      theme: this.theme,
      readOnly: this.isReadOnly() ? true : false,
      mode: 'application/ld+json',
      indentUnit: 2,
      tabSize: 2,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      extraKeys: this.getExtraKeysMap(),
    }

    if (this.alwaysRenderAllContent()) {
      obligatory.viewportMargin = Infinity
    }

    const optional = defaults.structure
    const configured = this.options.structure

    return merge({}, optional, configured, obligatory)
  }

  getExtraKeysMap(): Record<string, any> {
    const extraKeyMap: Record<string, any> = {
      Esc: (cm: CodeMirror.Editor) => {
        ;(CodeMirror as any).commands.clearSearch(cm)
        cm.setSelection(cm.getCursor())
        cm.focus()
      },
    }

    if (this.options.structure.readOnly) {
      extraKeyMap['Enter'] = (cm: CodeMirror.Editor) => {
        ;(CodeMirror as any).commands.findNext(cm)
      }

      extraKeyMap['Shift-Enter'] = (cm: CodeMirror.Editor) => {
        ;(CodeMirror as any).commands.findPrev(cm)
      }

      extraKeyMap['Ctrl-V'] = extraKeyMap['Cmd-V'] = () => {}
    }

    const nativeSearch = this.alwaysRenderAllContent()
    extraKeyMap['Ctrl-F'] = nativeSearch ? false : this.openSearchDialog
    extraKeyMap['Cmd-F'] = nativeSearch ? false : this.openSearchDialog
    return extraKeyMap
  }

  preventDefaultSearch(): void {
    document.addEventListener(
      'keydown',
      (e) => {
        const metaKey = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey
        if (!this.defaultSearch && e.keyCode === F_LETTER && metaKey) {
          e.preventDefault()
        }
      },
      false,
    )
  }

  openSearchDialog(cm: CodeMirror.Editor): void {
    cm.setCursor({ line: 0, ch: 0 })
    ;(CodeMirror as any).commands.find(cm)
  }

  alwaysRenderAllContent(): boolean {
    return (
      this.options.addons.alwaysRenderAllContent ||
      this.options.addons.awaysRenderAllContent
    )
  }

  clickableUrls(): boolean {
    return this.options.addons.clickableUrls
  }

  wrapLinkWithAnchorTag(): boolean {
    return this.options.addons.wrapLinkWithAnchorTag
  }

  openLinksInNewWindow(): boolean {
    return this.options.addons.openLinksInNewWindow
  }

  isReadOnly(): boolean {
    return this.options.structure.readOnly
  }
}
