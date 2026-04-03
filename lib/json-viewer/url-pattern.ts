function relativePath() {
  return '(?:[/?#]\\S*)?'
}

function absolutePath() {
  return (
    '(?:(?:https?|ftp)://)' +
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
    '(?:\\[[a-f0-9.:]+\\])' +
    '|' +
    '(?:[a-z0-9\\u00a1-\\uffff.-]+)' +
    ')' +
    '(?::\\d{2,5})?' +
    relativePath()
  )
}

export const URL_PATTERN = new RegExp(
  '^(' + absolutePath() + '|' + relativePath() + ')$',
  'i',
)
