import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: any;
};

export type ApiModel = {
  id: number;
  name: string;
  path: string;
  method: string;
  groupName: string;
  description: string;
  needAuth: number;
  rateLimit: number;
  sort: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiOneResult = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: ApiModel;
};

export type ApiListRequest = {
  page: number;
  size: number;
  name?: string;
  path?: string;
  method?: string;
  groupName?: string;
  status?: number;
  startDate?: Date;
  endDate?: Date;
  sortField?: string;
  sortDesc?: boolean;
};

export type ApiListResult = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: {
    list: ApiModel[];
    total: number;
  };
};

export type ApiCreateRequest = {
  name: string;
  path: string;
  method: string;
  groupName: string;
  description: string;
  needAuth: number;
  rateLimit: number;
  sort: number;
  status: number;
};

export type ApiUpdateRequest = {
  id: number;
  name: string;
  path: string;
  method: string;
  groupName: string;
  description: string;
  needAuth: number;
  rateLimit: number;
  sort: number;
  status: number;
};

// 获取api详情
export const getApiOne = (params: { id: number }) => {
  return http.request<ApiOneResult>("get", baseUrlApi("api/one"), { params });
};

// 获取api列表
export const getApiList = (params: ApiListRequest) => {
  return http.request<ApiListResult>("get", baseUrlApi("api/list"), { params });
};

// 创建api
export const createApi = (data: ApiCreateRequest) => {
  return http.request<Result>("post", baseUrlApi("api/create"), {
    data
  });
};

// 更新api
export const updateApi = (data: ApiUpdateRequest) => {
  return http.request<Result>("put", baseUrlApi("api/update"), { data });
};

// 删除api
export const deleteApi = (data: { id: number }) => {
  return http.request<Result>("delete", baseUrlApi("api/delete"), { data });
};
