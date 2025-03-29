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
        <!-- 绑定头像 URL -->
        <img :src="userAvatarUrl" alt="User Avatar" class="avatar" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed,watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { getUserAvatar } from '@/api/user';

const userStore = useUserStore();
const router = useRouter();
const currentDate = ref('');
const userAvatarUrl = ref('@/assets/avatar.png');

// 使用 computed 属性获取用户名
const userName = computed(() => userStore.userInfo.userName || '用户名');
// 使用 computed 属性获取角色
const role = computed(() => userStore.userInfo.role || '普通用户');

const fetchAvatar = async () => {
  const avatarId = userStore.userInfo.avatar;
  if (avatarId) {
    try {
      const url = await getUserAvatar(avatarId);
      userAvatarUrl.value = url;
    } catch (error) {
      userAvatarUrl.value = '@/assets/avatar.png';
    }
  } else {
    userAvatarUrl.value = '@/assets/avatar.png';
  }
};

onMounted(() => {
  updateDate();
  setInterval(updateDate, 1000);
  fetchAvatar();
});

watch(() => userStore.userInfo.avatar, () => {
  fetchAvatar();
});

const updateDate = () => {
  const now = new Date();
  currentDate.value = now.toLocaleString();
};

const logout = () => {
  userStore.logout();
  router.push('/login');
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
      font-family: 'Microsoft YaHei', 'SimHei', Arial, sans-serif;
      font-size: 28px;
      font-weight: bold;
      color: #ffff;
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