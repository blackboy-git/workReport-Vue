<template>
  <div>
    <!-- 菜单项 -->
    <el-menu-item v-if="!item.children || item.children.length === 0" :index="item.path">
      <i :class="item.icon"></i>
      <template #title>
        <span>{{ item.label }}</span>
      </template>
    </el-menu-item>

    <!-- 子菜单 -->
    <el-sub-menu v-else :index="item.path">
      <template #title>
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </template>
      <MenuItem v-for="child in item.children" :key="child.path" :item="child" />
    </el-sub-menu>
  </div>
</template>

<script setup>
const { item } = defineProps(['item']);
</script>

<style scoped>
</style>