<template>
    <div></div>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue'
import { ElNotification } from 'element-plus';
import useUserStore from '@/store/modules/user'
const userStore = useUserStore();
onMounted(() => {
    userStore.userInfo()
        .then((res) => {
            // console.log(res.value.avatar);
        })
        .catch((error) => {
            ElNotification({
                type: 'error',
                message: error.message,
            });
        });
});
</script>

<style scoped lang="scss"></style>