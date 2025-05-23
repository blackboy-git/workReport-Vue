<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="用户信息修改" name="user-info">
        <div class="tab-content">
          <el-form :model="formData" ref="formRef" label-width="100px" :rules="userInfoRules">
            <el-form-item label="姓名:" prop="newUserName">
              <el-input v-model="formData.newUserName" placeholder="请输入用户姓名" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="头像:">
              <div class="avatar-flex-container">
                <div class="avatar-upload-container">
                  <el-upload
                    action="/upload/image"
                    :show-file-list="false"
                    :on-success="handleAvatarUploadSuccess"
                    :before-upload="handleBeforeAvatarUpload"
                  >
                    <el-button size="middle" type="primary">上传头像</el-button>
                  </el-upload>
                </div>
                <!-- 合并预览和实际头像展示，使用 userStore.userInfo.avatarUrl 显示头像 -->
                <img
                  :src="previewAvatarUrl || userStore.userInfo.avatarUrl || 'src/components/icons/defaultHead.png'"
                  alt="头像"
                  class="avatar"
                />
              </div>
            </el-form-item>
            <el-form-item class="center-button spaced-button">
              <el-button type="primary" @click="submitForm">保存设置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!--修改用户密码-->
      <el-tab-pane label="用户密码修改" name="user-password">
        <div class="tab-content">
          <el-form :model="passwordInfo" ref="passwordFormRef" label-width="100px" :rules="passwordRules">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="passwordInfo.oldPassword" 
              :type="oldPasswordVisible ? 'text' : 'password'"
              placeholder="请输入原密码"
              >
                <template #suffix>
                  <el-icon @click="oldPasswordVisible = !oldPasswordVisible">
                    <!-- 修改为使用 Hide 和 View 图标 -->
                    <component :is="oldPasswordVisible ? 'View' : 'Hide'"></component>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input 
                v-model="passwordInfo.newPassword" 
                :type="passwordVisible1 ? 'text' : 'password'"
                placeholder="请输入新密码"
              >
              <template #suffix>
                <el-icon @click="passwordVisible1 = !passwordVisible1">
                  <!-- 修改为使用 Hide 和 View 图标 -->
                  <component :is="passwordVisible1 ? 'View' : 'Hide'"></component>
                </el-icon>
              </template>
            </el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input
               v-model="passwordInfo.confirmPassword"
               :type="passwordVisible2 ? 'text' : 'password'"
               placeholder="请再次输入新密码"
               >
               <template #suffix>
                <el-icon @click="passwordVisible2 = !passwordVisible2">
                  <!-- 修改为使用 Hide 和 View 图标 -->
                  <component :is="passwordVisible2 ? 'View' : 'Hide'"></component>
                </el-icon>
              </template>
              </el-input>
            </el-form-item>
            <el-form-item class="center-button spaced-button">
              <el-button type="primary" @click="savePassword">保存</el-button>
              <el-button type="primary" @click="clearPassword">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user';
import { uploadImage } from '@/api/utils';
import { resetPasswordApi, updateUserAvatar } from '@/api/user';
import CryptoJS from 'crypto-js'; // 引入 crypto-js 库


const activeName = ref('user-info');
const formRef = ref(null);
const passwordFormRef = ref(null);
const previewAvatarUrl = ref('');
const newAvatar = ref('');
const oldPasswordVisible = ref(false);
const passwordVisible1 = ref(false);
const passwordVisible2 = ref(false);
const newFileName = ref('');
const userStore = useUserStore();

const formData = reactive({
  newUserName: '',
});

const passwordInfo = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 用户信息表单校验规则
const userInfoRules = reactive({
  newUserName: [
    { required: true, message: '请输入用户姓名', trigger: 'blur' }
  ]
});

// 密码表单校验规则
const passwordRules = reactive({
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码长度不能少于 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordInfo.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

// 在组件挂载时从 userStore 中获取用户姓名并赋值给 formData.newUserName
onMounted(() => {
  formData.newUserName = userStore.userInfo.userName;
  // 不需要再设置 newAvatar，因为头像显示使用 userStore.userInfo.avatarUrl
});

const handleClick = (tab, event) => {
};


const handleBeforeAvatarUpload = async (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (typeof e.target.result === 'string') {
      previewAvatarUrl.value = e.target.result;
    }
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await uploadImage(formData);
    if (response.data.flag) {
      newFileName.value = response.data.data;
      handleAvatarUploadSuccess(response);
    }
  } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
  }
  return false; // 阻止 el-upload 默认上传行为
};

const handleAvatarUploadSuccess = (response) => {
  if (response.data.flag) {
    newAvatar.value = response.data.data;
    userStore.userInfo.avatar = newFileName.value;
    // 上传成功后，更新头像 URL
    userStore.fetchAvatar();
    ElMessage.success(response.data.msg);
  }
};

const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      console.log('头像名称是：' + newFileName.value);
      const response = await updateUserAvatar(userStore.userInfo.userId, newFileName.value);
      if (response.data.flag) {
        //更新userStore中用户姓名
        ElMessage.success(response.data.msg);
      }
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
  });
};

const savePassword = async () => {
  passwordFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      // 对密码进行 SHA-256 加密
      const encryptedOldPassword = CryptoJS.SHA256(passwordInfo.oldPassword).toString();
      const encryptedNewPassword = CryptoJS.SHA256(passwordInfo.newPassword).toString();
      const response = await resetPasswordApi(userStore.userInfo.userId, encryptedOldPassword, encryptedNewPassword);
      if (response.data.flag) {
        ElMessage.success(response.data.msg);
      }
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
  });
};

//清空所有密码框
const clearPassword = () => {
  console.log('清空所有密码框');
  passwordInfo.oldPassword = '';
  passwordInfo.newPassword = '';
  passwordInfo.confirmPassword = '';
  passwordFormRef.value.clearValidate();
};
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 16px;
  font-weight: 400;
}

.tab-content {
  border: 1px solid #e4e7ed;
  padding: 20px;
  border-radius: 4px;
  margin-top: 10px;
  display: flex; /* 开启弹性布局 */
  flex-direction: column; /* 垂直排列子元素 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  min-height: 300px; /* 设置最小高度，确保内容有足够空间居中 */
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-left: 10px;
}

.avatar-upload-container {
  display: flex;
  align-items: center;
}

.avatar-flex-container {
  display: flex;
  align-items: center;
  height: 100%; 
}

.el-form-item__label {
  display: flex;
  align-items: center; 
  justify-content: center; /* 水平居中 label 文字 */
  height: 100%; /* 让 label 高度与容器一致 */
}

.el-form-item {
  display: flex;
  align-items: center; /* 让整个表单项内元素垂直居中 */
}

.center-button {
  justify-content: center; /* 让按钮所在的表单项内元素水平居中 */
}

.spaced-button {
  margin-top: 40px; /* 增加顶部外边距，让按钮往下移动 */
}

/* 新增样式，扩大保存和重置按钮的宽度 */
.center-button .el-button {
  width: 100px;
}
</style>