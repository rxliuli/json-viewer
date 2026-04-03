function twoDigits(number: number): string {
  const str = number + ''
  if (str.length === 1) {
    return '0' + str
  }
  return str
}

export function getTimestamp(): string {
  const date = new Date()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()

  return (
    date.getFullYear() +
    twoDigits(month) +
    twoDigits(day) +
    twoDigits(hour) +
    twoDigits(min) +
    twoDigits(sec)
  )
}
