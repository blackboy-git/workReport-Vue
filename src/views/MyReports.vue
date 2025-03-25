<template>
  <div class="my-reports">
    <h2>我的周报</h2>

    <!-- 年份筛选 -->
    <div class="year-filter">
      <span>选择年份：</span>
      <el-select v-model="selectedYear" placeholder="请选择年份" style="width: 120px" @change="filterReportsByYear">
        <el-option
          v-for="year in availableYears"
          :key="year"
          :label="year"
          :value="year"
        />
      </el-select>
    </div>

    <!-- 周报表格 -->
    <el-table :data="filteredReports" stripe=true  style="width: 100%" :row-class-name="'adaptive-row'">
      <el-table-column prop="reportName" label="周报名称" width="200px">
        <template #default="scope">
          <div v-html="formatReportName(scope.row.reportName)"></div>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="周报内容" width="auto" class-name="left-align-content">
        <template #default="scope">
          <div class="report-content">{{ scope.row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="完成状态" width="100px">
        <template #default="scope">
          <span v-if="scope.row.status === 'SUBMITTED'">
            <CircleCheckFilled class="icon" />
          </span>
          <span v-else>
            <CircleCloseFilled class="icon" />
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="120px" />
      <el-table-column prop="updateTime" label="更新日期" width="120px" />
      <el-table-column prop="userName" label="用户姓名" width="120px" />
      <el-table-column label="操作" width="150px">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑周报对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑周报" width="50%">
      <el-form :model="editingReport" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editingReport.userName" disabled />
        </el-form-item>
        <el-form-item label="周报名称">
          <el-input v-model="editingReport.reportName" disabled />
        </el-form-item>
        <el-form-item label="周报内容">
          <el-input v-model="editingReport.content" type="textarea" :rows="15" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/user'; // 引入 useUserStore
import { ElMessage, ElMessageBox  } from 'element-plus';
import { getMyAllReports, updateReport, deleteReport } from '@/api/weekReport'; // weekReport.js中定义了getMyWeekReports函数

const userStore = useUserStore();

// 当前年份
const currentYear = new Date().getFullYear();

// 可用的年份列表（默认显示当前年份及之前两年）
const availableYears = computed(() => {
  const years = [];
  const startYear = currentYear - 5;
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
});

// 选中的年份（默认为当前年份）
const selectedYear = ref(currentYear);

// 周报数据
const reports = ref([]);

// 筛选后的周报数据
const filteredReports = computed(() => {
  return reports.value.filter(report => {
    const reportYear = new Date(report.createTime).getFullYear();
    return reportYear === selectedYear.value;
  });
});

// // 年份筛选
// const filterReportsByYear = () => {
// };

// 是否显示编辑对话框
const editDialogVisible = ref(false);

// 当前编辑的周报数据
const editingReport = ref({});

// 组件挂载时获取数据
onMounted(async () => {
  try {
    const userId = userStore.userInfo.userId; // 获取当前用户的用户名
    const response = await getMyAllReports(userId);
    if (response.data.flag) {
      const processedReports = response.data.data.map(report => {
        return {
          ...report
        };
      });
      reports.value = processedReports; // 更新周报数据
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('获取周报数据失败，请稍后重试');
  }
});

// 编辑周报
const handleEdit = (row) => {
  editingReport.value = { ...row };
  editDialogVisible.value = true;
};

// 保存编辑
const saveEdit = async () => {
  try {
    const response = await updateReport(editingReport.value);
    if (response.data.flag) {
      // 更新成功后的操作，例如刷新列表
      ElMessage.success('周报修改成功！');
      editDialogVisible.value = false;
      // 重新获取周报数据
      const newResponse = await getMyAllReports(userStore.userInfo.userId);
      if (newResponse.data.flag) {
        reports.value = newResponse.data.data;
      } else {
        ElMessage.error(newResponse.data.msg);
      }
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('保存周报修改失败，请稍后重试');
  }
};

// 删除周报
const handleDelete = async (row) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
      '确定要删除这份周报吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    const response = await deleteReport(row.id);
    if (response.data.flag) {
      // 更新成功后的操作，例如刷新列表
      ElMessage.success('周报删除成功！');
      const index = reports.value.findIndex(report => report.id === row.id);
      if (index !== -1) {
        reports.value.splice(index, 1);
      }
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    if (error === 'cancel') {
      // 用户点击了取消按钮
      return;
    }
    ElMessage.error('删除周报失败，请稍后重试');
  }
};

// 处理 reportName 换行
const formatReportName = (reportName) => {
  if (reportName == null || reportName === '') {
    return reportName;
  }
  const parts = reportName.split('-');
  if (parts.length >= 3) {
    const firstPart = parts.slice(0, 2).join('-');
    const secondPart = parts.slice(2,4).join('-');
    const thirdPart = parts.slice(4);
    return `${firstPart}<br>${secondPart}<br>${thirdPart}`;
  }
  return reportName;
};
</script>

<style scoped>
.my-reports {
  padding: 0px;
  width: 100%;
  box-sizing: border-box;
  font-family: 'open sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
}

h2 {
  margin-bottom: 20px;
  font-family: 'open sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 18px;
}

.year-filter {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.year-filter span {
  margin-right: 10px;
}

.report-content {
  white-space: pre-line; /* 保留换行和空格 */
  word-break: break-all; /* 长单词换行 */
}

/* 为表格行设置自适应高度 */
:deep(.el-table .adaptive-row) {
  height: auto !important;
}

/* 可以根据需要添加图标的样式 */
.icon {
  width: 20px;
  height: 20px;
}

/* 设置表格单元格内容全局居中对齐 */
:deep(.el-table th),
:deep(.el-table td) {
  text-align: center;
}

/* 设置周报内容列左对齐 */
:deep(.el-table .left-align-content) {
  text-align: left;
}
</style>