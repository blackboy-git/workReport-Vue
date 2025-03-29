<template>
  <div v-if="shouldRenderLayout" class="common-layout">
    <el-container>
      <el-header>
        <Banner />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Sidebar @menu-click="handleMenuClick" />
        </el-aside>
        <el-container>
          <el-main>
            <TabPages ref="tabPagesRef" />
          </el-main>
          <el-footer>
            <Footer />
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script setup>
import { ref} from 'vue';
import { useRoute } from 'vue-router';
import Banner from './Banner.vue';
import Sidebar from './Sidebar.vue';
import Footer from './Footer.vue';
import TabPages from './TabPages.vue';

const route = useRoute();
const shouldRenderLayout = route.meta.layout!== null;
const tabPagesRef = ref(null);

const handleMenuClick = (menuItem) => {
  const { label, name, component } = menuItem;
  tabPagesRef.value.addTab(label, name, component);
};


</script>

<style lang="scss" scoped>
.common-layout {
  height: 100vh;
}

.el-header {
  padding: 0;
  background-color: #409EFF; // Element Plus 主题色
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-aside {
  background-color: #304156; // Element Plus 菜单背景色
  color: #fff;
  overflow-x: hidden;
}

.el-main {
  padding: 20px;
  background-color: #f0f2f5; // Element Plus 主背景色
  overflow-y: auto; /* 确保内容溢出时可以滚动 */
}

.el-footer {
  background-color: #f8f8f8; // Element Plus 辅助背景色
  color: #606266; // Element Plus 次要文字色
  text-align: center;
  padding: 0px 0;
  font-size: 0.9rem;
  position: relative;
  // box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}
</style>