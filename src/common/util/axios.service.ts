import axios, { AxiosResponse } from 'axios';
import * as qs from 'qs';
import {
  CALL_MAC_API,
  CALL_EXTERNAL_API,
} from '../../configs/constants/error-code/base';
import { BaseException } from '../../vendors/exceptions/base.exception';
interface MAC {
  accessToken;
  timestamp;
  nonce;
  mac;
}
/**
 * Call OAuth2.0 MAC API
 * @param url
 * @param data
 * @param Mac MAC data contain access token, timestamp, nonce, mac
 * @returns the promise of axios response
 * @author BaoPG
 */
export const callApiWithMAC = async (
  url: string,
  data,
  Mac: MAC,
): Promise<AxiosResponse> => {
  try {
    const Authorization = `MAC id="${Mac.accessToken}" ts="${Mac.timestamp}" nonce="${Mac.nonce}" mac="${Mac.mac}"`;
    return await axios.post(url, qs.stringify(data), {
      headers: {
        'X-API-VERSION': '1',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization,
      },
    });
  } catch (error) {
    throw new BaseException(
      CALL_MAC_API.CODE,
      error?.message || CALL_MAC_API.MESSAGE,
    );
  }
};

/**
 * Call api
 * @param url
 * @param data
 * @returns A promise of axios response
 * @author BaoPG
 */
export const callApi = async (url: string, data): Promise<AxiosResponse> => {
  try {
    return await axios.post(url, qs.stringify(data), {
      headers: {
        'X-API-VERSION': '1',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  } catch (error) {
    throw new BaseException(
      CALL_EXTERNAL_API.CODE,
      error?.message || CALL_EXTERNAL_API.MESSAGE,
    );
  }
};
