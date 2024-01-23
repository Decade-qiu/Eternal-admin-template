// 二次封装axios：使用请求与响应拦截器
import axios from "axios";
import { ElMessage } from "element-plus";
import useUserStore from '@/store/modules/user';
// 创建axios实例 配置一些基础项
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000,
});
// 请求拦截器
request.interceptors.request.use((config) => {
    // config配置对象
    // headers属性请求头对象
    // console.log(config);
    const userStore = useUserStore();
    if (userStore.token) {
        config.headers.token = userStore.token;
    }
    return config;
});
// 响应拦截器
request.interceptors.response.use((response) => {
    // 成功获取到数据 可以对数据进行处理
    // console.log(response);
    return response.data;
}, (error) => {
    // 响应失败 处理网络错误的
    console.log(error);
    let msg = error.message || "未知错误";
    ElMessage({
        type: 'error',
        message: `${msg} ${error.code}`
    });
    return Promise.reject(error);
});

export default request;