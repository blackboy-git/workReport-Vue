<template>
    <div class="tab-pages">
      <el-tabs v-model="activeTab" @tab-remove="removeTab">
        <el-tab-pane
          v-for="(tab, index) in tabs"
          :key="index"
          :label="tab.label"
          :name="tab.name"
          :closable="tab.name!== 'Home'" 
        >
            <component :is="tab.component" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script setup>
import Home from '@/views/Home.vue';
import { onMounted, ref } from 'vue';
  
const activeTab = ref('');
const tabs = ref([]);

onMounted(() => {
  // 初始化时，添加默认标签页
  addTab('首页', 'Home', Home);
  activateTab('Home');
});

const addTab = (label, name, component) => {
  const existingTab = tabs.value.find(tab => tab.name === name);
  if (!existingTab) {
    tabs.value.push({ label, name, component });
  }
  activeTab.value = name;
};

// 新增激活指定标签页的方法
const activateTab = (name) => {
  activeTab.value = name;
};

const removeTab = (targetName) => {
  const index = tabs.value.findIndex(tab => tab.name === targetName);
  if (index !== -1) {
    tabs.value.splice(index, 1);
    //激活上一个标签页
    if (tabs.value.length > 0) {
      activeTab.value = tabs.value[index - 1].name;
    } else {
      activeTab.value = '';
    }
  }
};

defineExpose({
  addTab,
  activateTab
});
</script>

<style scoped>
.tab-pages .el-tabs__item {
  background-color: #e6f7ff; /* 浅蓝色背景 */
}
</style>