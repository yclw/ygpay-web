import CryptoJS from "crypto-js";

/**
 * AES ECB 加密
 * @param text 要加密的文本
 * @param key 加密密钥
 * @returns 加密后的base64字符串
 */
export function AesECBEncrypt(text: string, key: string): string {
  try {
    // 将密钥转换为 CryptoJS 格式
    const secretKey = CryptoJS.enc.Utf8.parse(key);

    // 对文本进行加密
    const encrypted = CryptoJS.AES.encrypt(text, secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    // 返回 base64 编码的密文
    return encrypted.toString();
  } catch (error) {
    console.error("AES ECB 加密失败:", error);
    throw new Error("密码加密失败");
  }
}

/**
 * AES ECB 解密
 * @param encryptedText 加密的base64字符串
 * @param key 解密密钥
 * @returns 解密后的原文
 */
export function AesECBDecrypt(encryptedText: string, key: string): string {
  try {
    // 将密钥转换为 CryptoJS 格式
    const secretKey = CryptoJS.enc.Utf8.parse(key);

    // 对密文进行解密
    const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    // 返回 UTF-8 编码的原文
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("AES ECB 解密失败:", error);
    throw new Error("密码解密失败");
  }
}

/**
 * 获取默认加密密钥
 * @returns 默认加密密钥
 */
export function getDefaultEncryptKey(): string {
  return "f080a463654b2279";
}
