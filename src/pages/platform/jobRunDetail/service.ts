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
    params,
  });
}

export async function abandonBatchJob(params: TableListParams) {
  return request('/batch/abandon', {
    method: 'POST',
    params,
  });
}

export async function restartBatchJob(params: TableListParams) {
  return request('/batch/restart', {
    method: 'POST',
    params,
  });
}

export async function startNextInstanceBatchJob(params: TableListParams) {
  return request('/batch/startNextInstance', {
    method: 'POST',
    params,
  });
}
