import { defineConfig, UserManifest } from 'wxt'

export default defineConfig({
  modules: ['wxt-module-safari-xcode'],
  srcDir: '.',
  safariXcode: {
    appCategory: 'public.app-category.utilities',
    bundleIdentifier: 'com.rxliuli.json-viewer',
    developmentTeam: '',
  },
  vite: () => ({
    resolve: {
      alias: {
        '@': __dirname,
      },
    },
  }),
  manifestVersion: 3,
  manifest: (env) => {
    const manifest: UserManifest = {
      name: 'JSON Viewer',
      description:
        'The most beautiful and customizable JSON/JSONP highlighter that your eyes have ever seen',
      version: '0.18.1',
      icons: {
        '16': 'icon/16.png',
        '32': 'icon/32.png',
        '128': 'icon/128.png',
      },
      permissions: ['storage'],
      host_permissions: ['<all_urls>'],
      omnibox: { keyword: 'json-viewer' },
      author: {
        email: 'rxliuli@gmail.com',
      },
      homepage_url: 'https://github.com/rxliuli/json-viewer',
      web_accessible_resources: [
        {
          resources: ['assets/*', 'themes/**/*'],
          matches: ['<all_urls>'],
        },
      ],
    }
    if (env.browser === 'firefox') {
      manifest.browser_specific_settings = {
        gecko: {
          id: 'json-viewer@rxliuli.com',
        },
      }
      // @ts-expect-error Firefox requires string author
      manifest.author = 'rxliuli'
    }
    return manifest
  },
  webExt: {
    disabled: true,
  },
})
