//创建用户相关的小仓库 
import { defineStore } from 'pinia';
//引入登陆接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';
//引入数据类型
import { loginFormData, userInfoReponseData } from '@/api/user/type';
//引入常量路由
import { constantRoute, asnycRoute, anyRoute } from '@/router/router';
import { Ref, ref, computed } from 'vue';
//@ts-expect-error
import cloneDeep from 'lodash/cloneDeep';
//创建用户小仓库 
const filterRouter = (asnycRoute: any[], routes: string[]) => {
    return asnycRoute.filter((route) => {
        if (routes.includes(route.name)) {
            if (route.children) {
                route.children = filterRouter(route.children, routes);
            }
            return true;
        }
    })
};
const useUserStore = defineStore('User', () => {
    const token = ref<string>("");
    const data = ref<userInfoReponseData['data'] | {}>({});
    const menuRouter = ref<any[]>([...constantRoute, ...anyRoute]);
    const buttons = ref<string[]>([]);
    async function login(data: loginFormData): Promise<string> {
        const res = await reqLogin(data);
        if (res.code == 200) {
            token.value = res.data;
            //由于pinia|vuex存储数据其实利用js对象 
            //需要本地存储持久化存储一份
            localStorage.setItem('TOKEN', token.value);
            return Promise.resolve('ok');
        } else {
            return Promise.reject(new Error(`登陆失败：${res.data}`))
        }
    }
    async function userInfo() {
        const res = await reqUserInfo();
        if (res.code == 200) {
            data.value = res.data;
            menuRouter.value = [...constantRoute, ...anyRoute];
            menuRouter.value.push(...filterRouter(cloneDeep(asnycRoute), res.data.routes));
            buttons.value = res.data.buttons;
            return Promise.resolve(data);
        } else {
            return Promise.reject(new Error(res.message));
        }
    }
    async function logout() {
        let res = await reqLogout();
        if (res.code == 200) {
            localStorage.removeItem('TOKEN');
            token.value = '';
            data.value = {};
            return Promise.resolve('ok');
        } else {
            return Promise.reject(new Error(res.message));
        }
    }
    const _getToken = computed(() => {
        token.value = localStorage.getItem('TOKEN') || '';
        return token.value;
    });
    return {
        login,
        token: _getToken,
        menuRouter,
        buttons,
        userInfo,
        data: data as Ref<userInfoReponseData['data']>,
        logout,
    };
})
//对外暴露小仓库 
export default useUserStore 