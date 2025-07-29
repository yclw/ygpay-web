import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: any;
};

// 获取用户详情
export const getMemberOne = (data: any) => {
  return http.request<Result>("get", baseUrlApi("member/one"), { data });
};

// 获取用户列表
export const getMemberList = (data: any) => {
  return http.request<Result>("get", baseUrlApi("member/list"), { data });
};

// 创建用户
export const createMember = (data: any) => {
  return http.request<Result>("post", baseUrlApi("member/create"), { data });
};

// 更新用户
export const updateMember = (data: any) => {
  return http.request<Result>("put", baseUrlApi("member/update"), { data });
};

// 删除用户
export const deleteMember = (data: any) => {
  return http.request<Result>("delete", baseUrlApi("member/delete"), { data });
};
