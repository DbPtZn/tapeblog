import { RoutePathEnum, RouteNameEnum } from '@/enums'
// import { BloggerPage, HomePage } from '@/pages'
import { RouteRecordRaw } from 'vue-router'

const blogRoutes: Array<RouteRecordRaw> = [
  {
    name: RouteNameEnum.BLOG,
    path: `/`,
    component: () => import('@/pages/blog/BlogPage.vue'),
    children: [
      {
        // name: RouteNameEnum.HOME,
        path: `/:UID`,
        component: () => import('@/pages/blog/HomePage.vue'),
      },
      {
        path: `/:UID/column/:CID`,
        component: () => import('@/pages/blog/ColumnPage.vue'),
      },
      {
        path: `/:UID/column`,
        component: () => import('@/pages/blog/ColumnPage.vue'),
      },
      {
        path: `/:UID/article/:AID`,
        component: () => import('@/pages/blog/ArticlePage.vue'),
      },
      
    ]
    // 思考作品页面的链接上要不要加博客UID
    // 考虑博客页不添加 blogger 作为头部，仅使用 UID
    // 作品页不添加UID
  },
]

export default blogRoutes
