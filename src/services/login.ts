import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
  grant_type:string;
  client_id:string;
  client_secret:string;
}
export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/batch/oauth/token', {
    method: 'GET',
    params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
