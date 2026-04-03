export function merge(...args: Record<string, any>[]): Record<string, any> {
  const obj: Record<string, any> = {}
  for (const arg of args) {
    for (const key in arg) {
      if (Object.prototype.hasOwnProperty.call(arg, key)) {
        obj[key] = arg[key]
      }
    }
  }
  return obj
}
