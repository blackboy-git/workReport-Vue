import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'; // 首页
import Login from '../views/Login.vue'; // 登录页
import MyReports from '../views/MyReports.vue'; // 我的周报
import TeamReports from '../views/TeamReports.vue'; // 组内周报
import Settings from '../views/Settings.vue'; // 个人设置
import UserManagement from '../views/UserManagement.vue';
import { useUserStore } from '@/stores/user'; // 导入 user store
import IconTest from '../views/IconTest.vue'; // 图标测试页
import UserInfoSettings from '../views/UserInfoSettings.vue'; // 新增：导入修改用户信息页面
import PasswordSettings from '../views/PasswordSettings.vue'; // 新增：导入修改用户密码页面
import GroupManagement from '@/views/GroupManagement.vue';//导入分组管理页面
import WeeklyReportDetail from '../views/WeeklyReportDetail.vue'; // 引入周报详情页面

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }, // 不需要登录
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'), // 主布局
    children: [
      { path: '', name: 'Home', component: Home }, // 首页
      { path: 'my-reports', name: 'MyReports', component: MyReports, meta: { requiresAuth: true } },
      { path: 'team-reports', name: 'TeamReports', component: TeamReports, meta: { requiresAuth: true } }, // 组内周报路由
      { path: 'settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } },
      { path: 'userManagement', name: 'UserManagement', component: UserManagement, meta: { requiresAuth: true } },
      { path: 'icon-test', name: 'IconTest', component: IconTest, meta: { requiresAuth: false } }, // 图标测试页路由
      { path: 'user-info-settings', name: 'UserInfoSettings', component: UserInfoSettings, meta: { requiresAuth: true } }, // 新增：修改用户信息路由
      { path: 'password-settings', name: 'PasswordSettings', component: PasswordSettings, meta: { requiresAuth: true } }, // 新增：修改用户密码路由
      { path: 'group-management', name: 'GroupManagement', component: GroupManagement, meta: { requiresAuth: true } }, // 新增：分组管理路由
      { 
        path: 'weekly-report-detail/:reportId/:groupName/:reportName', // 包含动态参数
        name: 'WeeklyReportDetail',
        component: WeeklyReportDetail,
        meta: { 
          requiresAuth: true,
          layout: null // 不使用布局
        },
      } 
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); 

  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } }); // 记住原始请求的目标位置
    } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
      console.log("已通过路由守卫");
      next({ name: 'Home' });
    } else {
      next();
    }
  } else {
    next();
  }

});



export default router;        