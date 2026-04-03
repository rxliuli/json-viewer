![JSONViewer Logo](https://raw.githubusercontent.com/rxliuli/json-viewer/master/logo.png)

# JSON Viewer

![screenshot](https://raw.githubusercontent.com/rxliuli/json-viewer/master/screenshot.png)

The most beautiful and customizable JSON/JSONP highlighter that your eyes have ever seen.

> This is a fork of [tulios/json-viewer](https://github.com/tulios/json-viewer), maintained by [@rxliuli](https://github.com/rxliuli). The original project has not been updated for 4 years and no longer works on recent versions of Chrome. This fork modernizes the project without changing any functionality — migrating from Webpack to [WXT](https://wxt.dev/), upgrading from Manifest V2 to V3, and adding support for Chrome, Firefox, and Safari.

Notes:

* This extension might crash with other JSON highlighters/formatters, you may need to disable them
* To highlight local files and incognito tabs you have to manually enable these options on the extensions page
* Works on local files (if you enable this in chrome://extensions)

Features:

* Syntax highlighting
* 27 built-in themes
* Collapsible nodes
* Clickable URLs (optional)
* URL does not matter (the content is analysed to determine if its a JSON or not)
* Inspect your json typing "json" in the console
* Hot word `json-viewer` into omnibox (type `json-viewer` + TAB and paste your JSON into omnibox, hit ENTER and it will be highlighted)
* Toggle button to view the raw/highlighted version
* Works with numbers bigger than Number.MAX_VALUE
* Option to show line numbers
* Option to customize your theme
* Option to customize the tab size
* Option to configure a max JSON size to highlight
* Option to collapse nodes from second level + Button to unfold all collapsed nodes
* Option to include a header with timestamp + url
* Option to allow the edition of the loaded JSON
* Option to sort json by keys
* Option to disable auto highlight
* Option for C-style braces and arrays
* Scratch pad, a new area which you can type/paste JSON and format indefinitely using a button or key shortcut. To access type `json-viewer` + `TAB` + `scratch pad` ENTER
* **Multi-browser support**: Chrome, Firefox, Safari

## Installation

### Compile and load by yourself

  1. Install [Node.js](https://nodejs.org/) (v18+) and [pnpm](https://pnpm.io/)
  2. `pnpm install`
  3. Build for your target browser:
     - Chrome: `pnpm build`
     - Firefox: `pnpm build:firefox`
     - Safari: `pnpm build:safari`
  4. Load the extension:
     - **Chrome**: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select `.output/chrome-mv3/`
     - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select `.output/firefox-mv3/manifest.json`
     - **Safari**: Open the Xcode project generated in `.output/`

## Try it on

### JSON

  [https://api.github.com/repos/rxliuli/json-viewer](https://api.github.com/repos/rxliuli/json-viewer)

  [https://api.github.com](https://api.github.com)

  [https://api.github.com/gists/public](https://api.github.com/gists/public)

### JSONP

  Large files:

  [https://raw.githubusercontent.com/ebrelsford/geojson-examples/master/596acres-02-18-2014.geojson](https://raw.githubusercontent.com/ebrelsford/geojson-examples/master/596acres-02-18-2014.geojson)

## License

See [LICENSE](https://github.com/rxliuli/json-viewer/blob/master/LICENSE) for more details.

## Credits

Originally created by [Tulio Ornelas](https://github.com/tulios).
