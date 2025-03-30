<template>
  <div class="my-reports">

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
          <div class="report-content">{{ convertHtmlToText(scope.row.content) }}</div>
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
          <!-- 添加从上周获取数据模板的按钮 -->
          <el-button class="get-last-week-report" @click="getLastWeekReportContent">从上周获取数据模板</el-button>
          <div style="border: 1px solid #ccc;min-width: 365px; max-width: 100%; ">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" 
            :defaultConfig="toolbarConfig" :mode="mode" />
            <Editor style="height: 500px; overflow-y: hidden;" v-model="editingReport.content" 
            :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" @customPaste="customPaste" />
          </div>
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
import { ref, computed, onMounted, shallowRef, onBeforeUnmount } from 'vue';
import { useUserStore } from '../stores/user'; 
import { ElMessage, ElMessageBox  } from 'element-plus';
import { getMyAllReports, updateReport, deleteReport,getLastWeekReports } from '@/api/weekReport'; 
// 导入 wangeditor 富文本编辑器
import "@wangeditor/editor/dist/css/style.css"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const userStore = useUserStore();

//定义默认模板
const defaultContent=`<p>本周已完成工作：<br>
1. <br>
下周工作计划：<br>
1.<br></p>`;

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

// 是否显示编辑对话框
const editDialogVisible = ref(false);

// 当前编辑的周报数据
const editingReport = ref({});

// 编辑器实例引用
const editorRef = shallowRef();

const handleCreated = (editor) => {
  editorRef.value = editor;
};

// 工具栏配置
const toolbarConfig = {
  toolbarKeys: [
    "headerSelect",  // 标题选择
    'bold', // 加粗
    'italic', // 斜体
    'through', // 删除线
    'underline', // 下划线
    'justifyCenter', // 居中对齐
    'justifyJustify', // 两端对齐
    'justifyLeft', // 左对齐
    'justifyRight', // 右对齐
    'bulletedList', // 无序列表
    'numberedList', // 有序列表
    'color', // 文字颜色
    'insertLink', // 插入链接
    'fontSize', // 字体大小
    'lineHeight', // 行高
    'delIndent', // 缩进
    'indent', // 增进
    'divider', // 分割线
    // 'insertTable', // 插入表格
    'undo', // 撤销
    'redo', // 重做
    'clearStyle', // 清除格式
    'fullScreen', // 全屏
    "blockquote", // 引用
    "codeBlock", // 代码块
    // "insertImage", // 插入图片
    // "uploadImage", // 上传图片
    // "insertVideo", // 插入视频
  ]
};

// wangEditor 配置
const editorConfig = {
  width: '100%',
  placeholder: defaultContent, //初始的提示内容
  MENU_CONF: {
    uploadImage: {
      server: 'https://.....',  // 图片上传接口
      fieldName: 'file',  // 上传字段名，根据自己的接口参数配置
    }
  }
};

// 组件挂载时获取数据
onMounted(async () => {
  try {
    const userId = userStore.userInfo.userId; 
    const response = await getMyAllReports(userId);
    if (response.data.flag) {
      const processedReports = response.data.data.map(report => {
        return {
          ...report
        };
      });
      reports.value = processedReports; 
    }
  } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
  }
});

//组件销毁时同时销毁编辑器实例防止内存泄漏
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if(editor == null) return;
  editor.destroy();
});

// 编辑周报
const handleEdit = (row) => {
  editingReport.value = { ...row };
  editDialogVisible.value = true;
};

// 保存编辑
const saveEdit = async () => {
  try {
    //假如未填写内容，或者填写的内容与默认内容一致，则认为不需要保存
    if (!editingReport.value.content|| editingReport.value.content === defaultContent) {
      editDialogVisible.value = false;
      return;
    }
    const response = await updateReport(editingReport.value);
    if (response.data.flag) {
      // 更新成功后的操作，例如刷新列表
      ElMessage.success('周报修改成功！');
      editDialogVisible.value = false;
      // 重新获取周报数据
      const newResponse = await getMyAllReports(userStore.userInfo.userId);
      if (newResponse.data.flag) {
        reports.value = newResponse.data.data;
      }
    }
  } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
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
    }
  } catch (error) {
    if (error === 'cancel') {
      // 用户点击了取消按钮
      return;
    }
    // 错误处理移至响应拦截器，此处不做处理
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

// 处理粘贴事件，清楚粘贴内容样式，只保留文本即可
const customPaste = (editor, event, callback) => {
  // console.log("粘贴html：",event.clipboardData.getData('text/html'));
  console.log("粘贴文本：",event.clipboardData.getData('text/plain'));
  const text = event.clipboardData.getData('text/plain');
  // console.log("粘贴rtf：",event.clipboardData.getData('text/rtf'));
  editor.insertText(text);
  // 阻止默认的粘贴行为
  event.preventDefault()
  return false;
};

// 将 HTML 转换为纯文本并保留换行
const convertHtmlToText = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  // 替换 <br> 标签为换行符
  const textWithBreaks = tempDiv.innerHTML.replace(/<br\s*\/?>/gi, '\n');
  // 去除其他 HTML 标签
  const plainText = textWithBreaks.replace(/<[^>]*>/g, '');
  return plainText;
};

// 获取上周的周报内容
const getLastWeekReportContent = async () => {
  try{
    const response = await getLastWeekReports(userStore.userInfo.userId);
    console.log("获取上周周报内容：",response.data.data);
    if(response.data.flag){
      editingReport.value.content = response.data.data.content;
    }
  }catch(error){
    // 错误处理移至响应拦截器，此处不做处理
  }
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

.year-filter {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.year-filter span {
  margin-right: 10px;
}

.report-content {
  white-space: pre-line; 
  word-break: break-all; 
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

.get-last-week-report{
  margin-bottom: 20px;
}
</style>    