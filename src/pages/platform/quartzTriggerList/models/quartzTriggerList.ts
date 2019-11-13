import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { loadQuartzTrigger,removeQuartzTrigger } from '../service';

import { TableListData } from '../data';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface QuartzTriggerListModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    remove: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const QuartzTriggerListModel: QuartzTriggerListModelType = {
  namespace: 'quartzTriggerList',

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
    *remove({ payload, callback }, { call, put }) {
      yield call(removeQuartzTrigger, payload);
      const response = yield call(loadQuartzTrigger);
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

export default QuartzTriggerListModel;
