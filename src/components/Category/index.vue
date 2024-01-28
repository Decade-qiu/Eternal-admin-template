<template>
    <el-card>
        <el-form inline>
            <el-form-item label="一级分类">
                <!-- change:选中值发生变化时触发 -->
                <el-select :disabled="scene" v-model="categoryStore.c1Id" placeholder="Select" @change="handler"
                    style="width: 200px">
                    <!-- label:即为展示数据 value:即为select下拉菜单收集的数据 -->
                    <el-option v-for="(c1, index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name"
                        :value="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <!-- change:选中值发生变化时触发 -->
                <el-select v-model="categoryStore.c2Id" placeholder="Select" @change="handler1" style="width: 200px">
                    <!-- label:即为展示数据 value:即为select下拉菜单收集的数据 -->
                    <el-option v-for="(c2, index) in categoryStore.c2Arr" :key="c2.id" :label="c2.name"
                        :value="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <!-- change:选中值发生变化时触发 -->
                <el-select v-model="categoryStore.c3Id" placeholder="Select" style="width: 200px">
                    <!-- label:即为展示数据 value:即为select下拉菜单收集的数据 -->
                    <el-option v-for="(c3, index) in categoryStore.c3Arr" :key="c3.id" :label="c3.name"
                        :value="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang='ts'>
//引入组件挂载完毕方法
import { onMounted, watch } from 'vue'
//引入分类相关的仓库
import useCategoryStore from '@/store/modules/category';
let categoryStore = useCategoryStore();
//分类全局组件挂载完毕,通知仓库发请求获取一级分类的数据
onMounted(async () => {
    getC1();
    watch(() => categoryStore.c1Arr, (newC1Arr) => {
        if (newC1Arr && newC1Arr.length > 0) {
            categoryStore.c1Id = newC1Arr[0].id;
            categoryStore.getC2();
            watch(() => categoryStore.c2Arr, async (newC2Arr) => {
                if (newC2Arr && newC2Arr.length > 0) {
                    categoryStore.c2Id = newC2Arr[0].id;
                    // 异步获取C3数据
                    categoryStore.getC3();
                    watch(() => categoryStore.c3Arr, (newC3Arr) => {
                        if (newC3Arr && newC3Arr.length > 0) {
                            categoryStore.c3Id = newC3Arr[0].id;
                        }
                    }, { once: true });
                }
            }, { once: true });
        }
    }, { once: true });
});
//通知仓库获取一级分类的方法
const getC1 = () => {
    //通知分类仓库发请求获取一级分类的数据
    categoryStore.getC1();
};
//此方法即为一级分类下拉菜单的change事件(选中值的时候会触发,保证一级分类ID有了)
const handler = () => {
    //通知仓库获取二级分类的数据
    categoryStore.c2Id = '';
    categoryStore.c3Arr = [];
    categoryStore.c3Id = '';
    categoryStore.getC2();
};
const handler1 = () => {
    //通知仓库获取三级分类的数据
    categoryStore.c3Id = '';
    categoryStore.getC3();
};
defineProps<{
    scene: boolean;
}>();
</script>

<style scoped lang="scss"></style>