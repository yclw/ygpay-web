import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** API管理表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "API名称为必填项", trigger: "blur" }],
  path: [{ required: true, message: "API路径为必填项", trigger: "blur" }],
  method: [{ required: true, message: "请求方法为必填项", trigger: "blur" }],
  groupName: [{ required: true, message: "分组名称为必填项", trigger: "blur" }],
  description: [{ required: true, message: "描述为必填项", trigger: "blur" }],
  needAuth: [{ required: true, message: "认证状态为必填项", trigger: "blur" }],
  rateLimit: [{ required: true, message: "限流为必填项", trigger: "blur" }],
  sort: [{ required: true, message: "排序为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必填项", trigger: "blur" }]
});
