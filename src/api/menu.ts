import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: any;
};

export type MenuModel = {
  id: number; //菜单ID
  type: number; //菜单类型: 0目录 1菜单 2外链
  name: string; //菜单名称
  path: string; //菜单路径
  title: string; //菜单标题
  icon: string; //菜单图标
  sort: number; //排序
  showParent: boolean; //是否显示父菜单
  showLink: boolean; //是否显示该菜单
  keepAlive: boolean; //是否缓存
  parentId: number; //父级ID
  parentTitle: string; //父级菜单标题
  redirect: string; //重定向
  component: string; //组件路径
  frameSrc: string; //内嵌地址
  url: string; //外部链接
  status: number; //状态: 0禁用 1启用
  createdAt: Date; //创建时间
  updatedAt: Date; //更新时间
};

export type MenuOneResult = {
  success: boolean;
  code: number;
  message: string;
  data: MenuModel;
};

export type MenuListRequest = {
  page: number;
  size: number;
  status?: number;
};

export type MenuListResult = {
  success: boolean;
  code: number;
  message: string;
  data: {
    list: MenuModel[];
    total: number;
  };
};

export type MenuCreateRequest = {
  type: number;
  name: string;
  path: string;
  title: string;
  icon: string;
  sort: number;
  showParent: boolean;
  showLink: boolean;
  keepAlive: boolean;
  parentId: number;
  redirect: string;
  component: string;
  frameSrc: string;
  url: string;
  status: number;
};

export type MenuUpdateRequest = {
  id: number;
  type: number;
  name: string;
  path: string;
  title: string;
  icon: string;
  sort: number;
  showParent: boolean;
  showLink: boolean;
  keepAlive: boolean;
  parentId: number;
  redirect: string;
  component: string;
  frameSrc: string;
  url: string;
  status: number;
};

// 获取菜单详情
export const getMenuOne = (params: { id: number }) => {
  return http.request<MenuOneResult>("get", baseUrlApi("menu/one"), { params });
};

// 获取菜单列表
export const getMenuList = (params: MenuListRequest) => {
  return http.request<MenuListResult>("get", baseUrlApi("menu/list"), {
    params
  });
};

// 创建菜单
export const createMenu = (data: MenuCreateRequest) => {
  return http.request<Result>("post", baseUrlApi("menu/create"), { data });
};

// 更新菜单
export const updateMenu = (data: MenuUpdateRequest) => {
  return http.request<Result>("put", baseUrlApi("menu/update"), { data });
};

// 删除菜单
export const deleteMenu = (data: { id: number }) => {
  return http.request<Result>("delete", baseUrlApi("menu/delete"), { data });
};
