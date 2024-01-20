<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :offset="2" :span="8" :xs="24">
                <el-form 
                class="login_form"
                :model="loginForm"
                :rules="rules"
                ref = "forms">
                    <h1>Vue-Admin</h1>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login_btn" type="primary" size="default" @click="login" :loading="flag">
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang='ts'>
import { User, Lock } from '@element-plus/icons-vue';
import { ref } from 'vue';
import useUserStore from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';
import { ElNotification, FormInstance,  } from 'element-plus';
import { getTime } from '@/utils/time';
let router = useRouter();
let route = useRoute();
let flag = ref(false);
let userStore = useUserStore();
let loginForm = ref({ username: 'admin', password: '111111' });
let forms = ref<FormInstance>();
//自定义校验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  //rule：校验规则对象
  //value:表单元素文本内容
  //callback:符合条件，callback放行通过;不符合：注入错误提示信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少5位'))
  }
};
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
  }
};
//定义表单校验需要的配置对象
const rules = {
  username: [
    //规则对象属性:
    /* {
      required: true, // required,代表这个字段务必要校验的
      min: 5, //min:文本长度至少多少位
      max: 10, // max:文本长度最多多少位
      message: '长度应为5-10位', // message:错误的提示信息
      trigger: 'change', //trigger:触发校验表单的时机 change->文本发生变化触发校验, blur:失去焦点的时候触发校验规则
    }, */
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    { trigger: 'change', validator: validatorPassword },
  ],
};
const login = async () => {
    let res = await forms.value?.validate();
    flag.value = true;
    userStore.login(loginForm.value)
        .then((res) => {
            // console.log(route.query, route.params);
            let redirect = route.query.redirect as string;
            router.push({ path: redirect ? redirect : '/' });
            ElNotification({
                title: `HI，${getTime()}好！`,
                message: '欢迎回来',
                type: 'success',
            });
        })
        .catch((error: Error) => {
            ElNotification({
                type: 'error',
                message: error.message,
            });
        })
        .finally(() => {
            flag.value = false;
        });
};
</script>

<style scoped lang="scss">
.login_container {
    width: 100vw;
    height: 100vh;
    background-image: url('@/assets/images/background.jpg');
    background-size: cover;

    .login_form {
        position: relative;
        top: 35vh;
        background-image: url('@/assets/images/login_form.jpg');
        background-size: cover;
        border-radius: 20px;
        border: 1px solid #ccc;
        padding: 20px;

        h1 {
            text-align: center;
            font-size: 40px;
            font-weight: bolder;
            background: linear-gradient(to right, blue, rgb(35, 60, 70));
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            margin-bottom: 20px;
        }

        .login_btn {
            width: 100%;
        }
    }
}
</style>