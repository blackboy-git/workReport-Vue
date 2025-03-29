<template>
    <div class="group-management">

        <!-- 新增分组按钮 -->
        <div class="add-group">
            <el-button type="primary" @click="handleAddGroup">新增分组</el-button>
        </div>

        <!-- 分组列表 -->
        <el-table :data="groups" stripe>
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column prop="groupName" label="分组名称" ></el-table-column>
            <el-table-column prop="reportPlanName" label="周报计划名称" ></el-table-column>
            <el-table-column prop="startDate" label="计划开始日期" ></el-table-column>
            <el-table-column prop="cycleDays" label="周报间隔(天)" ></el-table-column>
            <el-table-column prop="allowDays" label="周报开放(天)" ></el-table-column>
            <el-table-column label="计划启用" >
                <template #default="scope">
                    <el-icon class="icon">
                        <component :is="scope.row.active ? 'CircleCheckFilled' : 'CircleCloseFilled'"></component>
                    </el-icon>
                </template>
            </el-table-column>
            <el-table-column label="操作" width='400px'>
                <template #default="scope">
                    <el-button size="small" type="warning" @click="handleMemberManagement(scope.row)">成员管理</el-button>
                    <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    <el-button size="small" :type="scope.row.active ? 'info' : 'success'" @click="handleTogglePlan(scope.row)">
                        {{ scope.row.active ? '禁用' : '启用' }} 计划
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 成员管理弹窗 -->
        <el-dialog v-model="memberManagementDialogVisible" title="组成员管理" width="400px">
            <template #default>
                <div>
                    <!-- 传递 currentGroupId 给 handleAddUser 方法 -->
                    <el-button type="primary" @click="handleAddUser(currentGroupId)">添加用户</el-button>
                    <el-table :data="groupUsers" stripe style="width: 100%;">
                        <el-table-column prop="userId" label="用户 ID" width="100"></el-table-column>
                        <el-table-column prop="userName" label="用户姓名" width="150"></el-table-column>
                        <el-table-column label="操作" width="100">
                            <template #default="scope">
                                <el-button size="small" type="danger" @click="handleDeleteUser(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <template #footer>
                <el-button @click="memberManagementDialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>

        <!-- 添加用户弹窗 -->
        <el-dialog v-model="addUserDialogVisible" title="添加用户到组" width="400px">
            <template #default>
                <el-table :data="allUsers" stripe style="width: 100%;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="userId" label="用户 ID" width="100"></el-table-column>
                    <el-table-column prop="userName" label="用户姓名" width="150"></el-table-column>
                </el-table>
            </template>
            <template #footer>
                <el-button @click="addUserDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSaveUsers">保存</el-button>
            </template>
        </el-dialog>

        <!-- 新增分组弹窗 -->
        <el-dialog v-model="addGroupDialogVisible" title="新增分组" width="400px">
            <template #default>
                <el-form :model="newGroup" label-width="100px">
                    <el-form-item label="分组名称">
                        <el-input v-model="newGroup.groupName"></el-input>
                    </el-form-item>
                    <el-form-item label="周报计划名称">
                        <el-input v-model="newGroup.reportPlanName"></el-input>
                    </el-form-item>
                    <el-form-item label="计划开始日期">
                        <el-date-picker
                            v-model="newGroup.startDate"
                            type="date"
                            placeholder="选择日期"                            
                            value-format="YYYY-MM-DD"
                            time-zone="Asia/Shanghai"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="周报间隔(天)">
                        <el-input v-model="newGroup.cycleDays" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="周报开放(天)">
                        <el-input v-model="newGroup.allowDays" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="计划启用">
                        <el-switch v-model="newGroup.active"></el-switch>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button @click="addGroupDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSaveGroup">保存</el-button>
            </template>
        </el-dialog>

        <!-- 编辑分组弹窗 -->
        <el-dialog v-model="editGroupDialogVisible" title="编辑分组" width="400px">
            <template #default>
                <el-form :model="editGroupData" label-width="100px">
                    <el-form-item label="分组名称">
                        <el-input v-model="editGroupData.groupName"></el-input>
                    </el-form-item>
                    <el-form-item label="周报计划名称">
                        <el-input v-model="editGroupData.reportPlanName"></el-input>
                    </el-form-item>
                    <el-form-item label="计划开始日期">
                        <el-date-picker
                            v-model="editGroupData.startDate"
                            type="date"
                            placeholder="选择日期"
                            value-format="YYYY-MM-DD"
                            time-zone="Asia/Shanghai"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="周报间隔(天)">
                        <el-input v-model="editGroupData.cycleDays" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="周报开放(天)">
                        <el-input v-model="editGroupData.allowDays" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="计划启用">
                        <el-switch v-model="editGroupData.active"></el-switch>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button @click="editGroupDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSaveEditGroup">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useUserStore } from '@/stores/user';
import { getGroups, getGroupUsers, getNotInGroupUsers, addUserToGroup, editGroup, deleteGroup, toggleReportPlan, deleteUserFromGroup, addGroup } from '@/api/groupManagement'; 
import { ElMessage,ElMessageBox } from 'element-plus';

const userStore = useUserStore();
const groups = ref([]);
const memberManagementDialogVisible = ref(false);
const groupUsers = ref([]);
const currentGroupId = ref(null);
const addUserDialogVisible = ref(false);
const allUsers = ref([]);
const selectedUsers = ref([]);
const addGroupDialogVisible = ref(false); 
const newGroup = ref({
    groupName: '',
    reportPlanName: '',
    startDate: '',
    cycleDays: 0,
    allowDays: 0,
    active: false
});
const editGroupDialogVisible = ref(false);
const editGroupData = ref({});

// 获取分组数据
const fetchGroups = async () => {
    try {
        const response = await getGroups();
        if (response && response.data && response.data.flag) {
            groups.value = response.data.data;
        }
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
};

// 编辑分组
const handleEdit = (group) => {
    editGroupData.value = { ...group };
    editGroupDialogVisible.value = true;
};

// 删除分组
const handleDelete = async (group) => {
    try {
    //弹出确认框
    await ElMessageBox.confirm(
      '确定要删除该分组吗？注意：组内的成员会被全部移除。',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    const response = await deleteGroup(group.id);
    if (response.data.flag) {
      ElMessage.success('删除分组成功');
      const index = groups.value.findIndex(item => item.id === group.id);
      if (index !== -1) {
        groups.value.splice(index, 1);
      }
    }
  } catch (error) {
    if (error === 'cancel') {
      return;
    }
  }
};

// 启动/关闭周报计划
const handleTogglePlan = async (group) => {
    try {
        const response = await toggleReportPlan(group.id);
        if(response.data.flag){
            ElMessage.success('操作成功');
            fetchGroups(); 
        }
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
};

// 成员管理
const handleMemberManagement = async (group) => {
    currentGroupId.value = group.id;
    try {
        const response = await getGroupUsers(group.id);
        if (response && response.data && response.data.flag) {
            memberManagementDialogVisible.value = true;
            groupUsers.value = response.data.data;
            await nextTick(); 
        }
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
};

// 处理添加用户按钮点击事件
const handleAddUser = async (groupId) => {
    try {
        const response = await getNotInGroupUsers(groupId);
        if (response && response.data && response.data.flag) {
            allUsers.value = response.data.data;
            addUserDialogVisible.value = true;
        }
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
};

// 处理用户选择事件
const handleSelectionChange = (val) => {
    selectedUsers.value = val;
};

// 处理保存用户事件
const handleSaveUsers = async () => {
    const userIds = selectedUsers.value.map(user => user.userId);
    try {
        console.log("用户id组：" + userIds);
        await addUserToGroup(currentGroupId.value, userIds);
        const response = await getGroupUsers(currentGroupId.value);
        if (response && response.data && response.data.flag) {
            ElMessage.success('添加用户成功');
            groupUsers.value = response.data.data;
            await nextTick(); 
        }
        addUserDialogVisible.value = false;
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
};

// 新增分组
const handleAddGroup = () => {
    addGroupDialogVisible.value = true;
};

// 保存新增分组
const handleSaveGroup = async () => {
    try {
        const response = await addGroup(newGroup.value);
        if(response.data.flag){
            ElMessage.success('新增分组成功');
            addGroupDialogVisible.value = false;
            fetchGroups(); 
            newGroup.value = {
                groupName: '',
                reportPlanName: '',
                startDate: '',
                cycleDays: 0,
                allowDays: 0,
                active: false
            };
        }
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
};

// 保存编辑分组
const handleSaveEditGroup = async () => {
    try {
        await editGroup(editGroupData.value);
        ElMessage.success('编辑分组成功');
        editGroupDialogVisible.value = false;
        fetchGroups(); 
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
};


// 删除用户
const handleDeleteUser = async (user) => {
    try {
        await deleteUserFromGroup(currentGroupId.value, user.userId);
        const response = await getGroupUsers(currentGroupId.value);
        if (response && response.data && response.data.flag) {
            groupUsers.value = response.data.data;
            await nextTick(); 
        }
    } catch (error) {
    // 错误处理移至响应拦截器，此处不做处理
    }
};


onMounted(() => {
    fetchGroups();
});
</script>

<style scoped>
.group-management {
    padding: 0px;
}

.add-group {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.icon {
    width: 40px;
    height: 40px;
}

/* 调整组成员管理对话框的宽度 */
.el-dialog {
    width: 40%; 
}

/* 设置表格单元格内容全局居中对齐 */
:deep(.el-table th),
:deep(.el-table td) {
  text-align: center;
}
</style>