<template>
    <div class="personal-settings">
      <h2>用户信息设置</h2>
      <el-form :model="userInfo" ref="formRef" label-width="100px">
        <el-form-item label="用户姓名:">
          <el-input v-model="userInfo.userName" placeholder="请输入用户姓名" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="头像:">
          <div class="avatar-upload-container">
            <el-upload
              action="/upload/image"
              :show-file-list="false"
              :on-success="handleAvatarUploadSuccess"
              :before-upload="handleBeforeAvatarUpload"
            >
              <el-button size="small" type="primary">上传头像</el-button>
            </el-upload>
            <!-- 合并预览和实际头像展示 -->
            <img
              :src="previewAvatarUrl || userInfo.avatar || 'src/components/icons/defaultHead.png'"
              alt="头像"
              class="avatar"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存设置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { useUserStore } from '../stores/user';
  import { uploadImage } from '@/api/utils';
  
  const formRef = ref(null);
  const userInfo = ref({
    userName: '',
    avatar: ''
  });
  const previewAvatarUrl = ref('');
  const newFileName = ref('');
  const userStore = useUserStore();
  
  const handleAvatarUploadSuccess = (response) => {
    if (response.flag) {
      userInfo.value.avatar = response.data.avatarUrl;
      previewAvatarUrl.value = '';
      ElMessage.success(response.msg);
    } else {
      ElMessage.error(response.msg || '头像上传失败');
    }
  };
  
  const handleBeforeAvatarUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewAvatarUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  
    const formData = new FormData();
    formData.append('file', file);
    const userId = userStore.userInfo.userId;
    try {
      const response = await uploadImage(formData);
      if (response.data.flag) {
        newFileName.value = response.data.data;
        handleAvatarUploadSuccess(response.data);
      } else {
        ElMessage.error(response.msg || '头像上传失败');
      }
    } catch (error) {
      ElMessage.error('头像上传失败');
    }
    return false; // 阻止 el-upload 默认上传行为
  };
  
  const submitForm = async () => {
    formRef.value.validate(async (valid) => {
      if (!valid) return;
      try {
        const response = await fetch('your-update-api-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: userInfo.value.userName,
            newFileName: newFileName.value
          })
        });
        const data = await response.json();
        if (data.success) {
          ElMessage.success('设置保存成功');
        } else {
          ElMessage.error(data.msg || '设置保存失败');
        }
      } catch (error) {
        ElMessage.error('发生错误：' + error.message);
      }
    });
  };
  </script>
  
  <style scoped>
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
  </style>    