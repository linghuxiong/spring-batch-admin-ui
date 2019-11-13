import request from '@/utils/request';
import { TableListParams } from './data';

export async function loadQuartzTrigger(params: TableListParams) {
  return request('/quartz/load', {
    params,
  });
}

export async function removeQuartzTrigger(params: TableListParams) {
  return request('/quartz/delete', {
    method: 'POST',
    params,
  });
}
