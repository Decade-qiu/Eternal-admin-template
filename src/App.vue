<template>
    <div class="main">test</div>
</template>
  
<script setup lang="ts">
import { onMounted } from 'vue'
import { reqLogin } from '@/api/user'
onMounted(() => {
    reqLogin({
        username: 'admin',
        password: '111111',
    }).then(res => {
        console.log(res)
    })
});
</script>

<style scoped lang="scss"> .main {
     color: $color;
     font-size: 200px;
 }
</style>
