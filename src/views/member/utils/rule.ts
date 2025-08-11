import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

/** 用户管理表单规则校验 */
export const formRules = reactive(<FormRules>{
  username: [
    { required: true, message: "用户名为必填项", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度应为3-20位", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: "用户名只能包含字母、数字、下划线和横线",
      trigger: "blur"
    }
  ],
  nickname: [
    { required: true, message: "昵称为必填项", trigger: "blur" },
    { min: 2, max: 20, message: "昵称长度应为2-20位", trigger: "blur" }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        // 如果是修改用户且密码为空，则跳过验证
        if (!value) {
          callback();
          return;
        }
        if (!REGEXP_PWD.test(value)) {
          callback(
            new Error("密码格式应为8-18位数字、字母、符号的任意两种组合")
          );
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  roleUid: [{ required: true, message: "角色为必填项", trigger: "blur" }],
  email: [
    { required: true, message: "邮箱为必填项", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  mobile: [
    { required: true, message: "手机号为必填项", trigger: "blur" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号格式",
      trigger: "blur"
    }
  ],
  sex: [{ required: true, message: "性别为必填项", trigger: "blur" }],
  avatar: [{ required: false, message: "头像为可选项", trigger: "blur" }],
  address: [{ required: false, message: "地址为可选项", trigger: "blur" }],
  remark: [{ required: false, message: "备注为可选项", trigger: "blur" }],
  sort: [{ required: true, message: "排序为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必填项", trigger: "blur" }]
});
