import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: any;
};

export type RoleModel = {
  id: number;
  parentId: number;
  parentName: string;
  name: string;
  key: string;
  remark: string;
  status: number;
  sort: number;
  createdAt: Date;
  updatedAt: Date;
  children?: RoleModel[];
};

export type RoleOneResult = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: RoleModel;
};

export type RoleListResult = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: {
    list: RoleModel[];
    tree: RoleModel[];
  };
};

export type RoleCreateRequest = {
  parentId: number;
  name: string;
  key: string;
  remark: string;
  status: number;
  sort: number;
};

export type RoleUpdateRequest = {
  id: number;
  parentId: number;
  name: string;
  key: string;
  remark: string;
  status: number;
  sort: number;
};

export type RoleMenuModel = {
  menuUid: string;
  title: string;
  use: boolean;
  children?: RoleMenuModel[];
};

export type RoleMenuResult = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: {
    tree: RoleMenuModel[];
  };
};

export type RoleMenuUpdateRequest = {
  id: number;
  menuList: string[];
};

export type RoleApiModel = {
  apiUid: string;
  path: string;
  method: string;
  use: boolean;
};

export type ApiGroupModel = {
  groupName: string;
  children: RoleApiModel[];
};

export type RoleApiResult = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: {
    apiList: ApiGroupModel[];
  };
};

export type RoleApiUpdateRequest = {
  id: number;
  apiList: string[];
};

// 获取角色详情
export const getRoleOne = (params: { id: number }) => {
  return http.request<RoleOneResult>("get", baseUrlApi("role/one"), { params });
};

// 获取角色列表
export const getRoleList = () => {
  return http.request<RoleListResult>("get", baseUrlApi("role/list"));
};

// 创建角色
export const createRole = (data: RoleCreateRequest) => {
  return http.request<Result>("post", baseUrlApi("role/create"), { data });
};

// 更新角色
export const updateRole = (data: RoleUpdateRequest) => {
  return http.request<Result>("put", baseUrlApi("role/update"), { data });
};

// 删除角色
export const deleteRole = (data: { id: number }) => {
  return http.request<Result>("delete", baseUrlApi("role/delete"), { data });
};

// 获取角色菜单权限
export const getRoleMenu = (params: { id: number }) => {
  return http.request<RoleMenuResult>("get", baseUrlApi("role/menu/get"), {
    params
  });
};

// 获取角色api权限
export const getRoleApi = (params: { id: number }) => {
  return http.request<RoleApiResult>("get", baseUrlApi("role/api/get"), {
    params
  });
};

// 更新角色菜单权限
export const updateRoleMenu = (data: RoleMenuUpdateRequest) => {
  return http.request<RoleMenuResult>("post", baseUrlApi("role/menu/update"), {
    data
  });
};

// 更新角色api权限
export const updateRoleApi = (data: RoleApiUpdateRequest) => {
  return http.request<RoleApiResult>("post", baseUrlApi("role/api/update"), {
    data
  });
};
