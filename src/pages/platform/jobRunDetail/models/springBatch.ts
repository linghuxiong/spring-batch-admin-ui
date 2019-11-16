import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { loadBatchJob, stopBatchJob, abandonBatchJob, restartBatchJob, startNextInstanceBatchJob } from '../service';

import { TableListData } from '../data';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface JobRunDetailModelType {
  namespace: string;
  state: StateType;
  effects: {
    load: Effect;
    stop: Effect;
    abandon: Effect;
    restart: Effect;
    startNextInstance: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const JobRunDetailModel: JobRunDetailModelType = {
  namespace: 'springBatch',

  state: {
    data: {
      content: [],
      pageable: {},
      totalElements: 0,
    },
  },

  effects: {
    *load({ payload }, { call, put }) {
      const response = yield call(loadBatchJob, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *stop({ payload, callback }, { call, put }) {
      yield call(stopBatchJob, payload);
      const response = yield call(loadBatchJob, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *abandon({ payload, callback }, { call, put }) {
      yield call(abandonBatchJob, payload);
      const response = yield call(loadBatchJob, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *restart({ payload, callback }, { call, put }) {
      yield call(restartBatchJob, payload);
      const response = yield call(loadBatchJob, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *startNextInstance({ payload, callback }, { call, put }) {
      yield call(startNextInstanceBatchJob, payload);
      const response = yield call(loadBatchJob, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default JobRunDetailModel;
