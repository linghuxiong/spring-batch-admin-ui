import request from '@/utils/request';
import { TableListParams } from './data';

export async function loadBatchJob(params: TableListParams) {
  return request('/batch/load', {
    params,
  });
}

export async function stopBatchJob(params: TableListParams) {
  return request('/batch/stop', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
