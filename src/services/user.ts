import request from '@/utils/request';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query(): Promise<any> {
  return request('/batch/userApi/users');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryCurrent(): Promise<any> {
  return request('/batch/userApi/currentUser');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryNotices(): Promise<any> {
  return request('/batch/noticeApi/notices');
}
