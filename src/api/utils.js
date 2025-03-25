// 引入基础 API 实例
import api from './api.js';

//调用上传图片接口
export async function uploadImage(formData) {
    try {
        const response = await api.post('/upload/image', formData, {
            headers: {
                //注意：不要手动设置 Content-Type 为 multipart/form-data，axios 会自动处理
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('上传图片请求失败:', error);
        throw error;
    }
}