// 用户管理相关的类型定义

interface FormItemProps {
  /** 用户UID (修改时需要) */
  uid?: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 密码 (新增必填，修改时可选) */
  password?: string;
  /** 角色UID */
  roleUid: string;
  /** 头像 */
  avatar: string;
  /** 性别 */
  sex: number;
  /** 邮箱 */
  email: string;
  /** 手机号 */
  mobile: string;
  /** 地址 */
  address: string;
  /** 备注 */
  remark: string;
  /** 排序 */
  sort: number;
  /** 状态 */
  status: number;
}

interface FormProps {
  formInline?: FormItemProps;
}

export type { FormItemProps, FormProps };
