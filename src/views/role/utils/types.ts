// 角色管理相关的类型定义

interface FormItemProps {
  /** 角色ID */
  id?: number;
  /** 角色名称 */
  name: string;
  /** 角色标识 */
  key: string;
  /** 备注 */
  remark: string;
  /** 父级角色ID */
  parentId: number;
  /** 父级角色名称 */
  parentName: string;
  /** 排序 */
  sort: number;
  /** 状态 */
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
