// 角色管理相关的类型定义

interface FormItemProps {
  /** 角色UID */
  roleUid?: string;
  /** 角色名称 */
  name: string;
  /** 角色标识 */
  key: string;
  /** 备注 */
  remark: string;
  /** 父级角色UID */
  parentUid?: string;
  /** 排序 */
  sort: number;
  /** 状态 */
  status: number;
}

interface FormProps {
  formInline?: FormItemProps;
}

export type { FormItemProps, FormProps };
