<template>
    <el-card class="box-card">
        <!-- 卡片顶部添加品牌按钮 -->
        <el-button type="primary" size="default" icon="Plus" @click="addTradeMark">添加品牌</el-button>
        <!-- 表格组件，用于展示已有的数据 -->
        <!-- 
        table
        ---border:是否有纵向的边框
        table-column
        ---lable：某一个列表
        ---width：设置这一列的宽度
        ---align：设置这一列对齐方式
       -->
        <el-table :data="trademarkArr" style="margin: 10px 0px" border>
            <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
            <el-table-column prop="tmName" label="品牌名称"></el-table-column>
            <el-table-column label="品牌LOGO" key="slot">
                <template v-slot="{ row, $index }">
                    <img :src="row.logoUrl" style="width:100px;height:100px;">
                </template>
            </el-table-column>
            <el-table-column label="品牌操作">
                <template v-slot="{ row, $index }">
                    <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
                    <el-popconfirm :title="`您确定要删除${row.tmName}?`" width="250px" icon="Delete"
                            @confirm='removeTradeMark(row.id)'>
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器组件 -->
        <!-- 
        pagination
        ---v-model:current-page：设置当前分页器页码
        ---v-model:page-size:设置每一也展示数据条数
        ---page-sizes：每页显示个数选择器的选项设置
        ---background:背景颜色
        ---layout：分页器6个子组件布局的调整 "->"把后面的子组件顶到右侧
       -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
            layout=" prev, pager, next, jumper,->,total, sizes," :total="total" @current-change="getHasTrademark"
            @size-change="sizeChange" />
    </el-card>
    <el-dialog v-model="dialogVisible" :title="trademarkParams.id ? '修改品牌' : '添加数据'">
        <el-form :model="trademarkParams" :rules="rules" ref="form">
            <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                <!-- upload组件属性:action图片上传路径书写/api,代理服务器不发送这次post请求  -->
                <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
            <el-button type="primary" size="default" @click="confirm">确定</el-button>
        </template>
    </el-dialog>
</template>
  
<script setup lang="ts">
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark';
import { ref, onMounted } from 'vue';
import { TradeMarkResponseData, TradeMark, ResponseData } from '@/api/product/trademark/type';
import { UploadProps, ElMessage, FormRules, FormInstance } from 'element-plus';
//当前页码
let pageNo = ref<number>(1);
//每一页展示的数据
let limit = ref<number>(3);
//存储已有品牌数据总数
let total = ref<number>(0);
//存储已有品牌的数据
let trademarkArr = ref<TradeMarkResponseData['data']['records']>([]);
//表单
const form = ref<FormInstance>();
//获取已有品牌的接口封装为一个函数:在任何情况下向获取数据,调用次函数即可
const getHasTrademark = async (pager = 1) => {
    //当前页码
    pageNo.value = pager;
    let result = await reqHasTrademark(pageNo.value, limit.value);
    if (result.code == 200) {
        //存储已有品牌总个数
        total.value = result.data.total;
        trademarkArr.value = result.data.records;
    }
}
const sizeChange = (val: number) => {
    limit.value = val;
    getHasTrademark();
}
//组件挂载完毕钩子---发一次请求,获取第一页、一页三个已有品牌数据
onMounted(() => {
    getHasTrademark();
})
// 对话框
const trademarkParams = ref<TradeMark>({
    tmName: '',
    logoUrl: ''
});
const dialogVisible = ref<boolean>(false);
const updateTrademark = (row: TradeMark) => {
    trademarkParams.value = {
        id: row.id,
        tmName: row.tmName,
        logoUrl: row.logoUrl
    };
    dialogVisible.value = true;
};
const cancel = () => {
    form.value?.clearValidate();
    dialogVisible.value = false;
};
const confirm = async () => {
    //在你发请求之前,要对于整个表单进行校验
    // 调用这个方法进行全部表单相校验,如果校验全部通过，在执行后面的语法
    try {
        await form.value?.validate();
        let result: ResponseData = await reqAddOrUpdateTrademark(trademarkParams.value);
        //添加|修改已有品牌
        if (result.code == 200) {
            //弹出提示信息
            ElMessage({
                type: 'success',
                message: trademarkParams.value.id ? '修改品牌成功' : '添加品牌成功',
            });
            //再次发请求获取已有全部的品牌数据
            getHasTrademark(trademarkParams.value.id ? pageNo.value : 1);
        } else {
            //添加品牌失败
            ElMessage({
                type: 'error',
                message: trademarkParams.value.id ? '修改品牌失败' : '添加品牌失败',
            });
        };
        dialogVisible.value = false;
        form.value?.clearValidate();
    } catch (error) {
        return;
    };
}
const addTradeMark = () => {
    dialogVisible.value = true;
    trademarkParams.value.id = undefined;
    trademarkParams.value.tmName = '';
    trademarkParams.value.logoUrl = '';
};
const removeTradeMark = async (id: number) => {
    let result: ResponseData = await reqDeleteTrademark(id);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除品牌成功',
        });
        getHasTrademark();
    } else {
        ElMessage({
            type: 'error',
            message: '删除品牌失败',
        });
    }
};
//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
    //要求:上传文件格式png|jpg|gif 4M
    if (
        rawFile.type == 'image/png' ||
        rawFile.type == 'image/jpeg' ||
        rawFile.type == 'image/gif'
    ) {
        if (rawFile.size / 1024 / 1024 < 4) {
            return true
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件大小小于4M',
            })
            return false
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文件格式务必PNG|JPG|GIF',
        })
        return false
    }
};
//图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
) => {
    //response:即为当前这次上传图片post请求服务器返回的数据
    //收集上传图片的地址,添加一个新的品牌的时候带给服务器
    trademarkParams.value.logoUrl = response.data;
}
// 表单校验
//品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
    //是当表单元素触发blur时候,会触发此方法
    //自定义校验规则
    if (value.trim().length >= 2) {
        callBack();
    } else {
        //校验未通过返回的错误的提示信息
        callBack(new Error('品牌名称位数大于等于两位'));
    }
};
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
    //如果图片上传
    if (value) {
        callBack();
    } else {
        callBack(new Error('LOGO图片务必上传'));
    }
}
const rules = ref<FormRules>({
    tmName: [
        { required: true, trigger: 'blur', validator: validatorTmName }],
    logoUrl: [
        { required: true, validator: validatorLogoUrl },
    ],
});
</script>
  
<style lang="scss" scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.avatar-uploader {
    border: 1px dashed $el-border-color;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: $el-transition-duration-fast;
}

.avatar-uploader:hover {
    border-color: $el-color-primary;
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>