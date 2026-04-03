import { extractJSON } from './extract-json'

let bodyModified = false

function allTextNodes(nodes: NodeListOf<ChildNode>): boolean {
  return !Array.from(nodes).some((node) => node.nodeName !== '#text')
}

function getPreWithSource(): HTMLPreElement | null {
  const childNodes = document.body.childNodes

  if (childNodes.length === 0) {
    return null
  }

  if (childNodes.length > 1 && allTextNodes(childNodes)) {
    if (import.meta.env.DEV) {
      console.debug(
        '[JSONViewer] Loaded from a multiple text nodes, normalizing',
      )
    }
    document.body.normalize()
  }

  const childNode = childNodes[0]
  const nodeName = childNode.nodeName
  const textContent = childNode.textContent

  if (nodeName === 'PRE') {
    return childNode as HTMLPreElement
  }

  if (nodeName === '#text' && textContent && textContent.trim().length > 0) {
    if (import.meta.env.DEV) {
      console.debug(
        '[JSONViewer] Loaded from a text node, this might have returned content-type: text/html',
      )
    }

    const pre = document.createElement('pre')
    pre.textContent = textContent
    document.body.removeChild(childNode)
    document.body.appendChild(pre)
    bodyModified = true
    return pre
  }

  return null
}

function restoreNonJSONBody(): void {
  const artificialPre = document.body.lastChild!
  const removedChildNode = document.createTextNode(
    artificialPre.textContent || '',
  )
  document.body.insertBefore(removedChildNode, document.body.firstChild)
  document.body.removeChild(artificialPre)
}

export function isJSON(jsonStr: string): boolean {
  let str = jsonStr
  if (!str || str.length === 0) {
    return false
  }

  str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
  str = str.replace(
    /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    ']',
  )
  str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '')
  return /^[\],:{}\s]*$/.test(str)
}

function isJSONP(jsonStr: string): boolean {
  return isJSON(extractJSON(jsonStr))
}

export function checkIfJson(
  successCallback: (pre: HTMLPreElement) => void,
  element?: HTMLPreElement,
): void {
  const pre = element || getPreWithSource()

  if (
    pre !== null &&
    pre !== undefined &&
    pre.textContent !== null &&
    (isJSON(pre.textContent) || isJSONP(pre.textContent))
  ) {
    successCallback(pre)
  } else if (bodyModified) {
    restoreNonJSONBody()
  }
}
