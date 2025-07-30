<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { ref, reactive, toRaw, onMounted } from "vue";
import { debounce } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { useEventListener } from "@vueuse/core";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { useCaptcha } from "./utils/captcha";
import { AesECBEncrypt, getDefaultEncryptKey } from "@/utils/crypto";
import Keyhole from "~icons/ri/shield-keyhole-line";
import Refresh from "~icons/ri/refresh-line";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "~icons/ri/lock-fill";
import User from "~icons/ri/user-3-fill";

defineOptions({
  name: "Login"
});

const router = useRouter();
const loading = ref(false);
const disabled = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

// 验证码相关
const { captchaState, refreshCaptcha, initCaptcha } = useCaptcha();

const ruleForm = reactive({
  username: "admin",
  password: "admin123",
  code: "",
  cid: ""
});

// 初始化验证码
onMounted(async () => {
  await initCaptcha();
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      loading.value = true;

      // AesECBEncrypt加密密码
      const password = AesECBEncrypt(ruleForm.password, getDefaultEncryptKey());

      // 构建登录参数
      const loginParams = {
        username: ruleForm.username,
        password: password,
        cid: captchaState.value.captchaSwitch
          ? captchaState.value.captchaData.cid
          : "",
        code: captchaState.value.captchaSwitch ? ruleForm.code : ""
      };

      useUserStoreHook()
        .loginByUsername(loginParams)
        .then(res => {
          if (res.success) {
            // 获取后端路由
            return initRouter().then(() => {
              disabled.value = true;
              router
                .push(getTopMenu(true).path)
                .then(() => {
                  message("登录成功", { type: "success" });
                })
                .finally(() => (disabled.value = false));
            });
          } else {
            message(`登录失败: ${res.message}`, { type: "error" });
            // 如果登录失败且开启了验证码，刷新验证码
            if (captchaState.value.captchaSwitch) {
              refreshCaptcha();
              ruleForm.code = ""; // 清空验证码输入
            }
          }
        })
        .finally(() => (loading.value = false));
    }
  });
};

const immediateDebounce: any = debounce(
  formRef => onLogin(formRef),
  1000,
  true
);

useEventListener(document, "keydown", ({ code }) => {
  if (
    ["Enter", "NumpadEnter"].includes(code) &&
    !disabled.value &&
    !loading.value
  )
    immediateDebounce(ruleFormRef.value);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-hidden">{{ title }}</h2>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <!-- 验证码输入框 - 仅在需要验证码时显示 -->
            <Motion v-if="captchaState.captchaSwitch" :delay="200">
              <el-form-item prop="verifyCode">
                <el-input
                  v-model="ruleForm.code"
                  clearable
                  placeholder="验证码"
                  :prefix-icon="useRenderIcon(Keyhole)"
                >
                  <template v-slot:append>
                    <div class="captcha-container">
                      <!-- 验证码图片 -->
                      <img
                        v-if="captchaState.captchaData.base64"
                        :src="captchaState.captchaData.base64"
                        class="captcha-image"
                        alt="验证码"
                        @click="refreshCaptcha"
                      />
                      <!-- 刷新按钮 -->
                      <el-button
                        :icon="useRenderIcon(Refresh)"
                        :loading="captchaState.loading"
                        link
                        class="captcha-refresh"
                        title="点击刷新验证码"
                        @click="refreshCaptcha"
                      />
                    </div>
                  </template>
                </el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4!"
                size="default"
                type="primary"
                :loading="loading"
                :disabled="disabled"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;

  .captcha-image {
    width: 80px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #dcdfe6;

    &:hover {
      border-color: #409eff;
    }
  }

  .captcha-refresh {
    padding: 0;
    width: 24px;
    height: 24px;
    min-height: 24px;

    &:hover {
      color: #409eff;
    }
  }
}
</style>
