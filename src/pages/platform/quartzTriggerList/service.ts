import request from '@/utils/request';
import { TableListParams } from './data';

export async function loadQuartzTrigger(params: TableListParams) {
  return request('/quartz/load', {
    params,
  });
}

export async function pauseQuartzTrigger(params: TableListParams) {
  return request('/quartz/pause', {
    method: 'POST',
    params,
  });
}

export async function resumeQuartzTrigger(params: TableListParams) {
  return request('/quartz/resume', {
    method: 'POST',
    params,
  });
}
