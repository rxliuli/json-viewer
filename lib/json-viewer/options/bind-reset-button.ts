import sweetAlert from 'sweetalert'
import { defaults } from './defaults'
import { saveOptions } from '../storage'

export function bindResetButton(): void {
  const button = document.getElementById('reset')!
  button.onclick = (e) => {
    e.preventDefault()

    sweetAlert({
      title: 'Are you sure?',
      text: 'You will not be able to recover your custom settings',
      icon: 'warning',
      buttons: ['Cancel', 'Yes, reset!'],
      dangerMode: true,
    } as any).then((willReset: boolean) => {
      if (!willReset) return

      const options: Record<string, string> = {}
      options.theme = defaults.theme
      options.addons = JSON.stringify(defaults.addons)
      options.structure = JSON.stringify(defaults.structure)
      options.style = defaults.style

      saveOptions(options).then(() => {
        document.location.reload()
      })
    })
  }
}
