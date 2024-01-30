<template>
    <el-card>
        <el-form inline>
            <el-row justify="space-between">
                <el-form-item label="用户名：">
                    <el-input placeholder="请输入搜索的用户名" v-model="keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="keyword == ''" @click="searchUser">搜索</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
        <el-button type="primary" size="default" @click="deleteSelectUser">批量删除</el-button>
        <!-- table展示用户信息 -->
        <el-table style="margin: 10px 0px;" border :data="userArr" ref="userTableRef">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template v-slot="{ row, $index }">
                    <el-button type="warning" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="pageChange"
            @size-change="sizeChange" />
    </el-card>
    <el-drawer v-model="userDrawer">
        <!-- 头部标题:将来文字内容应该动态的 -->
        <template #header>
            <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
        </template>
        <!-- 身体部分 -->
        <template #default>
            <el-form :model="userParams" :rules="rules" ref="useFormRef">
                <el-form-item label="用户姓名" prop="username">
                    <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                    <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-drawer>
    <el-drawer v-model="userRoleDrawer">
        <template #header>
            <h4>分配角色</h4>
        </template>
        <template #default>
            <el-form :model="userParams">
                <el-form-item label="用户姓名">
                    <el-input disabled :placeholder="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="职位列表">
                    <el-checkbox @change="handleCheckAllChange" v-model="checkAll"
                        :indeterminate="isIndeterminate">全选</el-checkbox>
                    <!-- 显示职位的的复选框 -->
                    <el-checkbox-group v-model="userRole">
                        <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role.id">{{ role.roleName
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="saveRole">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang='ts'>
import { ref, onMounted, nextTick, computed } from 'vue';
import { reqSelectUser, reqRemoveUser, reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole } from '@/api/acl/user';
import type { SetRoleData, UserResponseData, Records, User, AllRoleResponseData, AllRole } from '@/api/acl/user/type';
import { ElMessage, ElForm, ElTable, CheckboxValueType } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
let pageNo = ref(1);
let pageSize = ref(5);
let total = ref(0);
let userArr = ref<User[]>([]);
let keyword = ref<string>('');
let userDrawer = ref<boolean>(false);
let userRoleDrawer = ref<boolean>(false);
let userParams = ref<User>({
    username: '',
    password: '',
    name: '',
    id: undefined,
});
let userTableRef = ref<InstanceType<typeof ElTable>>();
let useFormRef = ref<InstanceType<typeof ElForm>>();
let allRole = ref<AllRole>([]);
let userRole = ref<number[]>([]);
let checkAll = computed(() => {
    return userRole.value.length === allRole.value.length;
});
let isIndeterminate = computed(() => {
    return userRole.value.length > 0 && userRole.value.length < allRole.value.length;
});
const getHasUser = async () => {
    let res = await reqUserInfo(pageNo.value, pageSize.value, keyword.value);
    if (res.code === 200) {
        userArr.value = res.data.records;
        total.value = res.data.total;
    } else {
        ElMessage.error(res.message);
    }
};
//搜索
const searchUser = () => {
    pageNo.value = 1;
    getHasUser();
};
const reset = () => {
    keyword.value = '';
    pageNo.value = 1;
    pageSize.value = 5;
    getHasUser();
};
//分配角色
const handleCheckAllChange = (val: CheckboxValueType) => {
    userRole.value = val ? (
        allRole.value.map(item => item.id!)
    ) : [];
};
const setRole = async (row: User) => {
    userParams.value = row;
    let res = await reqAllRole(0);
    allRole.value = res.data.allRolesList;
    userRole.value = [];
    userRoleDrawer.value = true;
};
const saveRole = async () => {
    console.log(userRole.value);
    console.log(checkAll.value, isIndeterminate.value);
    let res = await reqSetUserRole({ userId: userParams.value.id!, roleIdList: userRole.value });
    if (res.code === 200) {
        ElMessage.success(res.message);
        userRoleDrawer.value = false;
        getHasUser();
    } else {
        ElMessage.error(res.message);
    }
};
//删除用户
const deleteSelectUser = () => {
    userTableRef.value?.getSelectionRows().forEach((item: User) => {
        deleteUser(item.id!);
    });
};
const deleteUser = (id: number) => {
    reqRemoveUser(id).then(res => {
        if (res.code === 200) {
            ElMessage.success(res.message);
            getHasUser();
        } else {
            ElMessage.error(res.message);
        }
    });
};
//添加和修改用户信息
const updateUser = (row: User) => {
    userParams.value = row;
    useFormRef.value?.clearValidate('username');
    useFormRef.value?.clearValidate('name');
    userDrawer.value = true;
};
const addUser = () => {
    userParams.value = {
        username: '',
        password: '',
        name: '',
        id: undefined,
    };
    useFormRef.value?.clearValidate('username');
    useFormRef.value?.clearValidate('name');
    useFormRef.value?.clearValidate('password');
    userDrawer.value = true;
};
const saveUserInfo = async () => {
    let res = await reqAddOrUpdateUser(userParams.value);
    if (res.code === 200) {
        ElMessage.success(res.message);
        userDrawer.value = false;
        userRoleDrawer.value = false;
        getHasUser();
    } else {
        ElMessage.error(`${res.message} ${res.code}`);
    }
};
const save = () => {
    useFormRef.value?.validate().then(
        saveUserInfo
    ).catch (() => {
        ElMessage.error('请您检查表单信息');
    });
};
const cancel = () => {
    userDrawer.value = false;
    userRoleDrawer.value = false;
};
//分页器
const pageChange = (val: number) => {
    getHasUser();
};
const sizeChange = (val: number) => {
    getHasUser();
};
//校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 5) {
        callBack();
    } else {
        callBack(new Error('用户名字至少五位'))
    }
}
//校验用户名字回调函数
const validatorname = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 5) {
        callBack();
    } else {
        callBack(new Error('用户昵称至少五位'))
    }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位 包含数字和字母
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
    if (reg.test(value.trim())) {
        callBack();
    } else {
        callBack(new Error('用户密码至少六位，必须包含数字和字母'))
    }
}
//表单校验的规则对象
const rules = {
    //用户名字
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    //用户昵称
    name: [{ required: true, trigger: 'blur', validator: validatorname }],
    //用户的密码
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
onMounted(() => {
    getHasUser();
});
</script>

<style scoped lang="scss">
.el-card {
    margin-bottom: 20px;

    .el-form-item {
        margin-bottom: 0;
    }
}
</style>