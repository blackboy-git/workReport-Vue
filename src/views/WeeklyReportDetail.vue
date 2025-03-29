<template>
  <div class="weekly-report-detail">
    <h2>{{ reportName }}</h2>
    <el-table :data="memberReports" stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="80px"/>
      <el-table-column prop="groupName" label="分组名称" width="150px" />
      <el-table-column prop="userName" label="姓名" width="100px" />
      <el-table-column prop="content" label="周报内容" class-name="left-align-content">
        <template #default="scope">
          <div class="report-content">{{ scope.row.content }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getGroupWeeklyReportDetail } from '@/api/groupWeeklyReport';

const route = useRoute();
const reportId = ref(route.params.reportId);
const groupName = ref(route.params.groupName);
const reportName = ref(route.params.reportName);
const memberReports = ref([]);

// 定义 fetchReportDetail 函数
const fetchReportDetail = async () => {
  if (!reportId.value) {
    ElMessage.error('报告 ID 无效，请检查');
    return;
  }
  const response = await getGroupWeeklyReportDetail(reportId.value);
  if (response.data.flag) {
    // 使用传参过来的 groupName 填充数据
    const reportsWithGroupName = response.data.data.map(report => ({
      ...report,
      groupName: groupName.value
    }));
    memberReports.value = reportsWithGroupName;
  } else {
    // 错误处理移至响应拦截器，此处不做处理
  }
};

onMounted(() => {
  fetchReportDetail();
});
</script>

<style scoped>
.weekly-report-detail {
  padding: 0px;
}

.report-content {
  white-space: pre-line; /* 恢复为 pre-line 保留换行 */
  word-break: break-all;
  text-align: left;
  /* 移除 max-width 和 margin 避免影响布局 */
}

/* 设置表格单元格内容全局居中对齐 */
:deep(.el-table th),
:deep(.el-table td:not(.left-align-content)) {
  text-align: center;
}

/* 设置周报内容列标题居中 */
:deep(.el-table .left-align-content.el-table__header-cell) {
  text-align: center;
}

/* 确保周报内容列内容左对齐 */
:deep(.el-table .left-align-content.el-table__cell) {
  text-align: left;
  padding-left: 10px; /* 可根据需要调整内边距 */
}
</style>    