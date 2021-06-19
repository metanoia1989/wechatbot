import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/bot',
    component: Layout,
    redirect: '/bot/login-status',
    children: [{
      path: '/login-status',
      name: 'LoginStatus',
      component: () => import('@/views/bot/login-status'),
      meta: { title: 'Bot登录状态', icon: 'bot' }
    }]
  },
  {
    path: '/contact',
    component: Layout,
    redirect: '/contact/index',
    name: 'Contact',
    meta: { title: '联系人管理', icon: 'contact-manage' },
    children: [
      {
        path: 'index',
        name: 'ContactList',  
        component: () => import('@/views/contact/contact-list'),
        meta: { title: '联系人列表', icon: 'contact-list' }
      },
      {
        path: 'daily',
        name: 'ContactDaily',
        component: () => import('@/views/contact/contact-daily'),
        meta: { title: '每日资讯', icon: 'daily' }
      }
    ]
  },
  {
    path: '/group',
    component: Layout,
    redirect: '/group/index',
    name: 'Group',
    meta: { title: '群组管理', icon: 'asset-manage-grey' },
    children: [
      {
        path: 'index',
        name: 'GroupList',
        component: () => import('@/views/group/group-list'),
        meta: { title: '群列表', icon: 'room' }
      },
      {
        path: 'welcome',
        name: 'GroupWelcome',
        component: () => import('@/views/group/group-welcome'),
        meta: { title: '欢迎语', icon: 'keyword' }
      }
    ]
  },
  {
    path: '/material',
    component: Layout,
    redirect: '/material/text',
    name: 'Material',
    meta: { title: '素材中心', icon: 'material' },
    children: [
      {
        path: 'text',
        name: 'MaterialText',
        component: () => import('@/views/material/material-text'),
        meta: { title: '文本素材', icon: 'text' }
      },
      {
        path: 'file',
        name: 'MaterialFile',
        component: () => import('@/views/material/material-file'),
        meta: { title: '文件素材', icon: 'file' }
      },
    ]
  },
  {
    path: '/project-home',
    component: Layout,
    children: [
      {
        path: 'https://github.com/metanoia1989/wechatbot',
        meta: { title: '项目主页', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
