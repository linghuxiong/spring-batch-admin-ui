import { Request, Response } from 'express';
import { parse } from 'url';
import { TableListItem, TableListParams } from './data';
import _ from 'lodash';

// mock tableListDataSource
let tableListDataSource: TableListItem[] = [];

for (let i = 1; i < 21; i += 1) {
  tableListDataSource.push({
    key: i,
    name: `Trigger ${i}`,
    cronExpression:'',
    timeInterval:1000,
    status: Math.floor(Math.random() * 10) % 2,
    updatedAt: new Date(`2019-10-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(),
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
    const status = params.status.split(',');
    let filterDataSource: TableListItem[] = [];
    status.forEach((s: string) => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(item => {
          if (parseInt(`${item.status}`, 10) === parseInt(s.split('')[0], 10)) {
            return true;
          }
          return false;
        }),
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
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

  const body = (b && b.body) || req.body;
  const { method, name, cronExpression, timeInterval, createdAt, key, status} = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => (!_.isEqual(key,item.key)));
      break;
    case 'post':
      if(key){
        tableListDataSource = tableListDataSource.map(item => {
          if (item.key === key) {
            item.name = name;
            item.cronExpression = cronExpression;
            item.timeInterval = timeInterval;
            item.createdAt = createdAt;
            item.updatedAt = new Date();
          }
          return item;
        });
      }else{
        const i = Math.ceil(Math.random() * 10000);
        tableListDataSource.unshift({
          key: i,
          name: name,
          cronExpression:cronExpression,
          timeInterval:timeInterval,
          status: status,
          updatedAt: createdAt,
          createdAt: createdAt,
        });
      }
      break;
    case 'stopped':
        tableListDataSource = tableListDataSource.map(item => {
          if (item.key === key) {
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
  'GET /api/trigger': getRule,
  'POST /api/trigger': postRule,
};
