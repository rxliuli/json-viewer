/**
 * Inject CSS text as an inline <style> element.
 * This bypasses page CSP restrictions (e.g. `default-src 'none'`)
 * that block external <link> and fetch() requests,
 * as long as `style-src 'unsafe-inline'` is present.
 */
export function injectCSS(css: string, id?: string): void {
  if (id && document.getElementById(id)) return

  const style = document.createElement('style')
  if (id) style.id = id
  style.textContent = css
  document.head.appendChild(style)
}
