import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/userApi/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/userApi/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
