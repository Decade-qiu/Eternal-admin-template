<template>
    <el-card>
        <el-table border :data="SkuData" style="margin: 10px auto">
            <el-table-column type="index" label="序号" width="80px"></el-table-column>
            <el-table-column prop="skuName" label="名称" width="100px"></el-table-column>
            <el-table-column prop="skuDesc" label="描述" width="150px"></el-table-column>
            <el-table-column label="图片" width="150px">
                <template v-slot="{ row, $index }">
                    <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
                </template>
            </el-table-column>
            <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
            <el-table-column label="价格" width="150px" prop="price"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="{ row, $index }">
                    <el-button type="primary" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
                        @click="updateSale(row)"></el-button>
                    <el-button type="warning" size="small" icon="Edit" @click="updateSku(row)"></el-button>
                    <el-button type="info" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
                    <el-popconfirm :title="`你确定要删除${row.skuName}?`" width="200px" @confirm="removeSku(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 6, 9, 12]"
            :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </el-card>
    <el-drawer v-model="showDrawer" direction="rtl" size="500px">
        <!-- 标题部分 -->
        <template #header>
            <h4>商品的详情</h4>
        </template>
        <template #default>
            <el-row  >
                <el-col :span="6">名称</el-col>
                <el-col :span="18">{{ skuInfo.skuName }}</el-col>
            </el-row>
            <el-row  >
                <el-col :span="6">描述</el-col>
                <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
            </el-row>
            <el-row  >
                <el-col :span="6">价格</el-col>
                <el-col :span="18">{{ skuInfo.price }}</el-col>
            </el-row>
            <el-row  >
                <el-col :span="6">平台属性</el-col>
                <el-col :span="18">
                    <el-tag style="margin:5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{
                        item.valueName }}</el-tag>
                </el-col>
            </el-row>
            <el-row  >
                <el-col :span="6">销售属性</el-col>
                <el-col :span="18">
                    <el-tag style="margin:5px;" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{
                        item.saleAttrValueName }}</el-tag>
                </el-col>
            </el-row>
            <el-row  >
                <el-col :span="6">商品图片</el-col>
                <el-col :span="18">
                    <el-carousel :interval="4000" type="card" height="200px">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                            <img :src="item.imgUrl" alt="" style="width:100%;height: 100%;">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </template>
    </el-drawer>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku';
import type { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';
let currentPage = ref(1);
let pageSize = ref(3);
let total = ref(0);
let SkuData = ref<SkuData[]>([]);
let showDrawer = ref(false);
let skuInfo = ref<SkuData>({});
const getHasSku = async (pager = 1) => {
    //当前分页器的页码
    currentPage.value = pager;
    let result = await reqSkuList(currentPage.value, pageSize.value);
    if (result.code == 200) {
        total.value = result.data.total;
        SkuData.value = result.data.records;
    };
};
const handleSizeChange = (val: number) => {
    getHasSku();
};
const handleCurrentChange = (val: number) => {
    getHasSku(val);
};
const updateSku = (row: SkuData) => {
    ElMessage.warning('暂未开发');
};
const findSku = async (row: SkuData) => {
    let result = await reqSkuInfo(row.id!);
    if (result.code == 200) {
        skuInfo.value = result.data;
        showDrawer.value = true;
        console.log(result.data.skuImageList);
    } else {
        ElMessage.error(result.message);
    };
};
const updateSale = async (row: SkuData) => {
    if (row.isSale == 1) {
        let result = await reqCancelSale(row.id!);
        if (result.code == 200) {
            ElMessage.success(result.message);
            getHasSku(currentPage.value);
        } else {
            ElMessage.error(result.message);
        };
    } else {
        let result = await reqSaleSku(row.id!);
        if (result.code == 200) {
            ElMessage.success(result.message);
            getHasSku(currentPage.value);
        } else {
            ElMessage.error(result.message);
        };
    };
};
const removeSku = async (id: number) => {
    let result = await reqRemoveSku(id);
    if (result.code == 200) {
        ElMessage.success(result.message);
        getHasSku();
    } else {
        ElMessage.error(result.message);
    };
};
onMounted(() => {
    getHasSku();
});
</script>

<style scoped lang="scss">
.el-row {
    margin: 15px 0;
    .el-col-6 {
        display: flex;
        align-items: center;
    }
    .el-col-18 {
        line-height: 25px;
    }
}
</style>