import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { loadBatchJob,stopBatchJob } from '../service';

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
      totalElements:0,
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
      const response = yield call(stopBatchJob, payload);
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
