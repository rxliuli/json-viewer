import { defineExtensionMessaging } from '@webext-core/messaging'

export const messager = defineExtensionMessaging<{
  openOptions(): void
}>()
