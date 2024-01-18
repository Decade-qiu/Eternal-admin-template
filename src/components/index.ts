import { App, Component } from 'vue';
import svgIcon from './SvgIcon/index.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { plugins, components } from '@/components/ElementPlus/index.ts'
type GlobalComponents = {
    [key: string]: Component
}
const allGlobalComponents: GlobalComponents = { svgIcon }
// 对外暴露插件对象
export default {
    install(app: App) {
        Object.keys(allGlobalComponents).forEach(key => {
            app.component(key, allGlobalComponents[key]);
        });
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component);
        }
        plugins.forEach(plugin => {
            app.use(plugin);
        });
        components.forEach(component => {
            app.use(component);
        });
    }
}