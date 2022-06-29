# unplugin-uniapp-pages

[中文](./README.md) | English

> Auto generating pages config for [uni-app](https://github.com/dcloudio/uni-app) powered by [unjs/unplugin](https://github.com/unjs/unplugin)

## Getting Started

### Vue CLI

#### Install:

```bash
npm i -D unplugin-uniapp-pages
```

#### Config:

```javascript
const Pages = require('unplugin-uniapp-pages')

module.exports = {
  configureWebpack: {
    plugins: [
      Pages.webpackPlugin({
        // ...config,
      }),
    ],
  },
}
```

## Configuration

### pagePath

- Type: `string[]`
- Default: `['src/pages']`

Paths to the pages directory.

### indexPath

- Type: `string`
- Default: `src/pages/Index/index.vue`

Path to the file of index page.

### exclude

- Type: `string[]`
- Default: `['**/components/**/*.vue']`

An array of glob patterns to exclude matches.

```bash
# folder structure
src/pages/
  ├── Login/
  │  ├── components
  │  │  └── Form.vue
  │  └── index.vue
  └── Home.vue
```

```javascript
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      Pages.webpackPlugin({
        exclude: ['**/components/**/*.vue'],
      }),
    ],
  },
}
```

### configPath

- Type: `string`
- Default: `src/pages.json`

Path where the json config will be generated.

### dtsPath

- Type: `string`
- Default: `src/pages.d.ts`

Path where the typescript declaration will be generated.

### transform

- Type: `(path: string) => string`
- Default:

  ```javascript
  function (path) {
    const cwd = process.cwd().replace(/\\/g, '/')
    return path
      .replace(/\\/g, '/')
      .replace(new RegExp(`^${cwd}\/src\/`), '')
      .replace(/\.vue$/, '')
  }
  ```

A function that takes path of page file returns route string which will be written into config file.

### checkSubPackage

- Type: `(name: string) => boolean`
- Default: `(name) => /\.package$/.test(name)`

A function that takes a part of route name returns boolean that indicate if it's a subPackage.

## Todo

- Add a custom SFC tag to specify page config in page file.

## License

[MIT](https://opensource.org/licenses/MIT)
