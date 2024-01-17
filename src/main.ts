import { createApp } from "vue";
import App from "@/App.vue";
// elm组件
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
// svg图标服务
import 'virtual:svg-icons-register';
// 常用的组件 进行全局注册
import globalComponents from "@/components";
// 引入全局样式
import "@/styles/index.scss";
// 引入路由
import router from "@/router";
// 引入pinia
import pinia from "@/store";

const app = createApp(App);

// use里面的组件 必须包含install方法
app.use(globalComponents);
app.use(ElementPlus, {
    locale: zhCn
})
app.use(router);
app.use(pinia);
app.mount('#app');
