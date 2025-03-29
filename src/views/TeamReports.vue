<template>
  <div>
    <!-- 筛选区域 -->
    <div class="filter-area">
      <el-select v-model="selectedYear" placeholder="选择年份" @change="filterReports">
        <el-option
          v-for="year in availableYears"
          :key="year"
          :label="year"
          :value="year"
        />
      </el-select>
      <el-select v-model="selectedGroupName" placeholder="选择分组名称" @change="filterReports">
        <el-option
          v-for="item in groupNames"
          :key="item.groupId"
          :label="item.groupName"
          :value="item.groupName"
        />
      </el-select>
      <el-button @click="clearFilters">清除筛选</el-button>
    </div>
    <el-table :data="filteredReports" stripe>
      <el-table-column type="index" label="序号" width="100px"/>
      <el-table-column prop="groupName" label="分组名称" />
      <el-table-column prop="reportName" label="周报名称"/>
      <el-table-column prop="viewCount" label="浏览次数" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="viewReport(scope.row)">查看</el-button>
          <el-button size="small" type="danger" @click="deleteReport(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllGroupWeeklyReports, updateViewCount, deleteGroupWeeklyReport } from '@/api/groupWeeklyReport';
import { getGroups } from '@/api/groupManagement';
import { ElMessage,ElMessageBox } from 'element-plus';

const router = useRouter();
const groupWeeklyReports = ref([]);
// 筛选条件
const selectedGroupName = ref('');
// 当前年份
const currentYear = new Date().getFullYear();

// 可用年份
const availableYears = ref([]);
for (let year = currentYear - 5; year <= currentYear; year++) {
  availableYears.value.push(year);
}

// 选中的年份（默认为当前年）
const selectedYear = ref(currentYear);

// 筛选年份和分组名称后的周报数据
const filteredReports = computed(() => {
  if (isInitializing.value) {
    return groupWeeklyReports.value;
  }
  return groupWeeklyReports.value.filter(report => {
    const reportYear = new Date(report.createTime).getFullYear();
    const yearMatch = selectedYear.value === '' || reportYear === selectedYear.value;
    const groupNameMatch = selectedGroupName.value === '' || report.groupName === selectedGroupName.value;
    return yearMatch && groupNameMatch;
  });
});

// 分组名称列表
const groupNames = ref([]);
// 标志位，控制是否在初始化时进行筛选
const isInitializing = ref(true);

// 获取所有分组的周报列表
const fetchGroupWeeklyReports = async () => {
  try {
    const response = await getAllGroupWeeklyReports();
    if(response.data.flag){
      groupWeeklyReports.value = response.data.data;
    }
  } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
  }
};

// 获取所有分组名称和ID
const fetchGroupNames = async () => {
  try {
    const response = await getGroups();
    if (response.data.flag) {
      groupNames.value = response.data.data.map(group => ({
        groupId: group.id,
        groupName: group.groupName
      }));
    }
  } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
  }
};

//更新浏览次数
const handleUpdateViewCount = async (reportId) => {
  try {
    await updateViewCount(reportId);
    // 更新浏览次数后重新获取数据
    await fetchGroupWeeklyReports();
  } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
  }
};

//查看周报详情页
const viewReport = async (report) => {
  try {
    // 调用更新浏览次数的接口
    await handleUpdateViewCount(report.id);
    const route = router.resolve({ 
      name: 'WeeklyReportDetail', 
      params: { 
        reportId: report.id,
        groupName: report.groupName,
        reportName: report.reportName
      } 
    });
    window.open(route.href, '_blank');
  } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
  }
};

//删除周报
const deleteReport = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除周报吗？周报中所有成员的周报都将被删除！',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    const response = await deleteGroupWeeklyReport(row.id);
    if(response.data.flag){
      // 更新成功后的操作，例如刷新列表
      ElMessage.success('周报删除成功！');
      const index = reports.value.findIndex(filteredReports => filteredReports.id === row.id);
      if (index !== -1) {
        filteredReports.value.splice(index, 1);
      }
    }
  }catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
  }
};

// 筛选函数
const filterReports = () => {

};

// 清除筛选条件
const clearFilters = () => {
  selectedYear.value = '';
  selectedGroupName.value = '';
};

onMounted(async () => {
  await fetchGroupWeeklyReports();
  await fetchGroupNames();
  // 初始化完成后，允许筛选
  isInitializing.value = false;
});
</script>

<style scoped>
.filter-area {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}


/* 设置表格单元格内容全局居中对齐 */
:deep(.el-table th),
:deep(.el-table td) {
  text-align: center;
}
</style>