<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import RoleSelect from "./role-select.vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    uid: "",
    username: "",
    nickname: "",
    password: "",
    roleUid: undefined,
    avatar: "",
    sex: undefined,
    email: "",
    mobile: "",
    address: "",
    remark: "",
    sort: 0,
    status: 1
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const showPassword = ref(false);

function getRef() {
  return ruleFormRef.value;
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="newFormInline.username"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="newFormInline.nickname"
            clearable
            placeholder="请输入昵称"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码(修改时留空表示不更改)"
            clearable
          >
            <template #suffix>
              <el-icon
                style="cursor: pointer"
                @click="togglePasswordVisibility"
              >
                <component :is="showPassword ? 'View' : 'Hide'" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="角色" prop="roleUid">
          <RoleSelect
            v-model="newFormInline.roleUid"
            placeholder="请选择用户角色"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="newFormInline.mobile"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="newFormInline.sex"
            placeholder="请选择性别"
            clearable
            style="width: 100%"
          >
            <el-option label="保密" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="newFormInline.status"
            placeholder="请选择状态"
            clearable
            style="width: 100%"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="头像" prop="avatar">
      <el-input
        v-model="newFormInline.avatar"
        clearable
        placeholder="请输入头像URL"
      />
    </el-form-item>

    <el-form-item label="地址" prop="address">
      <el-input
        v-model="newFormInline.address"
        clearable
        placeholder="请输入地址"
      />
    </el-form-item>

    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        placeholder="请输入备注"
        type="textarea"
        :rows="3"
      />
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="newFormInline.sort"
            :min="0"
            :max="999999"
            placeholder="请输入排序值，数值越小排序越靠前"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
