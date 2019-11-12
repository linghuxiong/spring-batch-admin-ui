import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryJob,saveJob,removeJob,toggleStatus} from '../service';

import { TableListData } from '../data';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface JobListModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    saveJob: Effect;
    remove: Effect;
    toggleStatus: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const JobListModel: JobListModelType = {
  namespace: 'jobList',

  state: {
    data: {
      content: [],
      pageable: {},
      totalElements:0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryJob, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *saveJob({ payload, callback }, { call, put }) {
      yield call(saveJob, payload);
      const response = yield call(queryJob);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeJob, payload);
      const response = yield call(queryJob);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *toggleStatus({payload, callback},{call, put}){
      yield call(toggleStatus, payload);
      const response = yield call(queryJob);
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

export default JobListModel;
