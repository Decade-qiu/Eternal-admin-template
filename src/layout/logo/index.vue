<template>
    <div class="logo" v-if="setting.logoHidden">
        <img :src="setting.logo" alt="" />
        <p>{{ setting.title }}</p>
    </div>
</template>
  
<script setup lang="ts">
//引入设置标题与logo配置文件
import setting from '@/setting'
</script>
  
<style lang="scss" scoped>
.logo {
    width: 100%;
    height: $base-menu-logo-height;
    color: white;
    display: flex;
    align-items: center;
    padding: 20px;

    img {
        width: 40px;
        height: 40px;
    }

    p {
        font-size: $base-logo-title-fontSize;
        margin-left: 20px;
        white-space: nowrap;
    }
}
</style>