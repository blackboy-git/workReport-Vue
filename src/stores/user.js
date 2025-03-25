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
      name: '首页', 
      label: '首页', 
      roles: [ 'ADMIN', 'USER'],
      component: Home
    },
    { 
      path: '/my-reports', 
      name: '我的周报', 
      label: '我的周报', 
      roles: ['USER', 'ADMIN'],
      component: MyReports
    },
    { 
      path: '/team-reports', 
      name: '组内周报', 
      label: '组内周报', 
      roles: ['USER', 'ADMIN'],
      component: TeamReports
    },
    { 
      path: '/settings', 
      name: '个人设置', 
      label: '个人设置', 
      roles: ['USER', 'ADMIN'],
      component: Settings
    },
    { 
      path: '/userManagement', 
      name: '用户管理', 
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
  const token = ref(''); // 模拟 token
  const userInfo = ref({
    avatar: '', // 存储头像标识
    avatarUrl: '' // 存储头像 URL
  });
  const isLoggedIn = ref(true); // 默认为已登录
  const role = ref('USER'); // 新增用户角色信息，默认为 USER

  const setUserInfo = async (data) => {
    userInfo.value = { ...data };
    isLoggedIn.value = true;
    role.value = data.role || 'USER'; // 从用户信息中获取角色
    await fetchAvatar(); // 初始化头像 URL
  };

  // 模拟周报数据
  const reports = ref([
    // ... 周报数据
  ]);

  // 模拟组内周报数据
  const teamReports = ref([
    // ... 组内周报数据
  ]);

  // 提取团队成员姓名
  const teamMembers = ref([
    // ... 团队成员姓名
  ]);

  // 初始化团队成员
  function initTeamMembers() {
    const members = new Set();
    teamReports.value.forEach(report => members.add(report.memberName));
    teamMembers.value = Array.from(members);
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      // 模拟获取用户信息成功
      console.log('获取用户信息成功:', userInfo.value);
      initTeamMembers(); // 初始化团队成员
      return userInfo.value;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  // 登出
  async function logout() {
    try {
      // 模拟登出成功
      console.log('登出成功');
      token.value = '';
      userInfo.value = {
        avatar: '',
        avatarUrl: ''
      };
      isLoggedIn.value = false;
      role.value = 'USER';
    } catch (error) {
      console.error('登出失败:', error);
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
      console.error('获取用户头像失败:', error);
      userInfo.value.avatarUrl = '';
    }
  }

  // 根据角色过滤菜单
  const getMenuList = computed(() => {
    return menuList.value.filter(item => item.roles.includes(role.value));
  });

  return {
    token,
    userInfo,
    isLoggedIn,
    setUserInfo,
    logout,
    fetchUserInfo,
    getMenuList,
    reports,
    teamReports,
    teamMembers, // 暴露 teamMembers
    role,
    fetchAvatar // 暴露 fetchAvatar 方法
  };
}, {
  persist: true // 启用持久化
});