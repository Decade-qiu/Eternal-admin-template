<template>
    <el-card>
        <el-table :data="permisstionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="权限值" prop="code"></el-table-column>
            <el-table-column label="修改时间" prop="updateTime"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="{ row, $index }">
                    <el-button type="primary" @click="addPermisstion(row)" size="small"
                        :disabled="row.level == 4 ? true : false">{{
                            row.level == 3 ? '添加功能'
                            : '添加菜单' }}</el-button>
                    <el-button type="info" @click="updatePermisstion(row)" size="small"
                        :disabled="row.level == 1 ? true : false">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.name}?`" width="260px" @confirm="removeMenu(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small" :disabled="row.level !== 1 ? true : false">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
        <!-- 表单组件:收集新增与已有的菜单的数据 -->
        <el-form>
            <el-form-item label="名称">
                <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
            </el-form-item>
            <el-form-item label="权限">
                <el-input placeholder="请你输入权限数值" v-model="menuData.code"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, onMounted } from "vue";
//引入获取菜单请求API
import { reqAllPermisstion, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/permission';
//引入ts类型
import type { MenuParams, PermisstionResponseData, PermisstionList, Permisstion } from '@/api/acl/permission/type';
import { ElMessage } from "element-plus";
let permisstionArr = ref<Permisstion[]>([]);
let dialogVisible = ref<boolean>(false);
let menuData = ref<MenuParams>({
    name: '',
    code: '',
    level: 0,
    pid: 0,
});
const getHasPermisstion = async () => {
    const res = await reqAllPermisstion();
    if (res.code === 200) {
        permisstionArr.value = res.data;
    } else {
        ElMessage.error(res.message+' '+res.data+' '+res.code);
    }
}
//添加权限
const save = async () => {
    const res = await reqAddOrUpdateMenu(menuData.value);
    if (res.code === 200) {
        ElMessage.success(res.message);
        getHasPermisstion();
        dialogVisible.value = false;
    } else {
        ElMessage.error(res.message+' '+res.data+' '+res.code);
    }
}
const addPermisstion = (row: Permisstion) => {
    menuData.value = {
        name: '',
        code: '',
        level: row.level + 1,
        pid: row.id!,
    };
    dialogVisible.value = true;
}
//修改权限
const updatePermisstion = (row: Permisstion) => {
    menuData.value = {
        id: row.id,
        name: row.name,
        code: row.code,
        level: row.level,
        pid: row.pid,
    };
    dialogVisible.value = true;
}
//删除菜单
const removeMenu = async (id: number) => {
    const res = await reqRemoveMenu(id);
    if (res.code === 200) {
        ElMessage.success(res.message);
        getHasPermisstion();
    } else {
        ElMessage.error(res.message+' '+res.data+' '+res.code);
    }
}
onMounted(() => {
    getHasPermisstion();
})
</script>

<style scoped lang="scss"></style>