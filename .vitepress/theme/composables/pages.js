import routes from '~pages'

import { getPages, getPage, getParents, getSiblings } from 'vitepress-pages/browser'

const pages = getPages(routes)

const usePage = path => getPage(path, routes)
const useParents = path => getParents(path, routes)
const useSiblings = path => getSiblings(path, routes)

export { routes, pages, usePage, useParents, useSiblings } 