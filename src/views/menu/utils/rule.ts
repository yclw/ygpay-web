import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 菜单管理表单基础规则校验 */
export const baseFormRules = reactive(<FormRules>{
  name: [{ required: true, message: "名称为必填项", trigger: "blur" }],
  path: [{ required: true, message: "路径为必填项", trigger: "blur" }],
  title: [{ required: true, message: "标题为必填项", trigger: "blur" }],
  sort: [{ required: true, message: "排序为必填项", trigger: "blur" }],
  parentId: [{ required: true, message: "父级ID为必填项", trigger: "blur" }],
  showParent: [
    { required: true, message: "是否显示父级为必填项", trigger: "blur" }
  ],
  showLink: [
    { required: true, message: "是否显示菜单为必填项", trigger: "blur" }
  ],
  keepAlive: [{ required: true, message: "是否缓存为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必填项", trigger: "blur" }]
});

/** 组件路径规则（仅菜单类型需要） */
export const componentRule = [
  { required: true, message: "组件路径为必填项", trigger: "blur" }
];

/** 内嵌地址规则（外链类型需要） */
export const frameSrcRule = [
  { required: false, message: "内嵌地址为选填项", trigger: "blur" }
];
