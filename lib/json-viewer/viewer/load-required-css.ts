import { injectCSS } from '../load-css'
import { themeDarkness } from '../theme-darkness'
import type { JsonViewerOptions } from '../storage'

// Build-time CSS imports — embedded in the JS bundle, no network requests
import codemirrorCss from 'codemirror/lib/codemirror.css?inline'
import foldgutterCss from 'codemirror/addon/fold/foldgutter.css?inline'
import dialogCss from 'codemirror/addon/dialog/dialog.css?inline'
import matchesonscrollbarCss from 'codemirror/addon/search/matchesonscrollbar.css?inline'
import viewerCss from '@/public/assets/viewer.css?inline'
import defaultThemeCss from '@/public/assets/default-theme.css?inline'
import editorCustomCss from '@/public/assets/editor-custom.css?inline'

// Theme CSS — lazy loaded via glob import
const themeModules = import.meta.glob<string>('@/public/themes/**/*.css', {
  query: 'inline',
  import: 'default',
})

async function loadThemeCss(theme: string): Promise<void> {
  const darkness = themeDarkness(theme)
  const key = `/public/themes/${darkness}/${theme}.css`
  const loader = themeModules[key]
  if (loader) {
    const css = await loader()
    injectCSS(css, 'json-viewer-theme')
  }
}

export async function loadRequiredCss(
  options: JsonViewerOptions,
): Promise<void> {
  // Inject core CSS (already in JS bundle)
  injectCSS(codemirrorCss, 'json-viewer-codemirror')
  injectCSS(foldgutterCss, 'json-viewer-foldgutter')
  injectCSS(dialogCss, 'json-viewer-dialog')
  injectCSS(matchesonscrollbarCss, 'json-viewer-matchesonscrollbar')
  injectCSS(viewerCss, 'json-viewer-css')
  injectCSS(defaultThemeCss, 'json-viewer-default-theme')
  injectCSS(editorCustomCss, 'json-viewer-editor-custom')

  // Load theme CSS if not default
  if (options.theme && options.theme !== 'default') {
    await loadThemeCss(options.theme)
  }

  // Inject user custom style
  injectCSS(options.style, 'json-viewer-custom-style')
}
