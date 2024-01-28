<template>
    <el-form label-width="80px">
        <el-form-item label="SKU名称">
            <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input placeholder="重量(g)" type="number" v-model="skuParams.weight"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="default" @click="save">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang='ts'>
import { reqAttr } from '@/api/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu';
import type { SkuData, SpuData } from '@/api/product/spu/type'
import { changeSceneType } from './spuForm.vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
//父子组件通信
let $emit = defineEmits<{
    (e: 'changeScene', args: changeSceneType): void
}>();
let props = defineProps<{
    operator: string,
}>();
//平台属性
let attrArr = ref<any>([]);
//销售属性
let saleArr = ref<any>([]);
//照片的数据
let imgArr = ref<any>([]);
//获取table组件实例
let table = ref<any>();
//收集SKU的参数
let skuParams = ref<SkuData>({
    //父组件传递过来的数据
    category3Id: "",//三级分类的ID
    spuId: "",//已有的SPU的ID
    tmId: "",//SPU品牌的ID
    //v-model收集
    skuName: "",//sku名字
    price: "",//sku价格
    weight: "",//sku重量
    skuDesc: "",//sku的描述
    skuAttrValueList: [//平台属性的收集
    ],
    skuSaleAttrValueList: [//销售属性
    ],
    skuDefaultImg: '', //sku图片地址
});
//初始化
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: SpuData) => {
    //收集数据
    skuParams.value.category3Id = spu.category3Id;
    skuParams.value.spuId = spu.id!;
    skuParams.value.tmId = spu.tmId;
    //获取平台属性
    let result = await reqAttr(c1Id, c2Id, spu.category3Id);
    //获取对应的销售属性
    let result1 = await reqSpuHasSaleAttr(spu.id!);
    //获取照片墙的数据
    let result2 = await reqSpuImageList(spu.id!);
    //平台属性
    attrArr.value = result.data;
    //销售属性
    saleArr.value = result1.data;
    //图片
    imgArr.value = result2.data;
}
//点击取消按钮:通知父组件切换场景为1,展示有的SPU的数据
const cancel = () => {
    $emit('changeScene', { flag: 0, params: props.operator });
};
//保存
const save = () => {};
//暴露方法
defineExpose({
    initSkuData
});
</script>

<style scoped lang="scss"></style>