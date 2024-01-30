<template>
    <el-card>
        <el-form inline>
            <el-row justify="space-between">
                <el-form-item label="职位名称：">
                    <el-input placeholder="请输入搜索的职位" v-model="keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="keyword == ''" @click="searchRole">搜索</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" size="default" @click="addRole">添加职位</el-button>
        <!-- table展示用户信息 -->
        <el-table style="margin: 10px 0px;" border :data="roleArr" ref="roleTableRef">
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="职位名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template v-slot="{ row, $index }">
                    <el-button type="warning" size="small" icon="user" @click="setRole(row)">分配权限</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.rolename}?`" width="260px" @confirm="deleteRole(row.id)">
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
    <el-drawer v-model="roleDrawer">
        <template #header>
            <h4>{{ roleParams.id ? '更新职位名称' : '添加职位名称' }}</h4>
        </template>
        <template #default>
            <el-form :model="roleParams" :rules="rules" ref="roleFormRef">
                <el-form-item label="用户姓名" prop="roleName">
                    <el-input placeholder="请您输入用户姓名" v-model="roleParams.roleName"></el-input>
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
    <el-drawer v-model="roleAclDrawer">
        <template #header>
            <h4>分配菜单与按钮的权限</h4>
        </template>
        <template #default>
            <el-tree ref="roleAclTreeRef" :data="roleAclParams" show-checkbox default-expand-all node-key="id"
                highlight-current :props="defaultProps" :default-checked-keys="roleHasAcl" />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelAcl">取消</el-button>
                <el-button type="primary" @click="saveAcl">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang='ts'>
import { ref, onMounted, nextTick, computed } from 'vue';
import { reqRemoveRole, reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion } from '@/api/acl/role';
import type { RoleResponseData, Records, RoleData, MenuResponseData, MunuData } from '@/api/acl/role/type'
import { ElMessage, ElForm, ElTable, ElTree } from 'element-plus';
let pageNo = ref(1);
let pageSize = ref(5);
let total = ref(0);
let keyword = ref<string>('');
let roleArr = ref<RoleData[]>([]);
let roleDrawer = ref<boolean>(false);
let roleParams = ref<RoleData>({
    roleName: '',
});
let roleFormRef = ref<InstanceType<typeof ElForm>>();
let roleAclDrawer = ref<boolean>(false);
let roleAclParams = ref<MunuData[]>();
let roleAclTreeRef = ref<InstanceType<typeof ElTree>>();
const getCheckedKeys = (data: MunuData[]):number[] => {
    let arr: number[] = [];
    data.forEach((item) => {
        if (item.children && item.children.length > 0) {
            arr.push(...getCheckedKeys(item.children));
        }else{
            if (item.select) arr.push(item.id!);
        }
    });
    return arr;
};
let roleHasAcl = computed(() => {
    return getCheckedKeys(roleAclParams.value!);
});
const defaultProps = {
    children: 'children',
    label: 'name',
};
const getHasRole = async () => {
    let res = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value);
    if (res.code === 200) {
        roleArr.value = res.data.records;
        total.value = res.data.total;
    } else {
        ElMessage.error(res.message);
    }
};
//分配权限
const setRole = async (row: RoleData) => {
    let acl = await reqAllMenuList(row.id!);
    roleParams.value = row;
    roleAclParams.value = acl.data;
    roleAclDrawer.value = true;
    console.log(roleHasAcl.value);
};
const cancelAcl = () => {
    roleAclDrawer.value = false;
};
const saveAcl = async () => {
    roleAclDrawer.value = false;
    let checkedKeys = roleAclTreeRef.value?.getCheckedKeys();
    let halfCheckedKeys = roleAclTreeRef.value?.getHalfCheckedKeys();
    let allCheckedKeys = [...checkedKeys!, ...halfCheckedKeys!].map((item) => Number(item));
    let res = await reqSetPermisstion(roleParams.value.id!, allCheckedKeys);
    if (res.code === 200) {
        ElMessage.success(res.message);
        getHasRole();
    } else {
        ElMessage.error(res.message);
    }
};
//修改职位
const updateRole = async (row: RoleData) => {
    roleParams.value = row;
    roleFormRef.value?.clearValidate('roleName');
    roleDrawer.value = true;
};
//添加职位
const addRole = () => {
    roleParams.value = {
        roleName: '',
    };
    roleFormRef.value?.clearValidate('roleName');
    roleDrawer.value = true;
};
const cancel = () => {
    roleDrawer.value = false;
};
const saveRoleInfo = async () => {
    let res = await reqAddOrUpdateRole(roleParams.value);
    if (res.code === 200) {
        ElMessage.success(res.message);
        roleDrawer.value = false;
        getHasRole();
    } else {
        ElMessage.error(res.message);
    }
};
const save = () => {
    roleFormRef.value?.validate().then(
        () => {
            saveRoleInfo();
        },
        () => {
            ElMessage.error('请检查输入的内容');
        }
    );
};
//删除职位
const deleteRole = async (id: number) => {
    let res = await reqRemoveRole(id);
    if (res.code === 200) {
        ElMessage.success(res.message);
        getHasRole();
    } else {
        ElMessage.error(res.message);
    }
};
//搜索
const searchRole = () => {
    pageNo.value = 1;
    getHasRole();
};
const reset = () => {
    keyword.value = '';
    pageNo.value = 1;
    pageSize.value = 5;
    getHasRole();
};
//分页器
const pageChange = (val: number) => {
    getHasRole();
};
const sizeChange = (val: number) => {
    getHasRole();
};
//表单验证
const rules = {
    roleName: [
        { required: true, message: '请输入职位名称', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
    ],
};
onMounted(() => {
    getHasRole();
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