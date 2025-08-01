import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

// 获取用户信息返回
export type UserInfoResult = {
  success: boolean;
  data: {
    // 用户UID
    uid: string;
    // 昵称
    nickname: string;
    // 所属角色
    roleName: string;
    // 用户名
    username: string;
    // 头像
    avatar: string;
    // 性别
    sex: number;
    // 邮箱
    email: string;
    // 手机号码
    mobile: string;
    // 联系地址
    address: string;
    // 创建时间
    createdAt: Date;
  };
};

// 获取用户信息
export const getUserInfo = () => {
  return http.request<UserInfoResult>("get", baseUrlApi("user/info"));
};
