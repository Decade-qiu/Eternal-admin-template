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
</template>

<script setup lang='ts'>

</script>

<style scoped lang="scss">

</style>