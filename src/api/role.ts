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
};

export type RoleOneResult = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: RoleModel;
};

export type RoleListRequest = {
  page: number;
  size: number;
  name?: string;
  key?: string;
  status?: number;
  startDate?: Date;
  endDate?: Date;
  sortField?: string;
  sortDesc?: boolean;
};

export type RoleListResult = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: {
    list: RoleModel[];
    total: number;
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

// 获取角色详情
export const getRoleOne = (params: { id: number }) => {
  return http.request<RoleOneResult>("get", baseUrlApi("role/one"), { params });
};

// 获取角色列表
export const getRoleList = (params: RoleListRequest) => {
  return http.request<RoleListResult>("get", baseUrlApi("role/list"), {
    params
  });
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
