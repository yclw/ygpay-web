// 菜单管理相关的类型定义

interface FormItemProps {
  /** 菜单ID */
  id?: number;
  /** 父级ID */
  pid: number;
  /** 菜单名称 */
  name: string;
  /** 菜单路径 */
  path: string;
  /** 菜单图标 */
  icon: string;
  /** 菜单标题 */
  title: string;
  /** 是否显示父级 */
  showParent: boolean;
  /** 组件路径 */
  component: string;
  /** 不显示子级 */
  noShowingChildren: boolean;
  /** 额外值 */
  value: any;
  /** 显示提示 */
  showTooltip: boolean;
  /** 父级ID */
  parentId: number;
  /** 重定向路径 */
  redirect: string;
  /** 描述 */
  description: string;
  /** 排序 */
  sort: number;
  /** 状态 */
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
