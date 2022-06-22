import { createUnplugin } from 'unplugin'
import { WebpackPluginInstance } from 'webpack'
import fg from 'fast-glob'
import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import generateConfig from './config'
import generateDts from './dts'
import { Options } from './types'

function getPageRouteList(options: Required<Options>) {
  const { pagePath, exclude } = options
  const patterns = ['**/*.vue']
  patterns.push(...exclude.map((pattern) => `!${pattern}`))
  const filePathList: string[] = []
  pagePath.forEach((path) => {
    filePathList.push(
      ...fg.sync(patterns, {
        cwd: path,
        onlyFiles: true,
        absolute: true,
      })
    )
  })
  return filePathList.map(options.transform)
}

function checkStringListDifferent(listA?: string[], listB?: string[]) {
  if (listA?.length !== listB?.length) {
    return true
  }
  const setA = new Set(listA)
  const setB = new Set(listB)
  const longestList = listA!.length > listB!.length ? listA : listB
  return longestList!.some((pageRoute) => {
    if (!(setA.has(pageRoute) && setB.has(pageRoute))) {
      return true
    }
  })
}

function plugin(pageRouteList: string[], options: Required<Options>) {
  if (options.configPath) {
    const inputConfig = JSON.parse(fs.readFileSync(options.configPath, 'utf-8'))
    const config = generateConfig(pageRouteList, options)
    const outputConfig = { ...inputConfig, ...config }
    fs.writeFileSync(options.configPath, JSON.stringify(outputConfig, null, 2))
  }
  if (options.dtsPath) {
    const dts = generateDts(pageRouteList)
    fs.writeFileSync(options.dtsPath, dts)
  }
}

const defaultOptions: Required<Options> = {
  pagePath: ['src/pages'],
  exclude: ['**/components/**/*.vue'],
  indexPath: 'src/pages/Index/index.vue',
  configPath: 'src/pages.json',
  dtsPath: 'src/pages.d.ts',
  checkSubPackage: (name) => /\.package$/.test(name),
  transform: (path) => {
    const cwd = process.cwd().replace(/\\/g, '/')
    return path
      .replace(/\\/g, '/')
      .replace(new RegExp(`^${cwd}\/src\/`), '')
      .replace(/\.vue$/, '')
  },
}

const unplugin = createUnplugin<Options>((options) => {
  const opts: Required<Options> = {
    ...defaultOptions,
    ...options,
  }
  let lastPageRouteList: string[]
  const update = () => {
    const pageRouteList = getPageRouteList(opts)
    if (checkStringListDifferent(lastPageRouteList, pageRouteList)) {
      lastPageRouteList = pageRouteList
      plugin(pageRouteList, opts)
    }
  }
  update()
  const watcher = chokidar.watch(
    opts.pagePath.map((p) => path.resolve(process.cwd(), p)),
    {
      persistent: true,
    }
  )
  watcher.on('all', update)
  return {
    name: 'unplugin-uniapp-pages',
  }
})

export const vitePlugin = unplugin.vite
export const webpackPlugin = unplugin.webpack
