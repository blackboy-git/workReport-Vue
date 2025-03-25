<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">工作周报系统</h1>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="userId">
          <el-input
            v-model="loginForm.userId"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            :prefix-icon="Lock"
          />
        </el-form-item>

        <div class="login-options">
          <el-checkbox v-model="rememberMe">记住用户名</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码？</el-link>
        </div>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            立即登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="copyright">
      © 2024 工作周报系统 版权所有
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import {loginApi} from '../api/user';
import { useUserStore } from '../stores/user'; // 引入 useUserStore

// 路由实例（应放在setup顶层）
const router = useRouter();

const loginFormRef = ref(null);

const loginForm = reactive({
  userId: '',
  password: ''
});

const rememberMe = ref(false);
const loading = ref(false);

const validateUserId = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('用户名不能为空'));
  }
  if (value.length < 4) {
    return callback(new Error('用户名长度不能小于4位'));
  }
  callback();
};

const validatePassword = (rule, value, callback) => {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!reg.test(value)) {
    return callback(new Error('密码需8位以上且包含字母和数字'));
  }
  callback();
};

const loginRules = reactive({
  // userId: [{ validator: validateUserId, trigger: 'blur' }],
  // password: [{ validator: validatePassword, trigger: 'blur' }]
});

onMounted(() => {
  const savedUserId = localStorage.getItem('savedUserId');
  if (savedUserId) {
    loginForm.userId = savedUserId;
    rememberMe.value = true;
  }
});

const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (!valid) return;

    try {
      loading.value = true;

      if (rememberMe.value) {
        localStorage.setItem('savedUserId', loginForm.userId);
      } else {
        localStorage.removeItem('savedUserId');
      }

      // 使用 axios 发起登录请求
      const response = await loginApi(loginForm.userId, loginForm.password);

      // 检查后端返回的响应状态
      if (response.data.flag) {
        const userStore = useUserStore();
        // 假设 response.data.data 包含 token 和用户信息
        const userInfo = response.data.data;
        console.log("接收到的user：", userInfo);
        // console.log("接收到的user：", userInfo);
        userStore.setUserInfo(userInfo); // 调用 store 的方法保存用户信息

        ElMessage.success('登录成功');
        router.push('/'); // 跳转到嵌套在 MainLayout 下的首页
      } else {
        // 如果后端返回失败信息，抛出错误
        console.log("错误信息是：",response.data.msg);
        ElMessage.error(response.data.msg || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      ElMessage.error(error.message || '登录失败，请检查用户名和密码');
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);

  .login-card {
    width: 420px;
    padding: 40px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    .login-title {
      font-size: 24px;
      color: #2c3e50;
      text-align: center;
      margin-bottom: 40px;
      font-weight: 600;
      letter-spacing: 1px;
    }

    :deep(.el-input__wrapper) {
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      padding: 0 15px;
      height: 48px;

      .el-input__prefix {
        margin-right: 8px;
      }
    }

    .login-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0 30px;
    }

    .login-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      letter-spacing: 2px;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }
    }
  }

  .copyright {
    margin-top: 40px;
    color: #7f8c8d;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 20px;

    .login-card {
      width: 100%;
      padding: 24px;
    }
  }
}
</style>