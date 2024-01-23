<template>
    <category :scene="scene"></category>
    <el-card style="margin: 10px 0px">
        <template v-if="!scene">
            <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
                @click="addAttr">
                添加属性
            </el-button>
            <el-table border style="margin: 10px 0px" :data="attrArr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
                <el-table-column label="属性值名称">
                    <!-- row：已有的属性对象 -->
                    <template v-slot="{ row, $index }">
                        <el-tag style="margin: 5px" v-for="(item, index) in row.attrValueList" :key="item.id">
                            {{ item.valueName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <!-- row：已有的属性对象 -->
                    <template v-slot="{ row, $index }">
                        <!-- 修改已有属性的按钮 -->
                        <el-button type="primary" size="small" icon="Edit"></el-button>
                        <el-button type="primary" size="small" icon="Delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <template v-else>
            <el-form :inline="true">
                <el-form-item label="属性名称">
                    <el-input placeholder="请你输入属性名称" v-model="attrParams.attrName"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="addAttrValue" :disabled="attrParams.attrName ? false : true" type="primary" size="default"
                icon="Plus">添加属性值</el-button>
            <el-table border style="margin:10px 0px" :data="attrParams.attrValueList">
                <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
                <el-table-column label="属性值名称">
                    <!-- row:即为当前属性值对象 -->
                    <template v-slot="{ row, $index }">
                        <!-- <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
                            size="small" placeholder="请你输入属性值名称" v-model="row.valueName"></el-input>
                        <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div> -->
                        {{ row }}
                    </template>
                </el-table-column>
                <el-table-column label="属性值操作">
                    <template v-slot="{ row, index }">
                        <el-button type="primary" size="small" icon="Delete"
                            @click="attrParams.attrValueList.splice(index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" size="default" @click="save"
                :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </template>
    </el-card>
</template>
  
<script setup lang="ts">
//组合式API函数watch
import { watch, ref, nextTick, onBeforeUnmount } from 'vue';
//引入获取已有属性与属性值接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
//获取分类的仓库
import useCategoryStore from '@/store/modules/category';
import { ElMessage } from 'element-plus';
let categoryStore = useCategoryStore();
const scene = ref<boolean>(false);
//存储已有的属性与属性值
let attrArr = ref<Attr[]>([]);
const getAttr = async () => {
    //获取已有的属性与属性值
    const { c1Id, c2Id, c3Id } = categoryStore;
    let data = await reqAttr(c1Id, c2Id, c3Id);
    if (data.code == 200) {
        attrArr.value = data.data;
    }
};
watch(() => categoryStore.c3Id, (val) => {
    attrArr.value = [];
    if (!categoryStore.c3Id) return;
    getAttr();
});
//添加属性数据
//准备一个数组:将来存储对应的组件实例el-input
let inputArr = ref<any>([]);
//收集新增的属性的数据
let attrParams = ref<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [
    //新增的属性值数组
  ],
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //代表的是三级分类
});
const addAttr = () => {
    //添加属性
    //获取分类ID
    const { c1Id, c2Id, c3Id } = categoryStore;
    //判断是否有分类ID
    if (!c1Id || !c2Id || !c3Id) {
        ElMessage.warning('请先选择分类');
        return;
    }
    //跳转到添加属性的页面
    scene.value = true;
};
//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性值按钮的时候,向数组添加一个属性值对象
  attrParams.value.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值编辑模式与切换模式的切换
  })
}
const save = () => {

};
const cancel = () => {
    scene.value = false;
};
</script>
  
<style lang="" scoped></style>