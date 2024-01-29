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
        <el-form-item label="平台属性">
            <el-form :inline="true" label-width="80px">
                <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName" style="margin-bottom: 10px;">
                    <el-select v-model="selectAttr[index]" style="width: 100px">
                        <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.attrValueList"
                            :key="attrValue.id" :label="attrValue.valueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true" label-width="50px">
                <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName" style="margin-bottom: 10px;">
                    <el-select v-model="selectSaleAttr[index]" style="width: 200px">
                        <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.spuSaleAttrValueList"
                            :key="attrValue.id" :label="attrValue.saleAttrValueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
            <el-table border :data="imgArr" ref="table">
                <el-table-column type="selection" width="80px" align="center"></el-table-column>
                <el-table-column label="图片">
                    <template v-slot="{ row, $index }">
                        <img :src="row.imgUrl" alt="" style="width:100px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="{ row, $index }">
                        <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
import type { SkuData, SpuData, SaleAttr, SpuImg } from '@/api/product/spu/type';
import type { Attr } from '@/api/product/attr/type';
import { changeSceneType } from './spuForm.vue';
import { ElMessage, ElTable } from 'element-plus';
import { ref } from 'vue';
//父子组件通信
let $emit = defineEmits<{
    (e: 'changeScene', args: changeSceneType): void
}>();
let props = defineProps<{
    operator: string,
}>();
//平台属性
let attrArr = ref<Attr[]>([]);
let selectAttr = ref<string[]>([]);
//销售属性
let saleArr = ref<SaleAttr[]>([]);
let selectSaleAttr = ref<string[]>([]);
//照片的数据
let imgArr = ref<SpuImg[]>([]);
//获取table组件实例
let table = ref<InstanceType<typeof ElTable>>();
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
    selectAttr.value = result.data.map(item => `${item.id}:${item.attrValueList[0].id}`);
    //销售属性
    saleArr.value = result1.data;
    selectSaleAttr.value = result1.data.map(item => `${item.id}:${item.spuSaleAttrValueList[0].id}`);
    //图片
    imgArr.value = result2.data;
}
//图片选择
const handler = (row:SpuImg) => {
    table.value?.clearSelection();
    table.value?.toggleRowSelection(row, true);
    skuParams.value.skuDefaultImg = row.imgUrl!;
};
//点击取消按钮:通知父组件切换场景为1,展示有的SPU的数据
const cancel = () => {
    $emit('changeScene', { flag: 0, params: props.operator });
};
//保存
const save = async () => {
    skuParams.value.skuAttrValueList = selectAttr.value.map(item => {
        let arr = item.split(':');
        return {
            attrId: arr[0],
            valueId: arr[1]
        }
    });
    skuParams.value.skuSaleAttrValueList = selectSaleAttr.value.map(item => {
        let arr = item.split(':');
        return {
            saleAttrId: arr[0],
            saleAttrValueId: arr[1]
        }
    });
    let result = await reqAddSku(skuParams.value);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加SKU成功'
        });
        //通知父组件切换场景为零
        $emit('changeScene',{flag:0,params:props.operator})
    } else {
        ElMessage({
            type: 'error',
            message: `添加SKU失败，${result.message}`
        })
    }
};
//暴露方法
defineExpose({
    initSkuData
});
</script>

<style scoped lang="scss"></style>