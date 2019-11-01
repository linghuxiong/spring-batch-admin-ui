import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryRule(params: TableListParams) {
  return request('/api/quartz', {
    params,
  });
}

export async function removeRule(params: TableListParams) {
  return request('/api/quartz', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}
