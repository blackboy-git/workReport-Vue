import api from './api.js';

// 获取分组周报列表
export async function getAllGroupWeeklyReports() {
    try {
        const response = await api.get('/groupWeeklyReport');
        return response;
    } catch (error) {
        console.error('获取分组周报列表失败:', error);
        throw error;
    }
}

// 获取周报详情及成员报告
export async function getGroupWeeklyReportDetail(reportId) {
    try {
      const response = await api.get(`/groupWeeklyReport/detail/${reportId}`)
      return response
    } catch (error) {
      console.error('获取周报详情失败:', error)
      throw error
    }
  }

//更新周报浏览次数
export async function updateViewCount(reportId) {
    try {
        const response = await api.put(`/groupWeeklyReport/updateViewCount`,reportId);
        return response;
    } catch (error) {
        console.error('更新周报浏览次数失败:', error);
        throw error;
    }
}

// 获取分组名称列表
export async function getGroupNames() {
    try {
        const response = await api.get('/group-names');
        return response;
    } catch (error) {
        console.error('获取分组名称列表失败:', error);
        throw error;
    }
}

// 删除分组周报记录
export async function deleteGroupWeeklyReport(reportId) {
    try {
        const response = await api.delete(`/groupWeeklyReport/${reportId}`);
        return response;
    } catch (error) {
        console.error('删除分组周报记录失败:', error);
        throw error;
    }
}


    