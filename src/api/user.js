// 引入基础 API 实例
import api from './api.js';

// 登录 API
export async function loginApi(userId, password) {
    try {
        const response = await api.post('/api/login', {
            userId,
            password,
        });
        return response;
    } catch (error) {
        console.error('登录请求失败:', error);
        throw error;
    }
}

// 获取用户信息 API
export async function getUserInfoApi() {
    try {
        const response = await api.get('/user/info');
        return response;
    } catch (error) {
        console.error('获取用户信息请求失败:', error);
        throw error;
    }
}

// 登出 API
export async function logoutApi() {
    try {
        const response = await api.post('/auth/logout');
        return response;
    } catch (error) {
        console.error('登出请求失败:', error);
        throw error;
    }
}

// 刷新令牌 API（如果有）
export async function refreshApi() {
    try {
        const response = await api.post('/auth/refresh');
        return response;
    } catch (error) {
        console.error('刷新令牌请求失败:', error);
        throw error;
    }
}

// 获取用户列表 API
export async function getUserListApi() {
    try {
        const response = await api.get('/user/list');
        return response;
    } catch (error) {
        console.error('获取用户列表请求失败:', error);
        throw error;
    }
}

// 新增用户 API
export async function addUserApi(userId, userName, password,role) {
    try {
        const response = await api.post('/user/add', {
            userId,
            userName,
            password,
            role
        });
        return response;
    } catch (error) {
        console.error('新增用户请求失败:', error);
        throw error;
    }
}

// 修改用户 API
export async function updateUserApi(userId, userName, password,role,avatar) {
    try {
        const response = await api.put('/user', {
            userId,
            userName,
            password,
            role,
            avatar
        });
        return response;
    } catch (error) {
        console.error('修改用户请求失败:', error);
        throw error;
    }
}

// 删除用户 API
export async function deleteUserApi(userId) {
    try {
        const response = await api.delete(`/user/${userId}`);
        return response;
    } catch (error) {
        console.error('删除用户请求失败:', error);
        throw error;
    }
}

// 重置密码 API
export async function resetPasswordApi(userId,oldPassword,newPassword) {
    try {
        const response = await api.put('/user/resetPassword', {
            userId,
            oldPassword,
            newPassword
        });
        return response;
    } catch (error) {
        console.error('重置密码请求失败:', error);
        throw error;
    }
}

// 启用/禁用用户 API
export async function changeUserStatus(userId) {
    try {
        const response = await api.get(`/user/setStatus/${userId}`);
        return response;
    } catch (error) {
        console.error('修改用户状态失败:', error);
        throw error;
    }
}