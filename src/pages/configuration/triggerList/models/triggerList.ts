import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryTrigger, saveTrigger, removeTrigger, toggleTriggerStatus} from '../service';

import { TableListData } from '../data';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface TriggerListModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    saveTrigger: Effect;
    remove: Effect;
    toggleStatus: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const TriggerList: TriggerListModelType = {
  namespace: 'triggerList',

  state: {
    data: {
      content:[],
      pageable: {},
      totalElements:0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTrigger, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *saveTrigger({ payload, callback }, { call, put }) {
      yield call(saveTrigger, payload);
      const response = yield call(queryTrigger);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeTrigger, payload);
      const response = yield call(queryTrigger);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *toggleStatus({payload, callback},{call, put}){
      yield call(toggleTriggerStatus, payload);
      const response = yield call(queryTrigger);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    }
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

export default TriggerList;
