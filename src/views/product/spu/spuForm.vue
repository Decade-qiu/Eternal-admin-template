<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select v-model="SpuParams.tmId">
                <el-option v-for="(item, index) in AllTradeMark" :key="item.id" :label="item.tmName"
                    :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请你输入SPU描述" v-model="SpuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <!-- 展示销售属性的下拉菜单 -->
            <el-select style="width:240px" :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'"
                v-model="saleAttrIdAndValueName">
                <el-option v-for="(item, index) in unSelectSaleAttr" :key="item.id" :label="item.name"
                    :value="`${item.id}:${item.name}`"></el-option>
            </el-select>
            <el-button style="margin-left: 10px" type="primary" size="default" icon="Plus" @click="addAttr">
                添加属性
            </el-button>
            <!-- table展示销售属性与属性值的地方 -->
            <el-table border style="margin: 10px 0px" :data="saleAttr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="销售属性值">
                    <!-- row:即为当前SPU已有的销售属性对象 -->
                    <template v-slot="{ row, $index }">
                        <el-tag style="margin:0px 5px" @close="row.spuSaleAttrValueList.splice(index, 1)"
                            v-for="(item, index) in row.spuSaleAttrValueList" :key="item" closable>
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true"
                            placeholder="请你输入属性值" size="small" style="width:100px"></el-input>
                        <el-button @click="toEdit(row)" v-else type="primary" size="small" icon="Plus"></el-button>
                        <!-- <el-button v-show="row.flag" @click="cancelEdit" size="small" type="danger">取消</el-button> -->
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px"></el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="default" @click="save">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import type { SaleAttrValue, HasSaleAttr, SaleAttr, SpuImg, Trademark, SpuData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type';
import { ElMessage, UploadFile, UploadRawFile } from 'element-plus';
export type changeSceneType = { flag: number, params: string };
let $emit = defineEmits<{
    (e: 'changeScene', args: changeSceneType): void
}>();
let props = defineProps<{
    operator: string,
}>();
//点击取消按钮:通知父组件切换场景为1,展示有的SPU的数据
const cancel = () => {
    $emit('changeScene', { flag: 0, params: props.operator });
};
//初始化
let SpuParams = ref<SpuData>({
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
});
let AllTradeMark = ref<Trademark[]>([]);
let imgList = ref<SpuImg[]>([]);
let saleAttr = ref<SaleAttr[]>([]);
let allSaleAttr = ref<HasSaleAttr[]>([]);
let unSelectSaleAttr = computed(() => {
    return allSaleAttr.value.filter(item => {
        return saleAttr.value.find(v => v.baseSaleAttrId == item.id) == undefined;
    });
});
let saleAttrIdAndValueName = ref<string>('');
const initHasSpuData = async (row: SpuData) => {
    Object.assign(SpuParams.value, row);
    //获取全部品牌的数据
    let result: AllTradeMark = await reqAllTradeMark();
    //获取某一个品牌旗下全部售卖商品的图片
    let result1: SpuHasImg = await reqSpuImageList(row.id!);
    //获取已有的SPU销售属性的数据
    let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(row.id!);
    //获取整个项目全部SPU的销售属性
    let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
    //存储全部品牌的数据
    AllTradeMark.value = result.data;
    //SPU对应商品图片
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName!,
            url: item.imgUrl!
        }
    })
    //存储已有的SPU的销售属性
    saleAttr.value = result2.data;
    //存储全部的销售属性
    allSaleAttr.value = result3.data;
};
//照片墙
let dialogVisible = ref(false);
let dialogImageUrl = ref("");
const handlePictureCardPreview = (uploadFile: UploadFile) => {
    dialogImageUrl.value = uploadFile.url!;
    dialogVisible.value = true;
};
const handlerUpload = (file: UploadRawFile) => {
    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true;
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件务必小于3M'
            })
            return false;
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文件务必PNG|JPG|GIF'
        })
        return false;
    }
};
const handleRemove = () => {
};
//点击添加属性按钮的回调
const addAttr = () => {
    //非法情况判断
    if (saleAttrIdAndValueName.value.trim() == '') {
        ElMessage({
            type: 'error',
            message: '请选择属性'
        })
        return;
    };
    //获取销售属性的ID和名字
    let [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':');
    //整理成服务器需要的属性对象形式
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
        flag: false,
        saleAttrValue: ''
    };
    //追加新的属性对象
    saleAttr.value.push(newSaleAttr);
    //清空下拉菜单
    saleAttrIdAndValueName.value = '';
};
const toEdit = (row: SaleAttr) => {
    row.flag = true;
    row.saleAttrValue = '';
};
const toLook = (row: SaleAttr) => {
    const { baseSaleAttrId, saleAttrValue } = row;
    //整理成服务器需要的属性值形式
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: saleAttrValue!
    };
    //非法情况判断
    if (saleAttrValue!.trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空的'
        })
        return;
    };
    //判断属性值是否在数组当中存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue;
    });
    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        return;
    };
    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue);
    //切换为查看模式
    row.flag = false;
};
//保存
const save = async () => {
    //整理参数
    //发请求:添加SPU|更新已有的SPU
    //成功
    //失败
    //1:照片墙的数据
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,//图片的名字
            imgUrl: (item.response && item.response.data) || item.url,
            name: item.name
        }
    });
    //2:整理销售属性的数据
    SpuParams.value.spuSaleAttrList = saleAttr.value;
    let result = await reqAddOrUpdateSpu(SpuParams.value);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: SpuParams.value.id ? '更新成功' : '添加成功'
        })
        //通知父组件切换场景为0
        $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' });
    } else {
        ElMessage({
            type: 'error',
            message: SpuParams.value.id ? '更新失败' : '添加失败'
        })
    }
};
//新增spu时 初始化数据
const initAddSpu = async (c3Id: string | number) => {
    SpuParams.value = {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    };
    //清空照片
    imgList.value = [];
    //清空销售属性
    saleAttr.value = [];
    saleAttrIdAndValueName.value = '';
    //存储三级分类的ID
    SpuParams.value.category3Id = c3Id;
    //获取全部品牌的数据
    let result: AllTradeMark = await reqAllTradeMark();
    let result1: HasSaleAttrResponseData = await reqAllSaleAttr();
    //存储数据
    AllTradeMark.value = result.data;
    allSaleAttr.value = result1.data;
};
//向外暴露数据和方法
defineExpose({
    initHasSpuData,
    initAddSpu
});
</script>

<style scoped lang="scss"></style>