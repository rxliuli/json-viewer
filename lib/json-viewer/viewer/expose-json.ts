export function exposeJson(text: string): void {
  ;(window as any).json = JSON.parse(text)
  console.info(
    "[JSONViewer] Your json was stored into 'window.json', enjoy! " +
      '(Select the extension context in the devtools console dropdown to access it)',
  )
}
