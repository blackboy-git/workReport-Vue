<template>
  <header class="banner">
    <div class="logo">
      <img src="@/assets/logo.png" alt="Logo" />
      <h1>工作周报系统</h1>
    </div>
    <div class="user-info">
      <span class="welcome">欢迎，{{ userName }} [{{role}}]  </span>
      <span class="date">{{ currentDate }}</span>
      <el-dropdown class="avatar-dropdown">
        <img src="@/assets/avatar.png" alt="User Avatar" class="avatar" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goToSettings">个人设置</el-dropdown-item>
            <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const userName = ref('');
const role = ref('');
const currentDate = ref('');

onMounted(() => {
  userName.value = userStore.userInfo.userName || '用户名';
  role.value = userStore.userInfo.role || '普通用户';
  updateDate();
  setInterval(updateDate, 1000);
});

const updateDate = () => {
  const now = new Date();
  currentDate.value = now.toLocaleString();
};

const logout = () => {
  userStore.logout();
  router.push('/login');
};

const goToSettings = () => {
  router.push({ name: 'Settings' }); // 假设个人设置页面的路由名称是 'Settings'
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: $primary-color;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;

  .logo {
    display: flex;
    align-items: center;

    img {
      height: 40px;
      margin-right: 10px;
    }

    h1 {
      font-size: 1.5rem;
      margin: 0;
    }
  }

  .user-info {
    display: flex;
    align-items: center;

    .welcome {
      margin-right: 15px;
      font-weight: bold;
    }

    .date {
      margin-right: 20px;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>    