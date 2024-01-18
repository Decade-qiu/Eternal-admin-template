<template>
    <!-- 路由组件出口的位置 -->
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <!-- 渲染layout一级路由的子路由 -->
            <component :is="Component" v-if="flag"/>
        </transition>
    </router-view>
</template>
  
<script setup lang="ts">
import useLayoutStore from '@/store/modules/layout';
import { watch, ref, nextTick } from 'vue';
const layoutStore = useLayoutStore();
//控制当前组件是否销毁重建
let flag = ref(true)
//监听仓库内部的数据是否发生变化，如果发生变化，说明用户点击过刷新按钮
watch(
  () => layoutStore.refresh,
  () => {
    flag.value = false;
    // 数据改动，重新渲染DOM（比如上面会让当前路由组件销毁）
    // nextTick在下一次DOM更新结束之后执行延迟回调
    nextTick(() => {
      flag.value = true;
    })
  },
)
</script>
  
<style lang="scss" scoped>
.fade-enter-from {
    opacity: 0;
}

.fade-enter-active {
    transition: all 0.3s;
}

.fade-enter-to {
    opacity: 1;
}
</style>