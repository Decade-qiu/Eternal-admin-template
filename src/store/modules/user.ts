//创建用户相关的小仓库 
import { defineStore } from 'pinia';
//引入登陆接口
import { reqLogin, reqUserInfo } from '@/api/user';
//引入数据类型
import { loginForm, userType, errorMsg } from '@/api/user/type';
//引入常量路由
// import { RouteRecordRaw } from 'vue-router';
import { constantRoute } from '@/router/router';
import {Ref, ref, computed} from 'vue'; 
//创建用户小仓库 
const useUserStore = defineStore('User', () => {
    const token = ref<string>("");
    const data = ref<userType | {}>({});
    async function login(data: loginForm): Promise<string> {
        const res = await reqLogin(data);
        if (res.code == 200) {
            token.value = (res.data as userType).token as string;
            //由于pinia|vuex存储数据其实利用js对象 
            //需要本地存储持久化存储一份
            localStorage.setItem('TOKEN', token.value);
            return Promise.resolve('ok');
        } else {
            return Promise.reject(new Error(`登陆失败：${res.code}`))
        }
    }
    async function userInfo() {
        const res = await reqUserInfo();
        if (res.code == 200) {
            data.value = res.data;
            return Promise.resolve(data as Ref<userType>);
        } else {
            return Promise.reject(new Error((res.data as errorMsg).message));
        }
    }
    function logout() {
        localStorage.removeItem('TOKEN');
        token.value = '';
        data.value = {};
    }
    const  _getToken = computed(() => {
        token.value = localStorage.getItem('TOKEN') || '';
        return token.value;
    });
    return {
        login,
        token: _getToken,
        constantRoute,
        userInfo,
        data: data as Ref<userType>,
        logout,
    };
})
//对外暴露小仓库 
export default useUserStore 