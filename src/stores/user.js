import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getUserAvatar } from '@/api/user'; // 假设这是获取头像的 API 函数
// 引入需要的组件
import Home from '@/views/Home.vue';
import MyReports from '@/views/MyReports.vue';
import TeamReports from '@/views/TeamReports.vue';
import Settings from '@/views/Settings.vue';
import UserManagement from '@/views/UserManagement.vue';
import GroupManagement from '@/views/GroupManagement.vue';

export const useUserStore = defineStore('user', () => {
  // 模拟菜单数据，添加 roles 字段
  const menuList = ref([
    { 
      path: '/', 
      name: 'Home', 
      label: '首页', 
      roles: [ 'ADMIN', 'USER'],
      component: Home
    },
    { 
      path: '/my-reports', 
      name: 'MyReports', 
      label: '我的周报', 
      roles: ['USER', 'ADMIN'],
      component: MyReports
    },
    { 
      path: '/team-reports', 
      name: 'TeamReports', 
      label: '组内周报', 
      roles: ['USER', 'ADMIN'],
      component: TeamReports
    },
    { 
      path: '/settings', 
      name: 'Settings', 
      label: '个人设置', 
      roles: ['USER', 'ADMIN'],
      component: Settings
    },
    { 
      path: '/userManagement', 
      name: 'UserManagement', 
      label: '用户管理', 
      roles: ['ADMIN'],
      component: UserManagement
    },
    { 
      path: '/group-management', 
      name: '分组管理', 
      label: '分组管理', 
      roles: ['ADMIN'],
      component: GroupManagement
    },
  ]);

  // 状态
  const userInfo = ref({
    avatar: '', // 存储头像标识
    avatarUrl: '', // 存储头像 URL
    token: '' //存储用户token
  });
  const isLoggedIn = ref(true); // 默认为已登录
  const role = ref('USER'); // 新增用户角色信息，默认为 USER

  //设置用户信息
  const setUserInfo = async (data) => {
    userInfo.value = { ...data };
    isLoggedIn.value = true;
    role.value = data.role || 'USER'; // 从用户信息中获取角色
    await fetchAvatar(); // 初始化头像 URL
  };

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      return userInfo.value;
    } catch (error) {
      return null;
    }
  }

  // 获取头像 URL
  async function fetchAvatar() {
    try {
      if (userInfo.value.avatar) {
        const url = await getUserAvatar(userInfo.value.avatar);
        userInfo.value.avatarUrl = url;
      }
    } catch (error) {
      userInfo.value.avatarUrl = '';
    }
  }

  // 根据角色过滤菜单
  const getMenuList = computed(() => {
    return menuList.value.filter(item => item.roles.includes(role.value));
  });

  // 登出系统
  async function logout() {
    try {
      userInfo.value = {
        avatar: '',
        avatarUrl: '',
        token: ''
      };
      isLoggedIn.value = false;
    } catch (error) {
    }
  }


  return {
    userInfo,
    isLoggedIn,
    setUserInfo,
    logout,
    fetchUserInfo,
    getMenuList,
    role,
    fetchAvatar // 暴露 fetchAvatar 方法
  };
}, {
  persist: true // 启用持久化
});