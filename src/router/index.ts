// vue-router的使用
import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoute } from './router';
//创建路由器
const router = createRouter({
    //路由模式hash
    history: createWebHashHistory(),
    routes: constantRoute,
    //滚动行为
    scrollBehavior() {
        return {
            left: 0,
            top: 0,
        }
    },
});

//路由鉴权：鉴权：项目当中路由能不能被访问的权限
import nprogress from 'nprogress';
//引入进度条样式
import 'nprogress/nprogress.css';
//获取用户相关的小仓库内部token数据，去判断用户是否登陆成功
import useUserStore from '@/store/modules/user';
import pinia from '@/store';
const userStore = useUserStore(pinia);
nprogress.configure({ showSpinner: false });
//全局前置守卫
router.beforeEach(async (to, from, next) => {
    //访问某一个路由之前的守卫
    nprogress.start();
    const token = userStore.token;
    // console.log(token);
    if (token) {
        if (to.path == '/login') {
            next(from);
        } else {
            try {
                //获取用户信息
                await userStore.userInfo();
                next()
            } catch (error) {
                //token过期|用户手动处理token
                //退出登陆->用户相关的数据清空
                await userStore.logout();
                next({ path: '/login', query: { redirect: to.path } });
            }
        }
    } else {
        //如果没有token，就去登陆
        next();
    }
})

//全局后置守卫
router.afterEach((to: any, from: any) => {
    // to and from are both route objects.
    nprogress.done();
})

//第一个问题：任意路由切换实现进度条业务 ----nprogress

export default router;