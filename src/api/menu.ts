import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: any;
};

// 获取菜单详情
export const getMenuOne = (data: any) => {
  return http.request<Result>("get", baseUrlApi("menu/one"), { data });
};

// 获取菜单列表
export const getMenuList = (data: any) => {
  return http.request<Result>("get", baseUrlApi("menu/list"), { data });
};

// 创建菜单
export const createMenu = (data: any) => {
  return http.request<Result>("post", baseUrlApi("menu/create"), { data });
};

// 更新菜单
export const updateMenu = (data: any) => {
  return http.request<Result>("put", baseUrlApi("menu/update"), { data });
};

// 删除菜单
export const deleteMenu = (data: any) => {
  return http.request<Result>("delete", baseUrlApi("menu/delete"), { data });
};
