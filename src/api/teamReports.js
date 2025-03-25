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

// 获取用户组信息 API
export async function getMyTeamAllReports(groupId) {
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

//获取用户所在组的成员名单
export async function getGroupMembers(userId) {
    try {
        const response = await api.get(`/workReport/groupMembers/${userId}`);
        return response;
    } catch (error) {
        console.error('获取用户所在组的成员名单失败:', error);
        throw error;
    }
}
