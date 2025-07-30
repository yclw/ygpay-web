import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 菜单管理表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  path: [{ required: true, message: "菜单路径为必填项", trigger: "blur" }],
  title: [{ required: true, message: "菜单标题为必填项", trigger: "blur" }],
  component: [{ required: true, message: "组件路径为必填项", trigger: "blur" }],
  sort: [{ required: true, message: "排序为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必填项", trigger: "blur" }]
});
