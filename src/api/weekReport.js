// 引入基础 API 实例
import api from './api.js';

// 获取用户某一年的周报
// export async function getMyWeekReports(username, year) {
//     try {
//         const response = await api.get(`/workReport/${username}/${year}`);
//         return response;
//     } catch (error) {
//         console.error('周报查询失败:', error);
//         throw error;
//     }
// }

// 获取用户信息 API
export async function getMyAllReports(userId) {
    try {
        const response = await api.get(`/workReport/${userId}`);
        return response;
    } catch (error) {
        console.error('获取用户信息请求失败:', error);
        throw error;
    }
}

// 更新周报
export async function updateReport(reportData) {
    try {
      const response = await api.put(`/workReport`, reportData);
      return response;
    } catch (error) {
      console.error('更新周报数据失败:', error);
      throw error;
    }
  }

  // 删除周报
export async function deleteReport(reportId) {
    try {
        const response = await api.delete(`/workReport/${reportId}`);
        return response;
    } catch (error) {
        console.error('删除周报数据失败:', error);
        throw error;
    }
}

// 获取用户最近4次周报信息
export async function getRecentReports(userId) {
    try {
        const response = await api.get(`/workReport/recent/${userId}?limit=4`);
        return response;
    } catch (error) {
        console.error('获取用户最近4次周报信息失败:', error);
        throw error;
    }
}

// 获取用户周报统计数据
export async function getReportStatistics(userId) {
    try {
        const response = await api.get(`/workReport/statistics/${userId}`);
        return response;
    } catch (error) {
        console.error('获取用户周报统计数据失败:', error);
        throw error;
    }
}
