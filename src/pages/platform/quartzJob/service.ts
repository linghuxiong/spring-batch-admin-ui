import request from '@/utils/request';
import { TableListParams } from './data';

export async function loadQuartzTrigger(params: TableListParams) {
  return request('/batch-admin/quartz/job/load', {
    params,
  });
}
