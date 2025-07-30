<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    pid: 0,
    name: "",
    path: "",
    icon: "",
    title: "",
    showParent: true,
    component: "",
    noShowingChildren: false,
    value: null,
    showTooltip: false,
    parentId: 0,
    redirect: "",
    description: "",
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
    label-width="100px"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="菜单名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单标题" prop="title">
          <el-input
            v-model="newFormInline.title"
            clearable
            placeholder="请输入菜单标题"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="菜单路径" prop="path">
          <el-input
            v-model="newFormInline.path"
            clearable
            placeholder="请输入菜单路径，如：/user/list"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单图标" prop="icon">
          <el-input
            v-model="newFormInline.icon"
            clearable
            placeholder="请输入图标类名，如：el-icon-user"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="组件路径" prop="component">
      <el-input
        v-model="newFormInline.component"
        clearable
        placeholder="请输入组件路径，如：user/index"
      />
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="父级ID" prop="pid">
          <el-input-number
            v-model="newFormInline.pid"
            :min="0"
            placeholder="请输入父级ID"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="newFormInline.sort"
            :min="0"
            :max="999999"
            placeholder="请输入排序值"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="重定向路径" prop="redirect">
      <el-input
        v-model="newFormInline.redirect"
        clearable
        placeholder="请输入重定向路径（可选）"
      />
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="显示父级" prop="showParent">
          <el-select
            v-model="newFormInline.showParent"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="显示提示" prop="showTooltip">
          <el-select
            v-model="newFormInline.showTooltip"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="newFormInline.status"
            placeholder="请选择状态"
            style="width: 100%"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="描述" prop="description">
      <el-input
        v-model="newFormInline.description"
        placeholder="请输入菜单描述（可选）"
        type="textarea"
        :rows="3"
      />
    </el-form-item>
  </el-form>
</template>
