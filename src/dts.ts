import mustache from 'mustache'

const template = `
declare namespace UniApp {
  type {{{ routesTypeName }}} = {{{ routesTypeValue }}}
  type Query{{{ routesTypeName }}} = \`$\{ {{{ routesTypeName }}} \}?$\{ string \}\`

  interface NavigateToOptions {
    url: {{{ routesTypeName }}} | Query{{{ routesTypeName }}}
  }
  
  interface RedirectToOptions {
    url: {{{ routesTypeName }}} | Query{{{ routesTypeName }}}
  }

  interface ReLaunchOptions {
    url: {{{ routesTypeName }}} | Query{{{ routesTypeName }}}
  }

  interface SwitchTabOptions {
    url: {{{ routesTypeName }}} | Query{{{ routesTypeName }}}
  }
}  
`

export default function (pageRouteList: string[]) {
  const pagePathList = pageRouteList.map((pageRoute) => `/${pageRoute}`)
  return mustache.render(template, {
    routesTypeName: 'Routes',
    routesTypeValue: pagePathList
      .map((pagePath) => `'${pagePath}'`)
      .join(' | '),
  })
}
