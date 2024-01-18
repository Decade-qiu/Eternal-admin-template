<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider" :class="{fold:layoutStore.fold}">
            <Logo />
            <!-- 菜单组件 -->
            <el-scrollbar class="scrollbar">
                <!-- 菜单组件 -->
                <el-menu :default-active="route.path" background-color="#001529" text-color="white" :collapse="layoutStore.fold">
                    <!-- 根据路由动态生成菜单 -->
                    <Menu :menuList="userStore.menuRouters"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar" :class="{fold:layoutStore.fold}">
            <Tabbar></Tabbar>
        </div>
        <!-- 内容展示区域 -->
        <div class="layout_main" :class="{fold:layoutStore.fold}">
            <Main></Main>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Logo from '@/layout/logo/index.vue';
import Menu from '@/layout/menu/index.vue';
import useUserStore from '@/store/modules/user';
import Main from '@/layout/main/index.vue';
import Tabbar from '@/layout/tabbar/index.vue';
import useLayoutStore from '@/store/modules/layout';
import { useRoute } from 'vue-router';
const userStore = useUserStore();
const layoutStore = useLayoutStore();
const route = useRoute();
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;
    position: relative;

    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        background-color: $base-menu-background;
        transition: all 0.3s;
        .scrollbar {
            height: calc(100vh - $base-menu-logo-height);
            margin-left: 6px;
            .el-menu {
                border-right: none;
            }
        }
        &.fold {
            width: $base-menu-fold-width;
        }
    }

    .layout_tabbar {
        position: fixed;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        background-color: $base-tabbar-background;
        top: 0px;
        left: $base-menu-width;
        transition: all 0.3s;
        &.fold {
            width: calc(100% - $base-menu-fold-width);
            left: $base-menu-fold-width;
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        background-color: $base-content-background;
        left: $base-menu-width;
        top: $base-tabbar-height;
        padding: 20px;
        overflow: auto;
        transition: all 0.3s;
        &.fold {
            width: calc(100% - $base-menu-fold-width);
            left: $base-menu-fold-width;
        }
    }
}
</style>