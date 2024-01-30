<template>
    <el-card>
        <el-form inline>
            <el-row justify="space-between">
                <el-form-item label="用户名：">
                    <el-input placeholder="请输入搜索的用户名" v-model="keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="keyword==''" @click="searchUser">搜索</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
        <el-button type="primary" size="default" :disabled="selectIdArr.length ? false : true"
            @click="deleteSelectUser">批量删除</el-button>
        <!-- table展示用户信息 -->
        <el-table @selection-change="selectChange" style="margin: 10px 0px;" border :data="userArr">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <!-- <template v-slot="{ row, $index }">
                    <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template> -->
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="pageChange"
            @size-change="sizeChange" />
    </el-card>
</template>

<script setup lang='ts'>
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqSelectUser, reqRemoveUser, reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole } from '@/api/acl/user';
import type { SetRoleData, UserResponseData, Records, User, AllRoleResponseData, AllRole } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
let pageNo = ref(1);
let pageSize = ref(5);
let total = ref(0);
let userArr = ref<User[]>([]);
let selectIdArr = ref([]);
let keyword = ref<string>('');
const getHasUser = async () => {
    let res = await reqUserInfo(pageNo.value, pageSize.value, keyword.value);
    if (res.code === 200) {
        userArr.value = res.data.records;
        total.value = res.data.total;
    }else{
        ElMessage.error(res.message);
    }
};
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
const selectChange = () => {
    console.log("选择用户");
};
const deleteSelectUser = () => {
    console.log("删除用户");
};
const addUser = () => {
    console.log("添加用户");
};
const pageChange = (val: number) => {
    getHasUser();
};
const sizeChange = (val: number) => {
    getHasUser();
};
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