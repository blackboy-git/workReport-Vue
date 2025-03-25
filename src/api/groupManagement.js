import api from './api.js';

// 获取所有分组信息
export async function getGroups() {
  try {
    const response = await api.get('/userGroup');
    return response;
  } catch (error) {
    console.error('获取分组信息失败:', error);
    throw error;
  }
}

//获取组里面的全部成员
export async function getGroupUsers(groupId) {
  try {
    const response = await api.get(`/userGroup/users/${groupId}`);
    return response;
  }catch (error) {
    console.error('获取组里面的全部成员失败:', error);
    throw error;
  }
}

//获取不在该用户组中的用户列表
export async function getNotInGroupUsers(groupId) {
  try {
    const response = await api.get(`/userGroup/getNotInGroupUsers/${groupId}`);
    return response;
  }catch (error) {
    console.error('获取不在该用户组中的用户列表失败:', error);
    throw error;
  }
}

//删除组里面的用户
export async function deleteUserFromGroup(groupId, userId) {
  try {
    const response = await api.delete(`/userGroup/deleteUser/${groupId}/${userId}`);
    return response;
  }catch (error) {
    console.error('删除组里面的用户失败:', error);
    throw error;
  }
}

// 添加成员到组中
export async function addUserToGroup(groupId, userIds) {
  try {
    console.log("addUserToGroup",groupId,userIds);
    const response = await api.post(`/userGroup/addUsers/${groupId}`, { userIds });
    return response;
  } catch (error) {
    console.error('成员管理失败:', error);
    throw error;
  }
}

//添加分组
export async function addGroup(group) {
  console.log("group is : " + group);
  try {
    const response = await api.post('/userGroup', group);
    return response;
  } catch (error) {
    console.error('添加分组失败:', error);
    throw error;
  }
}

// 编辑分组
export async function editGroup(group) {
  try {
    const response = await api.put(`/userGroup`, group);
    return response;
  } catch (error) {
    console.error('编辑分组失败:', error);
    throw error;
  }
}

// 删除分组
export async function deleteGroup(groupId) {
  try {
    const response = await api.delete(`/userGroup/${groupId}`);
    return response;
  } catch (error) {
    console.error('删除分组失败:', error);
    throw error;
  }
}



// 启动/关闭周报计划
export async function toggleReportPlan(groupId) {
  try {
    const response = await api.put(`/userGroup/toggle/${groupId}`);
    return response;
  } catch (error) {
    console.error('切换周报计划状态失败:', error);
    throw error;
  }
}