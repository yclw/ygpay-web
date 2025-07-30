<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    path: "",
    method: "",
    groupName: "",
    description: "",
    needAuth: 1,
    rateLimit: 1000,
    sort: 0,
    status: 1
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
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
    <el-form-item label="API名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入API名称"
      />
    </el-form-item>

    <el-form-item label="API路径" prop="path">
      <el-input
        v-model="newFormInline.path"
        clearable
        placeholder="请输入API路径，如：/api/user/list"
      />
    </el-form-item>

    <el-form-item label="请求方法" prop="method">
      <el-select
        v-model="newFormInline.method"
        placeholder="请选择请求方法"
        clearable
        style="width: 100%"
      >
        <el-option label="GET" value="GET" />
        <el-option label="POST" value="POST" />
        <el-option label="PUT" value="PUT" />
        <el-option label="DELETE" value="DELETE" />
        <el-option label="PATCH" value="PATCH" />
      </el-select>
    </el-form-item>

    <el-form-item label="分组名称" prop="groupName">
      <el-input
        v-model="newFormInline.groupName"
        clearable
        placeholder="请输入分组名称"
      />
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input
        v-model="newFormInline.description"
        placeholder="请输入API描述"
        type="textarea"
        :rows="3"
      />
    </el-form-item>

    <el-form-item label="是否需要认证" prop="needAuth">
      <el-select
        v-model="newFormInline.needAuth"
        placeholder="请选择认证状态"
        clearable
        style="width: 100%"
      >
        <el-option label="需要认证" :value="1" />
        <el-option label="无需认证" :value="0" />
      </el-select>
    </el-form-item>

    <el-form-item label="限流" prop="rateLimit">
      <el-input-number
        v-model="newFormInline.rateLimit"
        :min="0"
        :max="999999"
        placeholder="请输入限流值"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="排序" prop="sort">
      <el-input-number
        v-model="newFormInline.sort"
        :min="0"
        :max="999999"
        placeholder="请输入排序值"
        style="width: 100%"
      />
    </el-form-item>

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
  </el-form>
</template>
