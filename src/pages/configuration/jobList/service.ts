import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryRule(params: TableListParams) {
  return request('/api/job', {
    params,
  });
}

export async function removeRule(params: TableListParams) {
  return request('/api/job', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/job', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function stoppedJob(params: TableListParams) {
  return request('/api/job', {
    method: 'POST',
    data: {
      ...params,
      method: 'stopped',
    },
  });
}
