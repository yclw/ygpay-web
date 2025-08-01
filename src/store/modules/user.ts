import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import { type UserInfoResult, getUserInfo } from "@/api/user";
import {
  refreshToken,
  type RefreshTokenResult,
  type RefreshTokenRequest,
  accountLogin,
  type LoginResult,
  type AccountLoginRequest
} from "@/api/login";
import { useMultiTagsStoreHook } from "./multiTags";
import {
  setToken,
  setMultipleTabsKey,
  removeToken,
  userKey
} from "@/utils/auth";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    // 初始化默认值
    uid: "",
    nickname: "",
    roleName: "",
    username: "",
    avatar: "",
    sex: 0,
    email: "",
    mobile: "",
    address: "",
    createdAt: new Date(),
    isRemembered: true,
    loginDay: 7,
    // 从localStorage读取用户信息覆盖默认值
    ...storageLocal().getItem<userType>(userKey)
  }),
  actions: {
    /** 存储用户UID */
    SET_UID(uid: string) {
      this.uid = uid;
    },
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
    /** 存储角色名称 */
    SET_ROLE_NAME(roleName: string) {
      this.roleName = roleName;
    },

    /** 存储性别 */
    SET_SEX(sex: number) {
      this.sex = sex;
    },
    /** 存储邮箱 */
    SET_EMAIL(email: string) {
      this.email = email;
    },
    /** 存储手机号 */
    SET_MOBILE(mobile: string) {
      this.mobile = mobile;
    },
    /** 存储地址 */
    SET_ADDRESS(address: string) {
      this.address = address;
    },
    /** 存储创建时间 */
    SET_CREATED_AT(createdAt: Date) {
      this.createdAt = createdAt;
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
      this.uid = userInfo.uid || "";
      this.nickname = userInfo.nickname || "";
      this.roleName = userInfo.roleName || "";
      this.username = userInfo.username || "";
      this.avatar = userInfo.avatar || "";
      this.sex = userInfo.sex || 0;
      this.email = userInfo.email || "";
      this.mobile = userInfo.mobile || "";
      this.address = userInfo.address || "";
      this.createdAt = userInfo.createdAt || new Date();
      if (userInfo.isRemembered !== undefined) {
        this.isRemembered = userInfo.isRemembered;
      }
      if (userInfo.loginDay !== undefined) {
        this.loginDay = userInfo.loginDay;
      }
      // 保存到localStorage
      storageLocal().setItem(userKey, this);
    },
    /** 获取用户信息 */
    async getUserInfo() {
      return new Promise<UserInfoResult>((resolve, reject) => {
        getUserInfo()
          .then(res => {
            if (res?.success) {
              // 设置用户信息
              this.SET_USER_INFO(res.data);
            }
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 登入 */
    async loginByUsername(data: AccountLoginRequest) {
      return new Promise<LoginResult>((resolve, reject) => {
        accountLogin(data)
          .then(async res => {
            if (res?.success) {
              // 分离处理：先设置token
              setToken(res.data);
              // 每次真正登录时都重新设置多标签页支持
              setMultipleTabsKey();
              // 登录成功后获取用户信息
              await this.getUserInfo();
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
            } else {
              // 刷新token失败，执行登出
              this.logOut();
              reject(res);
            }
          })
          .catch(error => {
            // 刷新token请求失败，执行登出
            this.logOut();
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
