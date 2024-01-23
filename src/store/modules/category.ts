//商品分类全局组件的小仓库
import { defineStore } from 'pinia';
import { reqC1, reqC2, reqC3 } from '@/api/product/attr';
import { CategoryResponseData, CategoryObj } from '@/api/product/attr/type';
import { ref } from 'vue';
const useCategoryStore = defineStore('Category', () => {
    let c1Arr = ref<CategoryObj[]>();
    let c1Id = ref<number|string>('');
    const getC1 = async () => {
        const res = await reqC1();
        c1Arr.value = res.data;
    };
    let c2Arr = ref<CategoryObj[]>();
    let c2Id = ref<number|string>('');
    const getC2 = async () => {
        const res = await reqC2(c1Id.value);
        c2Arr.value = res.data;
    };
    let c3Arr = ref<CategoryObj[]>();
    let c3Id = ref<number|string>('');
    const getC3 = async () => {
        const res = await reqC3(c2Id.value);
        c3Arr.value = res.data;
    };
    return {
        c1Arr,c1Id,getC1,
        c2Arr,c2Id,getC2,
        c3Arr,c3Id,getC3
    };
})

export default useCategoryStore;