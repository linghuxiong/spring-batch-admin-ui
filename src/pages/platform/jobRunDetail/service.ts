import request from '@/utils/request';
import { TableListParams } from './data';

export async function loadBatchJob(params: TableListParams) {
  return request('/batch/spring-batch/load', {
    params,
  });
}

export async function stopBatchJob(params: TableListParams) {
  return request('/batch/spring-batch/stop', {
    method: 'POST',
    params,
  });
}

export async function abandonBatchJob(params: TableListParams) {
  return request('/batch/spring-batch/abandon', {
    method: 'POST',
    params,
  });
}

export async function restartBatchJob(params: TableListParams) {
  return request('/batch/spring-batch/restart', {
    method: 'POST',
    params,
  });
}

export async function startNextInstanceBatchJob(params: TableListParams) {
  return request('/batch/spring-batch/startNextInstance', {
    method: 'POST',
    params,
  });
}
