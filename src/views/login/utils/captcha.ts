import { ref } from "vue";
import {
  getLoginConfig,
  getLoginCaptcha,
  type LoginConfigResult,
  type LoginCaptchaResult
} from "@/api/login";
import { message } from "@/utils/message";

export interface CaptchaState {
  captchaSwitch: boolean; // 验证码开关
  captchaData: {
    cid: string; // 验证码ID
    base64: string; // 验证码图片base64
  };
  loading: boolean; // 加载状态
}

/**
 * 验证码相关逻辑
 */
export function useCaptcha() {
  // 验证码状态
  const captchaState = ref<CaptchaState>({
    captchaSwitch: false,
    captchaData: {
      cid: "",
      base64: ""
    },
    loading: false
  });

  /**
   * 获取登录配置
   */
  const getConfig = async (): Promise<boolean> => {
    try {
      captchaState.value.loading = true;
      const result: LoginConfigResult = await getLoginConfig();

      if (result.success) {
        captchaState.value.captchaSwitch = result.data.captchaSwitch;
        return result.data.captchaSwitch;
      } else {
        message(`获取登录配置失败: ${result.message}`, { type: "error" });
        return false;
      }
    } catch (error) {
      console.error("获取登录配置失败:", error);
      message("获取登录配置失败", { type: "error" });
      return false;
    } finally {
      captchaState.value.loading = false;
    }
  };

  /**
   * 获取验证码
   */
  const getCaptcha = async (): Promise<boolean> => {
    try {
      captchaState.value.loading = true;
      const result: LoginCaptchaResult = await getLoginCaptcha();

      if (result.success) {
        captchaState.value.captchaData = {
          cid: result.data.cid,
          base64: result.data.base64
        };
        return true;
      } else {
        message(`获取验证码失败: ${result.message}`, { type: "error" });
        return false;
      }
    } catch (error) {
      console.error("获取验证码失败:", error);
      message("获取验证码失败", { type: "error" });
      return false;
    } finally {
      captchaState.value.loading = false;
    }
  };

  /**
   * 刷新验证码
   */
  const refreshCaptcha = async (): Promise<void> => {
    if (captchaState.value.captchaSwitch) {
      await getCaptcha();
    }
  };

  /**
   * 初始化验证码
   */
  const initCaptcha = async (): Promise<void> => {
    // 先获取配置
    const needCaptcha = await getConfig();

    // 如果需要验证码，获取验证码图片
    if (needCaptcha) {
      await getCaptcha();
    }
  };

  return {
    captchaState,
    getConfig,
    getCaptcha,
    refreshCaptcha,
    initCaptcha
  };
}
