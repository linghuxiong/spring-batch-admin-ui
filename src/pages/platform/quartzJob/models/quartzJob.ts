import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { loadQuartzTrigger } from '../service';

import { TableListData } from '../data';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface QuartzJobModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const QuartzJobModel: QuartzJobModelType = {
  namespace: 'quartzJob',

  state: {
    data: {
      content: [],
      pageable: {},
      totalElements:0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(loadQuartzTrigger, payload);
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

export default QuartzJobModel;
