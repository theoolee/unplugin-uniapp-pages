import path from 'path'
import {
  Config,
  Options,
  PageConfig,
  RouteTree,
  SubPackageConfig,
} from './types'

function generateRouteTree(pageRouteList: string[]) {
  const routeTree: RouteTree = {}
  pageRouteList.forEach((pageRoute) => {
    const routeList = pageRoute.split('/')
    let current = routeTree
    routeList.forEach((route) => {
      if (!current[route]) {
        current[route] = {}
      }
      current = current[route]
    })
  })
  return routeTree
}

function generateConfig(
  routeTree: RouteTree,
  options: Required<Options>
): Config | undefined {
  if (Object.keys(routeTree).length === 0) {
    return
  }
  const pages: PageConfig[] = []
  const subPackages: SubPackageConfig[] = []
  Object.keys(routeTree).forEach((route) => {
    const subConfig = generateConfig(routeTree[route], options)
    const isSubPackage = options.checkSubPackage(route) && subConfig
    if (!subConfig) {
      if (isSubPackage) {
        subPackages.push({
          root: '',
          pages: [{ path: route }],
        })
      } else {
        pages.push({ path: route })
      }
    } else {
      if (isSubPackage) {
        if (subConfig.subPackages.length > 0) {
          throw new Error('Sub package should not nested with sub package')
        }
        subPackages.push({
          root: route,
          pages: subConfig.pages,
        })
      } else {
        subConfig?.pages.forEach((page) => {
          pages.push({
            path: `${route}/${page.path}`,
          })
        })
        subConfig?.subPackages.forEach((subPackage) => {
          subPackages.push({
            root: `${route}/${subPackage.root}`,
            pages: subPackage.pages,
          })
        })
      }
    }
  })
  return {
    pages,
    subPackages,
  }
}

export default function (pageRouteList: string[], options: Required<Options>) {
  const routeTree = generateRouteTree(pageRouteList)
  const config = generateConfig(routeTree, options) as Config
  const indexPageRoute = options.transform(
    path.join(process.cwd(), options.indexPath)
  )
  const hasIndexPage = config.pages.some((page, index) => {
    if (page.path === indexPageRoute) {
      const indexPage = config.pages.splice(index, 1)
      config.pages.unshift(...indexPage)
      return true
    }
  })
  if (!hasIndexPage) {
    throw new Error('Index page not found')
  }
  return config
}
