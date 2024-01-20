/// <reference types="vite/client" />

/// <reference types="element-plus/global" />

// 识别.vue文件
declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// 定义import.meta.env类型
interface ImportMetaEnv {
    readonly VITE_APP_BASE_API: string,
    readonly VITE_APP_TITLE: string,
    readonly NODE_ENV: string,
}

// nprogress 类型
declare module "nprogress" {
    interface NProgressOptions {
        minimum: number;
        template: string;
        easing: string;
        speed: number;
        trickle: boolean;
        trickleSpeed: number;
        showSpinner: boolean;
        parent: string;
        positionUsing: string;
        barSelector: string;
        spinnerSelector: string;
    }

    interface NProgress {
        version: string;
        settings: NProgressOptions;
        status: number | null;

        configure(options: Partial<NProgressOptions>): NProgress;
        set(number: number): NProgress;
        isStarted(): boolean;
        start(): NProgress;
        done(force?: boolean): NProgress;
        inc(amount?: number): NProgress;
        trickle(): NProgress;

        /* Internal */

        render(fromStart?: boolean): HTMLDivElement;
        remove(): void;
        isRendered(): boolean;
        getPositioningCSS(): "translate3d" | "translate" | "margin";
    }
    const nprogress: NProgress;
    export default nprogress;
}