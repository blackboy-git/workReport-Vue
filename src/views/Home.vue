<template>
  <div class="home">
    <!-- 周报统计信息（方块图展示） -->
    <div class="report-statistics">
      <el-row>
        <el-col :span="8" v-for="(item, index) in statList" :key="index">
          <el-card class="stat-block" :style="{ backgroundColor: item.bgColor }">
            <div class="stat-title">{{ item.title }}</div>
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-percent">{{ item.percent }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    

    <!-- 最近4次周报信息 -->
    <div class="recent-reports">
      <el-row>
        <el-col :span="6" v-for="(report, index) in displayReports" :key="index">
          <el-card class="reports_card" style="max-width: 480px">
            <template #header>
              <el-tooltip placement="top" popper-class="custom-tooltip">
                <template #content> {{ report.reportName }} </template>
                <div class="card-header">
                  <span>{{ report.reportName }}</span>
                </div>
              </el-tooltip>
            </template>
            <el-tooltip placement="bottom"  popper-class="custom-tooltip" :disabled="disabled">
              <template #content> 
                <div v-html="report.content.replace(/\n/g, '<br>')"></div>
              </template>
              <div class="card-content">
                <span>{{ report.content }}</span>
              </div>
            </el-tooltip>
            <template #footer>
              <span>{{ report.createTime ? `创建时间: ${report.createTime}` : '' }}</span>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { getRecentReports, getReportStatistics } from '@/api/weekReport';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();
const router = useRouter();
const recentReports = ref([]);
const statistics = ref({
  filledCount: 0,
  totalCount: 0,
  unfilledCount: 0
});

// 模拟统计数据映射（可根据实际数据调整）
const statList = ref([
  {
    title: '已填写周报次数',
    value: statistics.value.filledCount,
    bgColor: '#e6f7ff' // 浅蓝色背景
  },
  {
    title: '应填写周报次数',
    value: statistics.value.totalCount,
    bgColor: '#f6ffed' // 浅绿色背景
  },
  {
    title: '未填写周报次数',
    value: statistics.value.unfilledCount,
    bgColor: '#fff1e6' // 浅黄色背景
  }
]);

const displayReports = computed(() => {
  if (recentReports.value.length === 0) {
    return Array.from({ length: 4 }, () => ({}));
  }
  return recentReports.value;
});

const logout = async () => {
  await userStore.logout();
  router.push('/login');
};

//取得统计数据
const getStatistics = async (userId) => {
  try {
    const response = await getReportStatistics(userId);
    if (response.data.flag) {
      statistics.value = response.data.data;
      // 更新统计列表
      statList.value = [
        {
          title: '已填写周报次数',
          value: statistics.value.filledCount,
          bgColor: '#e6f7ff'
        },
        {
          title: '应填写周报次数',
          value: statistics.value.shouldFilledCount,
          bgColor: '#f6ffed'
        },
        {
          title: '未填写周报次数',
          value: statistics.value.unfilledCount,
          bgColor: '#fff1e6'
        }
      ]
    }else{
      ElMessage.error(response.data.msg);
    }
  }catch(error){
    ElMessage.error('获取数据失败，请稍后重试');
  }
};

//获取用户最近的4次周报信息
const getLastReports = async (userId) => {
  try {
    const response = await getRecentReports(userId);
    if (response.data.flag) {
      recentReports.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('获取数据失败，请稍后重试');
  }
}

onMounted(async () => {
  const userId = userStore.userInfo.userId;
  getStatistics(userId);
  getLastReports(userId);
});
</script>

<style scoped>
.home {
  padding: 0px;
}

/* 统计方块样式 */
.report-statistics {
  margin-top: 20px;
}

.stat-block {
  margin: 5px 30px;
  padding: 5px;
  text-align: center;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-title {
  color: #666;
  font-size: 18px;
  margin-bottom: 5px;
}

.stat-value {
  color: #1890ff;
  font-size: 34px;
  font-weight: bold;
}

.recent-reports {
  margin-top: 20px;
}

.reports_card {
  margin: 10px;
  border: 1px solid #ebeef5;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content {
  height: 280px;
  padding: 15px;
  line-clamp: 10;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  white-space: pre-wrap;
}


</style>