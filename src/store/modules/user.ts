//创建用户相关的小仓库 
import { defineStore } from 'pinia';
//引入登陆接口
import { reqLogin } from '@/api/user';
//引入数据类型
import { loginForm } from '@/api/user/type';
//引入常量路由
import { constantRoute } from '@/router/router';
//创建用户小仓库 
const useUserStore = defineStore('User', () => { 
    let token = ''; 
    async function login(data: loginForm): Promise<string> {
        const res = await reqLogin(data);
        if (res.code == 200){
            token = res.data.token as string;
            //由于pinia|vuex存储数据其实利用js对象 
            //需要本地存储持久化存储一份
            localStorage.setItem('TOKEN', token);
            return Promise.resolve('ok');
        }else{
            return Promise.reject(new Error(`登陆失败：${res.code}`))
        }
    }
    return {
        login, 
        token: localStorage.getItem('TOKEN') ?? '',
        menuRouters: constantRoute,
    };
}) 
//对外暴露小仓库 
export default useUserStore 