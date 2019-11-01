import { Request, Response } from 'express';
import { parse } from 'url';
import { TableListItem, TableListParams } from './data';
import _ from 'lodash';

// mock tableListDataSource
let tableListDataSource: TableListItem[] = [];

for (let i = 1; i < 21; i += 1) {
  let type:number = Math.floor(Math.random() * 10) % 4;
  tableListDataSource.push({
    id: i,
    name: `Job ${i}`,
    type:type,
    estimatedTime:1000,
    triggerName:(type==0)?'':`Trigger ${i}`,
    springJobName:`Trigger ${i}`,
    status: Math.floor(Math.random() * 10) % 2,
    updatedAt: new Date(`2019-10-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(),
    params:{},
    callbachUrl:'',
    jobDesc:'',
  });
}

function getRule(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as TableListParams;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    
    dataSource = dataSource.filter(data => _.toInteger(params.status) === _.toInteger(data.status));
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  if (params.type) {
    dataSource = dataSource.filter(data => _.toInteger(params.type) === _.toInteger(data.type));
  }

  if (params.springJobName) {
    dataSource = dataSource.filter(data => data.springJobName.indexOf(params.springJobName) > -1);
  }

  if (params.triggerName) {
    dataSource = dataSource.filter(data => data.triggerName.indexOf(params.triggerName) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  return res.json(result);
}

function postRule(req: Request, res: Response, u: string, b: Request) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

          // id: number;
// name: string;
// type: number;
// estimatedTime: number;
// status: number;
// triggerName: string;
// springJobName: string;
// jobDesc: string;
// params:{ [key: string]: string };
// callbachUrl:string;
// updatedAt: Date;
// createdAt: Date;

  const body = (b && b.body) || req.body;
  const { method, name, type, estimatedTime,triggerName,springJobName,jobDesc,params,callbachUrl,createdAt, id, status} = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => (!_.isEqual(id,item.id)));
      break;
    case 'post':
      if(id){
        tableListDataSource = tableListDataSource.map(item => {
          if (item.id === id) {
            item.name = name;
            item.type = type;
            item.estimatedTime = estimatedTime;
            item.triggerName = triggerName;
            item.springJobName = springJobName;
            item.jobDesc = jobDesc;
            item.params = params;
            item.callbachUrl = callbachUrl;
            item.status = status;
            item.createdAt = createdAt;
            item.updatedAt = new Date();
          }
          return item;
        });
      }else{
        const i = Math.ceil(Math.random() * 10000);
        tableListDataSource.unshift({
          id: i,
          name: name,
          type:type,
          estimatedTime:estimatedTime,
          triggerName:triggerName,
          springJobName:springJobName,
          status: status,
          updatedAt: new Date(),
          createdAt: new Date(),
          params:params,
          callbachUrl:callbachUrl,
          jobDesc:jobDesc,
        });
      }
      break;
    case 'stopped':
        tableListDataSource = tableListDataSource.map(item => {
          if (item.id === id) {
            item.status = status;
            item.updatedAt = new Date();
            return item;
          }
          return item;
        });
        break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  return res.json(result);
}

export default {
  'GET /api/job': getRule,
  'POST /api/job': postRule,
};
