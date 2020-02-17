import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryTrigger(params: TableListParams) {
  return request('/batch-admin/trigger/load', {
    params,
  });
}

export async function removeTrigger(params: TableListParams) {
  return request('/batch-admin/trigger/delete', {
    method: 'POST',
    params,
  });
}

export async function saveTrigger(params: TableListParams) {
  return request('/batch-admin/trigger/save', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function toggleTriggerStatus(params: TableListParams) {
  return request('/batch-admin/trigger/toggleStatus', {
    method: 'POST',
    params,
  });
}
