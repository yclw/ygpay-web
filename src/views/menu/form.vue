<script setup lang="ts">
import { ref, computed } from "vue";
import { baseFormRules, componentRule } from "./utils/rule";
import { FormProps } from "./utils/types";
import type { FormRules } from "element-plus";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    type: 1,
    name: "",
    path: "",
    title: "",
    icon: "",
    sort: 10,
    showParent: false,
    showLink: true,
    keepAlive: false,
    parentId: 0,
    parentTitle: "",
    redirect: "",
    component: "",
    frameSrc: "",
    url: "",
    status: 1
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 根据菜单类型动态计算字段显示
const isDirectory = computed(() => newFormInline.value.type === 0);
const isMenu = computed(() => newFormInline.value.type === 1);
const isExternalLink = computed(() => newFormInline.value.type === 2);

// 动态字段标签
const nameLabel = computed(() => {
  return isExternalLink.value ? "外链地址" : "菜单名称";
});

const namePlaceholder = computed(() => {
  return isExternalLink.value ? "请输入外链地址" : "请输入菜单名称";
});

// 动态验证规则
const dynamicRules = computed(() => {
  const rules: FormRules = {
    ...baseFormRules
  };

  // 菜单类型时，组件路径为必填
  if (isMenu.value) {
    rules.component = componentRule;
  }

  return rules;
});

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="dynamicRules"
    label-width="100px"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="菜单类型" prop="type">
          <el-select
            v-model="newFormInline.type"
            placeholder="请选择菜单类型"
            style="width: 100%"
          >
            <el-option label="目录" :value="0" />
            <el-option label="菜单" :value="1" />
            <el-option label="外链" :value="2" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="父级ID" prop="parentId">
          <el-input-number
            v-model="newFormInline.parentId"
            :min="0"
            placeholder="请输入父级ID"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item :label="nameLabel" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            :placeholder="namePlaceholder"
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

    <el-form-item v-if="isMenu" label="组件路径" prop="component">
      <el-input
        v-model="newFormInline.component"
        clearable
        placeholder="请输入组件路径，如：user/index"
      />
    </el-form-item>

    <el-form-item v-if="isExternalLink" label="内嵌地址" prop="frameSrc">
      <el-input
        v-model="newFormInline.frameSrc"
        clearable
        placeholder="请输入内嵌地址（iframe），如：https://example.com"
      />
    </el-form-item>

    <el-row :gutter="20">
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
      <el-col :span="12">
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

    <el-form-item v-if="isDirectory" label="重定向路径" prop="redirect">
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
        <el-form-item label="显示菜单" prop="showLink">
          <el-select
            v-model="newFormInline.showLink"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="缓存页面" prop="keepAlive">
          <el-select
            v-model="newFormInline.keepAlive"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
