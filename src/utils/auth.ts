import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal, isString, isIncludeAllChildren } from "@pureadmin/utils";

export interface TokenInfo {
  /** token */
  token: string;
  /** `token`的过期时间（时间戳） */
  expires: number;
  /** 用于调用刷新token的接口时所需的token */
  refreshToken: string;
}

export const userKey = "user-info";
export const TokenKey = "authorized-token";
export const TokenStorageKey = "token-info"; // 用于localStorage存储token的key
export const LoginTimeKey = "login-time"; // 用于存储登录时间戳的key
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";

/** 获取`token` */
export function getToken(): TokenInfo {
  // 先尝试从Cookie中获取
  if (Cookies.get(TokenKey)) {
    return JSON.parse(Cookies.get(TokenKey));
  }

  // 如果Cookie中没有，尝试从localStorage中获取（用于"记住我"功能）
  const tokenFromStorage = storageLocal().getItem<TokenInfo>(TokenStorageKey);
  if (tokenFromStorage) {
    // 检查"记住我"是否已过期
    const loginTime = storageLocal().getItem<number>(LoginTimeKey);
    const { loginDay } = useUserStoreHook();

    if (loginTime && (Date.now() - loginTime) / 86400000 > loginDay) {
      // 如果超过设定天数，清除所有信息，要求重新登录
      removeToken();
      return null;
    }

    // 从localStorage恢复后，重新设置到Cookie中
    setToken(tokenFromStorage);
    Cookies.set(multipleTabsKey, "true", { expires: loginDay });
    return tokenFromStorage;
  }

  return null;
}

/**
 * @description 设置`token`信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`token`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`token`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`token`的过期时间（比如2小时））、`expires`（`token`的过期时间）
 * 将`token`、`expires`、`refreshToken`这三条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 如果用户选择"记住我"，同时将token信息存储在localStorage中
 */
export function setToken(data: TokenInfo) {
  const { expires } = data;
  const { isRemembered } = useUserStoreHook();
  const cookieString = JSON.stringify(data);

  // 设置Cookie
  expires > 0
    ? Cookies.set(TokenKey, cookieString, {
        expires: (expires - Date.now()) / 86400000
      })
    : Cookies.set(TokenKey, cookieString);

  // 如果用户选择了"记住我"，将token信息也存储在localStorage中
  if (isRemembered) {
    storageLocal().setItem(TokenStorageKey, data);
  }
}

/**
 * @description 设置多标签页支持标识和登录时间戳
 * 只在真正登录时调用，用于支持多标签页打开已登录的系统和控制"记住我"过期时间
 */
export function setMultipleTabsKey() {
  const { isRemembered, loginDay } = useUserStoreHook();

  // 设置多标签页支持
  Cookies.set(multipleTabsKey, "true", { expires: loginDay });

  // 如果选择了"记住我"，记录登录时间戳用于控制总体过期时间
  if (isRemembered) {
    storageLocal().setItem(LoginTimeKey, Date.now());
  }
}

/** 删除`token`以及相关信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
  storageLocal().removeItem(TokenStorageKey);
  storageLocal().removeItem(LoginTimeKey); // 同时清除登录时间戳
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false;
  const allPerms = "*:*:*";
  const { permissions } = useUserStoreHook();
  if (!permissions) return false;
  if (permissions.length === 1 && permissions[0] === allPerms) return true;
  const isAuths = isString(value)
    ? permissions.includes(value)
    : isIncludeAllChildren(value, permissions);
  return isAuths ? true : false;
};
