import { orderList } from '@/services/online';

export default {
  namespace: 'order',
  state: {
    list: {},
    status: {},
  },

  effects: {
    *orderList(
      {
        payload: { errorCallback, ...payload },
      },
      { put, call }
    ) {
      const response = yield call(orderList, payload);
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
      }
      yield put({
        type: 'changeOrdrList',
        payload: {
          attr: 'list',
          data: response.data,
        },
      });
    },

    // eslint-disable-next-line require-yield
    *updateStatus({ payload }, { put }) {
      put({
        type: 'updateStatus',
        payload,
      });
    },
  },

  reducers: {
    changeOrdrList(
      state,
      {
        payload: { attr, data },
      }
    ) {
      return {
        ...state,
        [attr]: data,
      };
    },

    updateStatus(state, { payload }) {
      return {
        ...state,
        status: { ...state.status, ...payload },
      };
    },
  },
};
