//@ts-expect-error
import routes from '~pages'
//@ts-expect-error
import { getPages, getPage, getParents, getSiblings } from 'vitepress-pages/browser'

const pages = getPages(routes)

const usePage = (path: string) => getPage(path, routes)
const useParents = (path: string) => getParents(path, routes)
const useSiblings = (path: string) => getSiblings(path, routes)

export { routes, pages, usePage, useParents, useSiblings } 