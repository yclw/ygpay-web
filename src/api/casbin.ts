import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  code: number;
  message: string;
  level: string;
  data: any;
};

// 同步角色API到Casbin
export const syncRoleApi = () => {
  return http.request<Result>("post", baseUrlApi("casbin/sync"));
};

// 刷新Casbin Enforcer
export const refreshEnforcer = () => {
  return http.request<Result>("post", baseUrlApi("casbin/refresh"));
};
