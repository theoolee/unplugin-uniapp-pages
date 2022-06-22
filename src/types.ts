export type Options = {
  pagePath?: string[]
  indexPath?: string
  exclude?: string[]
  dtsPath?: false | string
  configPath?: false | string
  checkSubPackage?: (name: string) => boolean
  transform?: (path: string) => string
}

export type RouteTree = {
  [key: string]: RouteTree
}

export type PageConfig = {
  path: string
}

export type SubPackageConfig = {
  root: string
  pages: PageConfig[]
}

export type Config = {
  pages: PageConfig[]
  subPackages: SubPackageConfig[]
}
