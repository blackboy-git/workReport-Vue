// src/stores/sidebar.store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref(false);

  function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
  }

  return { isCollapsed, toggleCollapse };
});