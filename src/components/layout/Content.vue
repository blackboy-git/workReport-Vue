<template>
    <main class="content" :class="{ 'is-collapsed': isCollapsed }">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useSidebarStore } from '@/stores/sidebar';
  
  const route = useRoute();
  const sidebarStore = useSidebarStore();
  
  const isCollapsed = computed(() => sidebarStore.isCollapsed);
  const breadcrumbs = computed(() => {
    return route.meta.breadcrumbs || [];
  });
  </script>
  
  <style lang="scss" scoped>
  @import '@/styles/variables';
  
  .content {
    margin-left: 0px;
    padding: 0px;
    transition: all 0.3s;
    width: 100%; /* 确保占满剩余宽度 */
  
    &.is-collapsed {
      margin-left: 65px;
    }
  
    .breadcrumb {
      margin-bottom: 20px;
    }
  
    .content-wrapper {
      min-height: calc(100vh - 160px);
    }
  }
  </style>