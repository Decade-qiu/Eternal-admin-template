<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <!-- 顶部左侧的图标 -->
            <el-icon @click="changeIcon">
                <component :is="layoutStore.fold ? 'Fold' : 'Expand' "></component>
            </el-icon>
            <!-- 左侧的面包屑 -->
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="item in route.matched" :key="item.path" v-show="item.meta.title" :to="item.path">
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tabbar_right">
            <el-button class="button" size="small" icon="Refresh" circle @click="updateMain"></el-button>
            <el-button class="button" size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
            <el-popover placement="bottom" title="主题设置" :width="300" trigger="click">
                <el-form>
                    <el-form-item label="主题颜色">
                        <el-color-picker @change="setColor" v-model="color" size="small" show-alpha
                            :predefine="predefineColors" :teleported="false"/>
                    </el-form-item>
                    <el-form-item label="暗黑模式">
                        <el-switch @change="changeDark" v-model="dark" class="mt-2" style="margin-left: 24px" inline-prompt
                            active-icon="MoonNight" inactive-icon="Sunny" />
                    </el-form-item>
                </el-form>
                <template #reference>
                    <el-button size="small" icon="Setting" circle></el-button>
                </template>
            </el-popover>
            <img :src="userStore.data.avatar" />
            <!-- 下拉菜单 -->
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{ userStore.data.name }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出登陆</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang='ts'>
import useLayoutStore from '@/store/modules/layout';
import useUserStore from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from 'vue';
const userStore = useUserStore();
const layoutStore = useLayoutStore();
const route = useRoute();
const router = useRouter();
let color = ref('#409EFF');
const setColor = () => {
    const html = document.documentElement;
    html.style.setProperty('--el-color-primary', color.value);
    localStorage.setItem('color', color.value);
};
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
]);
let dark = ref(false);
const changeDark = () => {
    const html = document.documentElement;
    localStorage.setItem('dark', dark.value+'');
    if (dark.value) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
};
const changeIcon = () => {
    layoutStore.changeFold();
};
const updateMain = () => {
    layoutStore.changeRefresh();
};
const fullScreen = () => {
    let full = document.fullscreenElement;
    //切换成全屏
    if (!full) {
        //文档根节点的方法requestFullscreen实现全屏
        document.documentElement.requestFullscreen();
    } else {
        //退出全屏
        document.exitFullscreen();
    }
};
const logout = () => {
    // 清除用户相关数据
    userStore.logout()
        .then(() => {
            // 跳转登陆
            ElMessage.success('退出成功');
            router.push({ path: '/login', query: { redirect: route.path } });
        })
        .catch((error) => {
            ElMessage.error(error.message);
        });
};
onMounted(() => {
    dark.value = (localStorage.getItem('dark') === 'true');
    color.value = localStorage.getItem('color') || '#409EFF';
    setColor();
    changeDark();
});
</script>

<style scoped lang="scss">
.tabbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 20px;

    .tabbar_left {
        display: flex;
        align-items: center;

        .el-breadcrumb {
            transition: all 0.2s;
        }

        .el-icon {
            margin-right: 10px;
        }
    }

    .tabbar_right {
        display: flex;
        align-items: center;

        .button {
            margin-left: 10px;
            margin-right: 10px;
        }

        img {
            width: 30px;
            height: 30px;
            margin-left: 20px;
            margin-right: 20px;
        }
    }
}
</style>