import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: any;
};

export type MenuModel = {
  id: number;
  pid: number;
  name: string;
  path: string;
  icon: string;
  title: string;
  showParent: boolean;
  component: string;
  noShowingChildren: boolean;
  value: any;
  showTooltip: boolean;
  parentId: number;
  redirect: string;
  description: string;
  sort: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
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
  pid: number;
  name: string;
  path: string;
  icon: string;
  title: string;
  showParent: boolean;
  component: string;
  noShowingChildren: boolean;
  value: any;
  showTooltip: boolean;
  parentId: number;
  redirect: string;
  description: string;
  sort: number;
  status: number;
};

export type MenuUpdateRequest = {
  id: number;
  pid: number;
  name: string;
  path: string;
  icon: string;
  title: string;
  showParent: boolean;
  component: string;
  noShowingChildren: boolean;
  value: any;
  showTooltip: boolean;
  parentId: number;
  redirect: string;
  description: string;
  sort: number;
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
