<template>
  <div class="icon-test">
    <h1>图标加载测试页</h1>

    <el-button type="success" icon="el-icon-plus" >
    新建规则
    </el-button>

    <el-button type="success">
    <el-icon style="vertical-align: middle">
        <!-- <Plus /> -->
        <!-- <XCircle /> -->
        <!-- <View /> -->
        <Hide />
        <!-- <select /> -->
    </el-icon>

    <el-icon><Select /></el-icon>
    <span style="vertical-align: middle">新建规则</span>
</el-button>
  </div>
</template>

<script setup>
import { XCircle } from 'lucide-vue-next';
</script>

<style scoped>
.icon-test {
  padding: 20px;
}

.icon{
  width: 20px;
  height: 20px;
}

</style>    