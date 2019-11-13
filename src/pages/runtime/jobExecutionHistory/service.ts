import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryJobExecutionHistory(params: TableListParams) {
  return request('/jobHistory/load', {
    params,
  });
}
