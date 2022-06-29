# unplugin-uniapp-pages

中文 | [English](./README-en.md)

> 使用 [unjs/unplugin](https://github.com/unjs/unplugin) 构建的自动生成 [uni-app](https://github.com/dcloudio/uni-app) 页面配置的插件

## 开始使用

### Vue CLI

#### 安装:

```bash
npm i -D unplugin-uniapp-pages
```

#### 配置:

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

## 配置项

### pagePath

- Type: `string[]`
- Default: `['src/pages']`

页面文件所在的文件系统目录。

### indexPath

- Type: `string`
- Default: `src/pages/Index/index.vue`

Index 页面的页面文件路径。

### exclude

- Type: `string[]`
- Default: `['**/components/**/*.vue']`

一个包含 glob pattern 的数组，用来排除匹配路径。

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

生成的 json 配置将会被保存的路径。

### dtsPath

- Type: `string`
- Default: `src/pages.d.ts`

生成的 typescript 声明文件将会被保存的路径。

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

将页面文件路径转换为路由的函数。

### checkSubPackage

- Type: `(name: string) => boolean`
- Default: `(name) => /\.package$/.test(name)`

基于路由的一部分路径来判断当前路径是否处于 subPackage 下的函数。

## Todo

- 添加一个自定义 SFC 标签来指定每个页面特有的配置。

## License

[MIT](https://opensource.org/licenses/MIT)
