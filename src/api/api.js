// api.js
import axios from 'axios';

// 创建 Axios 实例
const api = axios.create({
    baseURL: 'http://localhost:8088', // 配置基础 URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;