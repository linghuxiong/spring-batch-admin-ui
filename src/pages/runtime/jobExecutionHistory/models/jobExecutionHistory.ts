import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryJobExecutionHistory } from '../service';

import { TableListData } from '../data';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface JobExecutionHistoryModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const JobExecutionHistoryModel: JobExecutionHistoryModelType = {
  namespace: 'jobExecutionHistory',

  state: {
    data: {
      content: [],
      pageable: {},
      totalElements:0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryJobExecutionHistory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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

export default JobExecutionHistoryModel;
