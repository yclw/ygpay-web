import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

/////////// 准备移除 //////////////

export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    token: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: number;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/login", { data });
};

/////////// 更改 //////////////

// 获取用户信息返回
export type UserInfoResult = {
  success: boolean;
  data: {
    // 用户UID
    uid: string;
    // 昵称
    nickname: string;
    // 所属角色
    roleId: number;
    // 权限信息
    permissions: Array<string>;
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
    // 登录次数
    loginCount: number;
    // 最后登录时间
    lastLoginAt: Date;
    // 最后登录IP
    lastLoginIp: string;
  };
};

// 获取用户信息
export const getUserInfo = () => {
  return http.request<UserInfoResult>("get", baseUrlApi("user/info"));
};
