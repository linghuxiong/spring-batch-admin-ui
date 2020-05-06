import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryTrigger(params: TableListParams) {
  return request('/batch/trigger/load', {
    params,
  });
}

export async function removeTrigger(params: TableListParams) {
  return request('/batch/trigger/delete', {
    method: 'POST',
    params,
  });
}

export async function saveTrigger(params: TableListParams) {
  return request('/batch/trigger/save', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function toggleTriggerStatus(params: TableListParams) {
  return request('/batch/trigger/toggleStatus', {
    method: 'POST',
    params,
  });
}
