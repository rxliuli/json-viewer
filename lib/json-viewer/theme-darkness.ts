import { themes } from './themes'

export function themeDarkness(name: string): 'light' | 'dark' {
  if (themes.dark.indexOf(name) !== -1) return 'dark'
  return 'light'
}
