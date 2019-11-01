import { Request, Response } from 'express';
import { parse } from 'url';
import { TableListItem, TableListParams } from './data';
import _ from 'lodash';

// mock tableListDataSource
let tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 12; i += 1) {
  tableListDataSource.push({
    id: i,
    triggerName: `quartzTaskService ${i}`,
    triggerGroup:'DEFAULT',
    jobName:`PrintTimeJob ${i}`,
    jobGroup:'DEFAULT',
    schedName:'clusteredScheduler',
    nextFireTime:new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    prevFireTime:new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    priority:4,
    misFireNum:0,
    triggerStatus: 'WAITING',
    startTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    endTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`)
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

  if (params.triggerName) {
    dataSource = dataSource.filter(data => data.triggerName.indexOf(params.triggerName) > -1);
  }
  if (params.triggerGroup) {
    dataSource = dataSource.filter(data => data.triggerGroup.indexOf(params.triggerGroup) > -1);
  }
  if (params.schedName) {
    dataSource = dataSource.filter(data => data.schedName.indexOf(params.schedName) > -1);
  }
  if (params.jobName) {
    dataSource = dataSource.filter(data => data.jobName.indexOf(params.jobName) > -1);
  }
  if (params.jobGroup) {
    dataSource = dataSource.filter(data => data.jobGroup.indexOf(params.jobGroup) > -1);
  }
  if (params.triggerStatus) {
    dataSource = dataSource.filter(data => _.isEqual(params.triggerStatus,data.triggerStatus));
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
  const { method, id } = body;

  switch (method) {
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => (!_.isEqual(id,item.id)));
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
  'GET /api/quartz': getRule,
  'POST /api/quartz': postRule,
};
