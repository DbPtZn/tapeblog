import { RoutePathEnum, RouteNameEnum } from '@/enums'
import { RouteRecordRaw } from 'vue-router'
import { _400, _403, _404 } from '@/pages'

const errorRoutes: Array<RouteRecordRaw> = [
  {
    path: RoutePathEnum._400,
    name: RouteNameEnum._400,
    component: () => _400,
  },
  {
    path: RoutePathEnum._403,
    name: RouteNameEnum._403,
    component: () => _403,
  },
  {
    path: RoutePathEnum._404,
    name: RouteNameEnum._404,
    component: () => _404,
  },
]

export default errorRoutes
