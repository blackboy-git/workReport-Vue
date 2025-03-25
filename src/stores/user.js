import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 模拟菜单数据，添加 roles 字段
  const menuList = ref([
    { path: '/', name: '首页', roles: [ 'ADMIN', 'USER'] },
    { path: '/my-reports', name: '我的周报', roles: ['USER', 'ADMIN'] },
    { path: '/team-reports', name: '组内周报', roles: ['USER', 'ADMIN'] },
    { path: '/settings', name: '个人设置', roles: ['USER', 'ADMIN'] },
    { path: '/userManagement', name: '用户管理', roles: ['ADMIN'] },
    { path: '/group-management', name: '分组管理', roles: ['ADMIN'] },
  ]);

  // 状态
  const token = ref(''); // 模拟 token
  const userInfo = ref('');
  const isLoggedIn = ref(true); // 默认为已登录
  const role = ref('USER'); // 新增用户角色信息，默认为 USER

  const setUserInfo = (data) => {
    userInfo.value = { ...data };
    isLoggedIn.value = true;
    role.value = data.role || 'USER'; // 从用户信息中获取角色
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
      userInfo.value = null;
      isLoggedIn.value = false;
      role.value = 'USER';
    } catch (error) {
      console.error('登出失败:', error);
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
    role
  };
}, {
  persist: true // 启用持久化
});
    