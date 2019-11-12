import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryJob(params: TableListParams) {
  return request('/job/load', {
    params,
  });
}

export async function removeJob(params: TableListParams) {
  return request('/job/delete', {
    method: 'POST',
    params,
  });
}

export async function saveJob(params: TableListParams) {
  return request('/job/save', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function toggleStatus(params: TableListParams) {
  return request('/job/toggleStatus', {
    method: 'POST',
    params,
  });
}
