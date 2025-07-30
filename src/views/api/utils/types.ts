// API管理相关的类型定义

interface FormItemProps {
  /** API名称 */
  name: string;
  /** API路径 */
  path: string;
  /** 请求方法 */
  method: string;
  /** 分组名称 */
  groupName: string;
  /** 描述 */
  description: string;
  /** 是否需要认证 */
  needAuth: number;
  /** 限流 */
  rateLimit: number;
  /** 排序 */
  sort: number;
  /** 状态 */
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
