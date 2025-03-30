<template>
  <div class="user-management">
    <div class="add-user">
      <el-button type="primary" @click="openAddUserDialog">新增用户</el-button>
    </div>

    <el-table :data="users" stripe>
      <el-table-column type="index" label="序号" width="100px"></el-table-column>
      <el-table-column prop="userId" label="用户 ID"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column prop="enabled" label="是否启用">
        <template #default="scope">
          <el-icon class="icon">
                <component :is="scope.row.enabled ? 'CircleCheckFilled' : 'CircleCloseFilled'"></component>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
      <template #default="scope">
        <el-button size="small" type="primary" @click="openEditUserDialog(scope.row)">修改</el-button>
        <el-button size="small" type="danger" @click="deleteUser(scope.row.userId)">删除</el-button>
        <el-button size="small" type="warning" @click="openResetPasswordDialog(scope.row.userId)">重置密码</el-button>
        <!-- 添加启用/禁用按钮 -->
        <el-button size="small" :type="scope.row.enabled? 'info' : 'success'" @click="toggleUserStatus(scope.row)">
          {{ scope.row.enabled? '禁用' : '启用' }}
        </el-button>
      </template>
    </el-table-column>
    </el-table>

    <!-- 新增用户对话框 -->
    <el-dialog v-model="addUserDialogVisible" title="新增用户" width="400px">
      <el-form :model="newUser" :rules="userRules" ref="addUserFormRef" label-width="100px">
        <el-form-item label="用户ID:" prop="userId">
          <el-input v-model="newUser.userId" placeholder="请输入用户 ID"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名:" prop="userName">
          <el-input v-model="newUser.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密 码:" prop="password">
          <el-input
            v-model="newUser.password"
            :type="addPasswordVisible ? 'text' : 'password'"
            placeholder="请输入密码"
          >
          <template #suffix>
            <el-icon @click="addPasswordVisible = !addPasswordVisible">
              <!-- 修改为使用 Hide 和 View 图标 -->
              <component :is="addPasswordVisible ? 'View' : 'Hide'"></component>
            </el-icon>
          </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="role" label="角 色:">
          <el-radio-group v-model="newUser.role">
            <el-radio label="ADMIN">ADMIN</el-radio>
            <el-radio label="USER">USER</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog v-model="editUserDialogVisible" title="修改用户" width="400px">
      <el-form :model="editingUser" :rules="userRules" ref="editUserFormRef" label-width="100px">
        <el-form-item label="用户ID:" prop="userId">
          <el-input v-model="editingUser.userId" placeholder="请输入用户 ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名:" prop="userName">
          <el-input v-model="editingUser.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密 码:" prop="password">
          <el-input
            v-model="editingUser.password"
            :type="editPasswordVisible ? 'text' : 'password'"
            placeholder="请输入密码"
          >
            <template #suffix>
              <el-icon @click="editPasswordVisible = !editPasswordVisible">
                <!-- 更新图标使用方式 -->
                <component :is="editPasswordVisible ? 'View' : 'Hide'"></component>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="role">
          <el-radio-group v-model="editingUser.role">
            <el-radio label="ADMIN">ADMIN</el-radio>
            <el-radio label="USER">USER</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUser">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
  <el-dialog v-model="resetPasswordDialogVisible" title="重置密码" width="400px">
    <el-form :model="resetPasswordForm" ref="resetPasswordFormRef">
      <el-form-item label="原密码:" prop="oldPassword">
        <el-input v-model="resetPasswordForm.oldPassword" placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码:">
        <el-input
          v-model="resetPasswordForm.newPassword"
          :type="resetPasswordVisible ? 'text' : 'password'"
          placeholder="请输入新密码"
        >
          <template #suffix>
            <el-icon @click="resetPasswordVisible = !resetPasswordVisible">
              <component :is="resetPasswordVisible ? 'View' : 'Hide'"></component>
            </el-icon>
          </template>
        </el-input>
        <el-button @click="generateRandomPassword">生成随机密码</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmResetPassword">确定</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { addUserApi, updateUserApi, deleteUserApi, resetPasswordApi, getUserListApi, changeUserStatus } from '../api/user';
import CryptoJS from 'crypto-js'; // 引入 crypto-js 库

const users = ref([]);
const addUserDialogVisible = ref(false);
const editUserDialogVisible = ref(false);
const resetPasswordDialogVisible = ref(false);
const resetPasswordVisible = ref(false);
const addUserFormRef = ref(null);
const editUserFormRef = ref(null);
const newUser = reactive({
  userId: '',
  userName: '',
  password: '',
  role: 'USER' // 默认角色为 USER
});
const editingUser = reactive({
  userId: '',
  userName: '',
  password: '',
  role: 'USER' // 默认角色为 USER
});

const resetPasswordForm = reactive({
  userId: '',
  oldPassword: '',
  newPassword: ''
});

const addPasswordVisible = ref(false);
const editPasswordVisible = ref(false);

const userRules = reactive({
  userId: [
    { required: true, message: '用户 ID 不能为空', trigger: 'blur' }
  ],
  userName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!reg.test(value)) {
          return callback(new Error('密码需 8 位以上且包含字母和数字'));
        }
        callback();
      },
      trigger: 'blur'
    }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
});

onMounted(async () => {
  try {
    const response = await getUserListApi();
    users.value = response.data.data;
  } catch (error) {
    ElMessage.error('获取用户列表失败');
  }
});

const openAddUserDialog = () => {
  addUserDialogVisible.value = true;
  newUser.userId = '';
  newUser.userName = '';
  newUser.password = '';
  newUser.role = 'USER'; // 重置角色为默认值
  addPasswordVisible.value = false;
};

const openEditUserDialog = (user) => {
  editUserDialogVisible.value = true;
  editingUser.userId = user.userId;
  editingUser.userName = user.userName;
  editingUser.role = user.role;
  editPasswordVisible.value = false;
};

const addUser = async () => {
  addUserFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      // 对密码进行 SHA-256 加密
      const encryptedPassword = CryptoJS.SHA256(newUser.password).toString();
      const response = await addUserApi(newUser.userId, newUser.userName,encryptedPassword , newUser.role);
      if (response.data.flag) {
        //更新成功后的操作，刷新列表
        ElMessage.success('新增用户成功');
        addUserDialogVisible.value = false;

        //重新获取用户列表信息
        const newResponse = await getUserListApi();
        if (newResponse.data.flag) {
          users.value = newResponse.data.data;
        } 
      }
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
  });
};

const updateUser = async () => {
  editUserFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      // 对密码进行 SHA-256 加密
      const encryptedPassword = CryptoJS.SHA256(editingUser.password).toString();
      const response = await updateUserApi(editingUser.userId, editingUser.userName, encryptedPassword, editingUser.role,null);
      if (response.data.flag) {
        ElMessage.success('修改用户成功');
        editUserDialogVisible.value = false;

        //重新获取用户列表信息
        const newResponse = await getUserListApi();
        if (newResponse.data.flag) {
          users.value = newResponse.data.data;
        }
      } 
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
  });
};

const deleteUser = async (userId) => {
  try {
    //弹出确认框
    await ElMessageBox.confirm(
      '确定要删除该用户吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    const response = await deleteUserApi(userId);
    if (response.data.flag) {
      ElMessage.success('删除用户成功');
      const index = users.value.findIndex(user => user.userId === userId);
      if (index !== -1) {
        users.value.splice(index, 1);
      }
    }
  } catch (error) {
    if (error === 'cancel') {
      return;
    }
    // 错误处理移至响应拦截器，此处不做处理
  }
};

const openResetPasswordDialog = (userId) => {
  resetPasswordDialogVisible.value = true;
  // 重置表单数据
  resetPasswordForm.userId = userId;
  resetPasswordForm.oldPassword = '';
  resetPasswordForm.newPassword = '';
};

//生成随机密码
const generateRandomPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  resetPasswordForm.newPassword = password;
};

// 重置密码对话框相关逻辑
const confirmResetPassword = async () => {
  try {
      // 对密码进行 SHA-256 加密
      const encryptedOldPassword = CryptoJS.SHA256(resetPasswordForm.oldPassword).toString();
      const encryptedNewPassword = CryptoJS.SHA256(resetPasswordForm.newPassword).toString();
      const response = await resetPasswordApi(
        resetPasswordForm.userId,
        encryptedOldPassword,
        encryptedNewPassword
      );
      if (response.data.flag) {
        ElMessage.success('重置密码成功');
        resetPasswordDialogVisible.value = false;
      } 
    } catch (error) {
      // 错误处理移至响应拦截器，此处不做处理
    }
};

// 添加切换用户状态的方法
const toggleUserStatus = async (user) => {
  try {
    const response = await changeUserStatus(user.userId);
    if (response.data.flag) {
      user.enabled =!user.enabled;
      ElMessage.success(user.enabled? '启用用户成功' : '禁用用户成功');
    }
  } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
  }
};
</script>

<style scoped>
.user-management {
  padding: 0px;
  width: 100%;
  box-sizing: border-box;
}

.add-user {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

/* 可以根据需要添加表格行自适应高度样式 */
:deep(.el-table .adaptive-row) {
  height: auto !important;
}

.icon{
  width: 20px;
  height: 20px;;
}

/* 设置表格单元格内容全局居中对齐 */
:deep(.el-table th),
:deep(.el-table td) {
  text-align: center;
}
</style>    