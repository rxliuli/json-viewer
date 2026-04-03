import { loadOptions, type JsonViewerOptions } from '../storage'

export function getOptions(): Promise<JsonViewerOptions> {
  return loadOptions()
}
