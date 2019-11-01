import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryRule(params: TableListParams) {
  return request('/api/jobDetail', {
    params,
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/jobDetail', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
