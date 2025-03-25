<template>
    <div class="personal-settings">
      <h2>密码设置</h2>
      <el-form :model="passwordForm" ref="formRef" label-width="100px">
        <el-form-item label="原密码:">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="新密码:">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" style="width: 400px;"></el-input>
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
  
  const formRef = ref(null);
  const passwordForm = ref({
    oldPassword: '',
    newPassword: ''
  });
  
  const submitForm = async () => {
    formRef.value.validate(async (valid) => {
      if (!valid) return;
      try {
        const response = await fetch('your-password-update-api-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            oldPassword: passwordForm.value.oldPassword,
            newPassword: passwordForm.value.newPassword
          })
        });
        const data = await response.json();
        if (data.success) {
          ElMessage.success('密码修改成功');
        } else {
          ElMessage.error(data.msg || '密码修改失败');
        }
      } catch (error) {
        ElMessage.error('发生错误：' + error.message);
      }
    });
  };
  </script>
  
  <style scoped>
  /* 样式保持不变 */
  </style>    