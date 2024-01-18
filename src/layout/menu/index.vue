<template>
    <template v-for="(item, index) in menuList" :key="item.path">
        <!--没有子路由-->
        <template v-if="!item.children">
            <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
        <!-- 有子路由但是只有一个子路由 -->
        <template v-if="item.children && item.children.length == 1">
            <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden" @click="goRoute">
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
        <!-- 有子路由且个数大于2 -->
        <el-sub-menu :index="item.path" v-if="item.children && item.children.length >= 2">
            <template #title>
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <Menu :menuList="item.children"></Menu>
        </el-sub-menu>
    </template>
</template>
  
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { MenuItemRegistered } from "element-plus";
import { constantRouteType } from '@/router/router';
//获取父组件传递过来的全部路由数组
const _ = defineProps<{
    menuList: constantRouteType;
}>()
// console.log(_.menuList);
//获取路由器对象
let $router = useRouter();
//点击菜单的回调
const goRoute = (vc: MenuItemRegistered) => {
    //路由跳转
    // console.log(vc);
    $router.push(vc.index);
};
</script>
<script lang="ts">
export default {
    name: 'Menu',
}
</script>
  
<style scoped></style>
  