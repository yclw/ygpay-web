import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 角色管理表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  key: [
    { required: true, message: "角色标识为必填项", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: "角色标识只能包含字母、数字、下划线和横线",
      trigger: "blur"
    }
  ],
  remark: [{ required: false, message: "备注为可选项", trigger: "blur" }],
  parentId: [{ required: false, message: "父级角色ID为可选项，0表示顶级角色", trigger: "blur" }],
  parentName: [{ required: false, message: "父级角色名称为可选项", trigger: "blur" }],
  sort: [{ required: true, message: "排序为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必填项", trigger: "blur" }]
});
