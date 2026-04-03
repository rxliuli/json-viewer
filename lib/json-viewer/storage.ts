import { defaults } from './options/defaults'
import { merge } from './merge'

const NAMESPACE = 'v2.options'

export interface JsonViewerOptions {
  theme: string
  addons: Record<string, any>
  structure: Record<string, any>
  style: string
}

export async function saveOptions(obj: Record<string, any>): Promise<void> {
  await browser.storage.local.set({ [NAMESPACE]: JSON.stringify(obj) })
}

export async function loadOptions(): Promise<JsonViewerOptions> {
  const result = await browser.storage.local.get(NAMESPACE)
  const optionsStr: string | null = result[NAMESPACE] || null

  const raw = optionsStr ? JSON.parse(optionsStr) : {}
  const options: JsonViewerOptions = {
    theme: raw.theme || defaults.theme,
    addons: raw.addons ? JSON.parse(raw.addons) : {},
    structure: raw.structure
      ? JSON.parse(raw.structure)
      : defaults.structure,
    style:
      raw.style && raw.style.length > 0 ? raw.style : defaults.style,
  }
  options.addons = merge({}, defaults.addons, options.addons)
  return options
}
