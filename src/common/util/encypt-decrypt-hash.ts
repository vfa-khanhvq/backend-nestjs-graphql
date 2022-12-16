import * as CryptoJS from 'crypto-js';

const textkey = CryptoJS.enc.Base64.parse(process.env.KEY_AES);
/**
 * Encrypt the data with AES encryption
 * @param data
 * @returns Encrypted string
 * @author KhanhVQ
 */
export const encryptAES = (data) => {
  return CryptoJS.AES.encrypt(data, textkey, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: CryptoJS.enc.Hex.parse('0000000000000000'),
  }).toString();
};

/**
 * Decrypt the cipher text with AES decryption
 * @param ciphertext Encrypted string
 * @returns Decrypted string with UTF8 format
 * @author KhanhVQ
 */
export const decryptAES = (ciphertext) => {
  return CryptoJS.AES.decrypt(ciphertext, textkey, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: CryptoJS.enc.Hex.parse('0000000000000000'),
  }).toString(CryptoJS.enc.Utf8);
};

/**
 * Create variable mac in API header
 * @param timestamp the number of milliseconds since Unix epoch
 * @param nonce the random string
 * @param method the method of API
 * @param uri the uri of API
 * @param hostname the hostname where send API
 * @param port the api port
 * @returns the variable mac
 * @author BaoPG
 */
export const createMac = (
  timestamp: string,
  nonce: string,
  method: string,
  uri: string,
  hostname: string,
  port: string,
) => {
  const macString = `${timestamp}\n${nonce}\n${method}\n${uri}\n${hostname}\n${port}\n\n`;
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(macString, process.env.CLIENT_KEY),
  );
};

/**
 * Create variable nonce for API header and create mac
 * @param timestamp the number of milliseconds since Unix epoch
 * @param accessToken
 * @returns the variable nonce
 * @author BaoPG
 */
export const createNonce = () => {
  let nonce = '';
  for (let i = 0; i < 10; i++) {
    nonce = nonce + Math.floor(Math.random() * 10).toString();
  }
  return nonce;
};
