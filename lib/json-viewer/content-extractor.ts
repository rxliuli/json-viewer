import { formatJson } from './jsl-format'
import { extractJSON } from './extract-json'
import type { JsonViewerOptions } from './storage'

const TOKEN = (Math.random() + 1).toString(36).slice(2, 7)
const WRAP_START = '<wrap_' + TOKEN + '>'
const WRAP_END = '</wrap_' + TOKEN + '>'
const NUM_REGEX = /^-?\d+\.?\d*([eE]\+)?\d*$/g
const ESCAPED_REGEX = '(-?\\d+\\.?\\d*([eE]\\+)?\\d*)'

const REPLACE_WRAP_REGEX = new RegExp(
  '"' + WRAP_START + ESCAPED_REGEX + WRAP_END + '"',
  'g',
)

export interface ExtractedContent {
  jsonText: string
  jsonExtracted: string
}

export function contentExtractor(
  pre: HTMLPreElement,
  options: JsonViewerOptions,
): Promise<ExtractedContent> {
  return new Promise((resolve, reject) => {
    try {
      const rawJsonText = pre.textContent || ''
      const jsonExtracted = extractJSON(rawJsonText)
      const wrappedText = wrapNumbers(jsonExtracted)

      let jsonParsed = JSON.parse(wrappedText)
      if (options.addons.sortKeys) jsonParsed = sortByKeys(jsonParsed)

      let decodedJson = JSON.stringify(jsonParsed)
      decodedJson = decodedJson.replace(REPLACE_WRAP_REGEX, '$1')

      const jsonFormatted = normalize(formatJson(decodedJson, options.structure))
      const jsonText = normalize(rawJsonText).replace(
        normalize(jsonExtracted),
        jsonFormatted,
      )
      resolve({ jsonText, jsonExtracted: decodedJson })
    } catch (e: any) {
      reject(new Error('contentExtractor: ' + e.message))
    }
  })
}

function normalize(json: string): string {
  return json.replace(/\$/g, '$$$$')
}

function sortByKeys(obj: any): any {
  if (typeof obj !== 'object' || !obj) return obj

  let sorted: any
  if (Array.isArray(obj)) {
    sorted = []
    obj.forEach((val: any, idx: number) => {
      sorted[idx] = sortByKeys(val)
    })
  } else {
    sorted = {}
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sorted[key] = sortByKeys(obj[key])
      })
  }

  return sorted
}

function wrapNumbers(text: string): string {
  let buffer = ''
  let numberBuffer = ''
  let isInString = false
  let charIsEscaped = false
  let isInNumber = false
  let previous = ''

  for (let i = 0, len = text.length; i < len; i++) {
    const char = text[i]

    if (char == '"' && !charIsEscaped) {
      isInString = !isInString
    }

    if (!isInString && !isInNumber && isCharInNumber(char, previous)) {
      isInNumber = true
    }

    if (!isInString && isInNumber && isCharInString(char)) {
      isInNumber = false

      if (numberBuffer.match(NUM_REGEX)) {
        buffer += '"' + WRAP_START + numberBuffer + WRAP_END + '"'
      } else {
        buffer += numberBuffer
      }

      numberBuffer = ''
    }

    charIsEscaped = char == '\\' ? !charIsEscaped : false

    if (isInNumber) {
      numberBuffer += char
    } else {
      buffer += char
      previous = char
    }
  }

  return buffer
}

function isCharInNumber(char: string, previous: string): boolean {
  return (
    ('0' <= char && char <= '9') ||
    ('0' <= previous && previous <= '9' && (char == 'e' || char == 'E')) ||
    (('e' == previous || 'E' == previous) && char == '+') ||
    char == '.' ||
    char == '-'
  )
}

function isCharInString(char: string): boolean {
  return (
    ('0' > char || char > '9') &&
    char != 'e' &&
    char != 'E' &&
    char != '+' &&
    char != '.' &&
    char != '-'
  )
}
