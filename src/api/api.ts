import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: any;
};

// 获取api详情
export const getApiOne = (data: any) => {
  return http.request<Result>("get", baseUrlApi("api/one"), { data });
};

// 获取api列表
export const getApiList = (data: any) => {
  return http.request<Result>("get", baseUrlApi("api/list"), { data });
};

// 创建api
export const createApi = (data: any) => {
  return http.request<Result>("post", baseUrlApi("api/create"), { data });
};

// 更新api
export const updateApi = (data: any) => {
  return http.request<Result>("put", baseUrlApi("api/update"), { data });
};

// 删除api
export const deleteApi = (data: any) => {
  return http.request<Result>("delete", baseUrlApi("api/delete"), { data });
};
