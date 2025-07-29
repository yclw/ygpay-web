import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  type UserResult,
  // type RefreshTokenResult,
  getLogin
  // refreshTokenApi
} from "@/api/user";
import {
  refreshToken,
  type RefreshTokenResult,
  type RefreshTokenRequest
} from "@/api/login";
import { useMultiTagsStoreHook } from "./multiTags";
import { setToken, removeToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    // 初始化默认值
    avatar: "",
    username: "",
    nickname: "",
    roles: [],
    permissions: [],
    isRemembered: false,
    loginDay: 7,
    // 从localStorage读取用户信息覆盖默认值
    ...storageLocal().getItem<userType>(userKey)
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 设置用户信息 */
    SET_USER_INFO(userInfo: userType) {
      this.avatar = userInfo.avatar || "";
      this.username = userInfo.username || "";
      this.nickname = userInfo.nickname || "";
      this.roles = userInfo.roles || [];
      this.permissions = userInfo.permissions || [];
      if (userInfo.isRemembered !== undefined) {
        this.isRemembered = userInfo.isRemembered;
      }
      if (userInfo.loginDay !== undefined) {
        this.loginDay = userInfo.loginDay;
      }
      // 保存到localStorage
      storageLocal().setItem(userKey, this);
    },
    /** 登入 */
    async loginByUsername(data: UserResult) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(async res => {
            if (res?.success) {
              // 分离处理：先设置token
              setToken(res.data);

              this.SET_USER_INFO(res.data);
            }
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data: RefreshTokenRequest) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshToken(data)
          .then(res => {
            if (res?.success) {
              setToken(res.data);
              resolve(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
