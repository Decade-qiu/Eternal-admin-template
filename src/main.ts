import { createApp } from "vue";
import App from "@/App.vue";
// 引入pinia
import pinia from "@/store";
// elm组件
import 'element-plus/dist/index.css';
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// svg图标服务
import 'virtual:svg-icons-register';
// 常用的组件 进行全局注册
import globalComponents from "@/components";
// 引入全局样式
import "@/styles/index.scss";
// 引入路由
import router from "@/router";

const app = createApp(App);

// use里面的组件 必须包含install方法
app.use(globalComponents);
app.use(router);
app.use(pinia);
app.mount('#app');