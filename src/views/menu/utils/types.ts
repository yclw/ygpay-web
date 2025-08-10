// 菜单管理相关的类型定义

// 查询表单类型
interface SearchFormProps {
  /** 菜单名称 */
  name?: string;
  /** 菜单标题 */
  title?: string;
  /** 菜单路径 */
  path?: string;
  /** 菜单类型: 0目录 1菜单 2外链 */
  type?: number;
  /** 状态: 0禁用 1启用 */
  status?: number;
  /** 开始日期 */
  startDate?: Date;
  /** 结束日期 */
  endDate?: Date;
}

interface FormItemProps {
  /** 菜单UID */
  menuUid?: string;
  /** 菜单类型: 0目录 1菜单 2外链 */
  type: number;
  /** 菜单名称 */
  name: string;
  /** 菜单路径 */
  path: string;
  /** 菜单标题 */
  title: string;
  /** 菜单图标 */
  icon: string;
  /** 排序 */
  sort: number;
  /** 是否显示父级 */
  showParent: boolean;
  /** 是否显示该菜单 */
  showLink: boolean;
  /** 是否缓存 */
  keepAlive: boolean;
  /** 父级菜单UID */
  parentUid?: string;
  /** 父级菜单标题 */
  parentTitle: string;
  /** 重定向路径 */
  redirect: string;
  /** 组件路径 */
  component: string;
  /** 内嵌地址 */
  frameSrc: string;
  /** 外部链接 */
  url: string;
  /** 状态 */
  status: number;
}

interface FormProps {
  formInline?: FormItemProps;
}

export type { SearchFormProps, FormItemProps, FormProps };
