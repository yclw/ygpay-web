import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: any;
};

// 获取角色详情
export const getRoleOne = (data: any) => {
  return http.request<Result>("get", baseUrlApi("role/one"), { data });
};

// 获取角色列表
export const getRoleList = (data: any) => {
  return http.request<Result>("get", baseUrlApi("role/list"), { data });
};

// 创建角色
export const createRole = (data: any) => {
  return http.request<Result>("post", baseUrlApi("role/create"), { data });
};

// 更新角色
export const updateRole = (data: any) => {
  return http.request<Result>("put", baseUrlApi("role/update"), { data });
};

// 删除角色
export const deleteRole = (data: any) => {
  return http.request<Result>("delete", baseUrlApi("role/delete"), { data });
};
