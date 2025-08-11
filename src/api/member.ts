import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: any;
};

export type MemberModel = {
  uid: string;
  roleName: string;
  username: string;
  nickname: string;
  avatar: string;
  sex: number;
  email: string;
  mobile: string;
  address: string;
  lastActiveAt: Date;
  remark: string;
  sort: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
};

export type MemberOneResult = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: MemberModel;
};

export type MemberListRequest = {
  page: number;
  size: number;
  username?: string;
  nickname?: string;
  email?: string;
  mobile?: string;
  sex?: number;
  status?: number;
  startDate?: Date;
  endDate?: Date;
  sortField?: string;
  sortDesc?: boolean;
};

export type MemberListResult = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: {
    list: MemberModel[];
    total: number;
  };
};

export type MemberCreateRequest = {
  username: string;
  nickname: string;
  password: string;
  roleUid: string;
  avatar: string;
  sex: number;
  email: string;
  mobile: string;
  address: string;
  remark: string;
  sort: number;
  status: number;
};

export type MemberUpdateRequest = {
  uid: string;
  username: string;
  nickname: string;
  avatar: string;
  sex: number;
  email: string;
  mobile: string;
  address: string;
  remark: string;
  sort: number;
  status: number;
  password?: string;
  roleUid: string;
};

// 获取用户详情
export const getMemberOne = (params: { uid: string }) => {
  return http.request<MemberOneResult>("get", baseUrlApi("member/one"), {
    params
  });
};

// 获取用户列表
export const getMemberList = (params: MemberListRequest) => {
  return http.request<MemberListResult>("get", baseUrlApi("member/list"), {
    params
  });
};

// 创建用户
export const createMember = (data: MemberCreateRequest) => {
  return http.request<Result>("post", baseUrlApi("member/create"), { data });
};

// 更新用户
export const updateMember = (data: MemberUpdateRequest) => {
  return http.request<Result>("put", baseUrlApi("member/update"), { data });
};

// 删除用户
export const deleteMember = (data: { uid: string }) => {
  return http.request<Result>("delete", baseUrlApi("member/delete"), { data });
};
