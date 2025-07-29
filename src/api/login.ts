import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: any;
};

/** 账号登录请求 */
export type AccountLoginRequest = {
  username: string; // 用户名
  password: string; // 密码
  captchaId?: string; // 验证码ID
  captcha?: string; // 验证码
  isRemembered?: boolean; // 是否记住密码
};

/** 登录统一返回 */
export type LoginResult = {
  success: boolean;
  code: number;
  message: string;
  data: {
    uid: string; // 用户ID
    username: string; // 用户名
    token: string; // 登录token
    expires: number; // 登录过期时间
    refreshToken: string; // 刷新token
  };
};

/** 登录配置 */
export type LoginConfigResult = {
  success: boolean;
  code: number;
  message: string;
  data: {
    registerSwitch: boolean; // 注册开关
    captchaSwitch: boolean; // 验证码开关
    captchaType: number; // 验证码类型
    protocol: string; // 协议
    policy: string; // 政策
  };
};

/** 登录验证码 */
export type LoginCaptchaResult = {
  success: boolean;
  code: number;
  message: string;
  data: {
    cid: string; // 验证码ID
    base64: string; // 验证码
  };
};

/** 刷新token请求 */
export type RefreshTokenRequest = {
  refreshToken: string; // 刷新token
};

/** 刷新token返回 */
export type RefreshTokenResult = {
  success: boolean;
  code: number;
  message: string;
  data: {
    token: string; // 登录token
    expires: number; // 登录过期时间
    refreshToken: string; // 刷新token
  };
};

/** 获取登录验证码 */
export const getLoginCaptcha = () => {
  return http.request<LoginCaptchaResult>("get", baseUrlApi("login/captcha"));
};

/** 获取登录配置 */
export const getLoginConfig = () => {
  return http.request<LoginConfigResult>("get", baseUrlApi("login/config"));
};

/** 注销登录 */
export const logout = () => {
  return http.request<Result>("post", baseUrlApi("login/logout"));
};

/** 账号登录 */
export const accountLogin = (data: AccountLoginRequest) => {
  return http.request<LoginResult>("post", baseUrlApi("login/accountLogin"), {
    data
  });
};

/** 刷新token */
export const refreshToken = (data: RefreshTokenRequest) => {
  return http.request<RefreshTokenResult>(
    "post",
    baseUrlApi("login/refreshToken"),
    {
      data
    }
  );
};
