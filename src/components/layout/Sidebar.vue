<template>
  <aside class="sidebar">

    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
      >
        <MenuItem
          v-for="item in menuList"
          :key="item.path"
          :item="item"
        />
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import MenuItem from './MenuItem.vue';

const route = useRoute();
const userStore = useUserStore();

const activeMenu = computed(() => {
  const { path } = route;
  return path;
});

const menuList = computed(() => {
  return userStore.getMenuList;
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.sidebar {
  width: 200px;
  background-color: $menu-bg;
  height: 100%;
  display: flex;
  flex-direction: column;

  .logo-mini {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    background-color: $primary-color;

    img {
      height: 35px;
    }
  }

  .el-scrollbar {
    flex: 1;
    overflow: hidden;

    .el-menu {
      border-right: none;
      width: 100%;
    }
  }
}
</style>