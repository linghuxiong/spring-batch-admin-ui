import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryJob(params: TableListParams) {
  return request('/batch/job/load', {
    params,
  });
}

export async function removeJob(params: TableListParams) {
  return request('/batch/job/delete', {
    method: 'POST',
    params,
  });
}

export async function launch(params: TableListParams) {
  return request('/batch/job/launch', {
    method: 'POST',
    params,
  });
}

export async function saveJob(params: TableListParams) {
  return request('/batch/job/save', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function toggleStatus(params: TableListParams) {
  return request('/batch/job/toggleStatus', {
    method: 'POST',
    params,
  });
}
