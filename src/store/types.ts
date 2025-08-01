import type { RouteRecordName } from "vue-router";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Collapse
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
  viewportSize: { width: number; height: number };
};

export type multiType = {
  path: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export type userType = {
  isRemembered?: boolean;
  loginDay?: number;
  // 用户UID
  uid: string;
  // 昵称
  nickname: string;
  // 所属角色
  roleName: string;
  // 用户名
  username: string;
  // 头像
  avatar: string;
  // 性别
  sex: number;
  // 邮箱
  email: string;
  // 手机号码
  mobile: string;
  // 联系地址
  address: string;
  // 创建时间
  createdAt: Date;
};
