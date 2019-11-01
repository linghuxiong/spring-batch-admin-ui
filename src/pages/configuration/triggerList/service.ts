import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryRule(params: TableListParams) {
  return request('/api/trigger', {
    params,
  });
}

export async function removeRule(params: TableListParams) {
  return request('/api/trigger', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/trigger', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function stoppedTrigger(params: TableListParams) {
  return request('/api/trigger', {
    method: 'POST',
    data: {
      ...params,
      method: 'stopped',
    },
  });
}
