import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'material-symbols:account-circle',
      keepAlive: true,
      order: 1000,
      title: '统一管理',
    },
    name: 'Base',
    path: '/base',
    children: [
      {
        meta: {
          title: '用户',
        },
        name: 'User',
        path: '/basic/user',
        component: () => import('#/views/base/user/index.vue'),
      },
      {
        meta: {
          title: '字典配置',
        },
        name: 'Dict',
        path: '/basic/dict',
        component: () => import('#/views/base/dict/index.vue'),
      },
      {
        meta: {
          title: '菜单',
        },
        name: 'Menu',
        path: '/basic/menu',
        component: () => import('#/views/base/menu/index.vue'),
      },
    ],
  },
];

export default routes;
