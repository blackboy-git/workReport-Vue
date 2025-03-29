// api.js
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

// 创建 Axios 实例
const api = axios.create({
    baseURL: 'http://localhost:8088', // 配置基础 URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const AUTHORIZATION_HEADER = 'Authorization';
const BEARER_PREFIX = 'Bearer ';

//请求拦截器
api.interceptors.request.use(
    // 在请求发送之前，可以添加一些通用的配置，如添加 token 等
    config => {
        const userStore = useUserStore();
        if(userStore.userInfo.token){
            config.headers[AUTHORIZATION_HEADER] = BEARER_PREFIX + userStore.userInfo.token;
        }
        return config;
    },
    (error) => {
        console.error("请求拦截器错误:", error);
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    (response) => {
      const data = response.data;
      // 若后端返回错误标志（如 flag 为 false），统一处理消息
      if (data &&!data.flag) { 
        ElMessage.error(data.msg); // 显示后端返回的具体错误信息
        // 若涉及 Token 失效，执行登出并跳转登录页
        if (data.msg.includes('Token')) { 
          const userStore = useUserStore();
          const router = useRouter();
          userStore.logout();
          router.push('/login');
        }
        return Promise.reject(new Error(data.msg)); // 拒绝请求，避免后续错误处理
      }
      return response;
    },
    (error) => {
      console.error('响应拦截器错误:', error);
      // 处理网络错误等无响应数据的情况
      ElMessage.error('网络连接错误，请检查网络设置'); 
      return Promise.reject(error);
    }
  );

export default api;