<template>
    <div class="tab-pages">
        <keep-alive>
            <el-tabs v-model="activeTab" @tab-remove="removeTab">
                <el-tab-pane
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :label="tab.label"
                    :name="tab.name"
                    closable
                >
                    <!-- 传递唯一标识 -->
                    <component :is="tab.component" :tabId="tab.name" />
                     <!-- <component :is="Home" :tabId="Home" /> -->
                    <!-- <comp1 v-if="page=='我的周报'"></comp1> -->
                    <!-- <comp1 v-else-if="page=='我'"></comp1> -->
                     <!-- <h1>{{ index }} hello</h1> -->

                </el-tab-pane>
            </el-tabs>
        </keep-alive>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

// 从 localStorage 中获取之前保存的 activeTab
const activeTab = ref(localStorage.getItem('activeTab') || '');
const savedTabs = localStorage.getItem('tabs');
const tabs = ref(savedTabs? JSON.parse(savedTabs) : []);

// 在页面刷新前保存 activeTab 和 tabs 到 localStorage
onBeforeUnmount(() => {
    localStorage.setItem('activeTab', activeTab.value);
    localStorage.setItem('tabs', JSON.stringify(tabs.value));
});

// 页面加载时，确保 activeTab 存在于 tabs 中，若不存在则重置为第一个 tab
onMounted(() => {
    if (tabs.value.length > 0 &&!tabs.value.some(tab => tab.name === activeTab.value)) {
        activeTab.value = tabs.value[0].name;
    }
});

const addTab = (label, name, component) => {
    try {
        const existingTab = tabs.value.find(tab => tab.name === name);
        if (!existingTab) {
            tabs.value.push({ label, name, component });
        }
        activeTab.value = name;
        localStorage.setItem('tabs', JSON.stringify(tabs.value));
        localStorage.setItem('activeTab', activeTab.value);
        console.log('添加标签页后保存状态:', tabs.value, activeTab.value);
    } catch (error) {
        console.error('添加标签页保存状态时出错:', error);
    }
};

const removeTab = (targetName) => {
    try {
        const index = tabs.value.findIndex(tab => tab.name === targetName);
        if (index !== -1) {
            tabs.value.splice(index, 1);
        }
        if (activeTab.value === targetName) {
            if (tabs.value.length > 0) {
                activeTab.value = tabs.value[0].name;
            } else {
                activeTab.value = '';
            }
        }
        localStorage.setItem('tabs', JSON.stringify(tabs.value));
        localStorage.setItem('activeTab', activeTab.value);
        console.log('移除标签页后保存状态:', tabs.value, activeTab.value);
    } catch (error) {
        console.error('移除标签页保存状态时出错:', error);
    }
};

const activateTab = (name) => {
    try {
        activeTab.value = name;
        localStorage.setItem('activeTab', activeTab.value);
        console.log('激活标签页后保存状态:', activeTab.value);
    } catch (error) {
        console.error('激活标签页保存状态时出错:', error);
    }
};

watch(tabs, (newTabs) => {
    try {
        if (newTabs.length > 0 &&!activeTab.value) {
            activeTab.value = newTabs[0].name;
        }
        localStorage.setItem('tabs', JSON.stringify(newTabs));
        console.log('tabs 数组变化后保存状态:', newTabs, activeTab.value);
    } catch (error) {
        console.error('tabs 数组变化保存状态时出错:', error);
    }
}, { immediate: true });

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