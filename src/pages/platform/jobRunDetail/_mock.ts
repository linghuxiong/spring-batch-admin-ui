import { Request, Response } from 'express';
import { parse } from 'url';
import { TableListItem, TableListParams } from './data';

// mock tableListDataSource
let tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 12; i += 1) {
  tableListDataSource.push({
    key: i,
    disabled: i % 6 === 0,
    href: 'https://ant.design',
    name: `TradeCode ${i}`,
    status: Math.floor(Math.random() * 10) % 8,
    runNum:Math.floor(Math.random() * 100),
    version:Math.floor(Math.random() * 10),
    exitCode:'COMPLETED',
    exitMessage:'',
    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    endAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    startAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`)
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
  const { method, name, desc, key } = body;

  switch (method) {
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          item.status = 3;
          return { ...item, desc, name };
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
  'GET /api/jobDetail': getRule,
  'POST /api/jobDetail': postRule,
};
