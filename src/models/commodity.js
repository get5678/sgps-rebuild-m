import { commodityList, commodityDetail } from '@/services/online';

export default {
  namespace: 'commodity',
  state: {
    list: {},
    detail: {},
  },

  effects: {
    // eslint-disable-next-line consistent-return
    *commodityList(
      {
        payload: { errorCallback, ...payload },
      },
      { call, put }
    ) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, val] of Object.entries(payload)) {
        if (!val) {
          Reflect.deleteProperty(payload, key);
        }
      }
      const response = yield call(commodityList, payload);
      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      yield put({
        type: 'changeCommodityContent',
        payload: {
          attr: 'list',
          data: response.data,
        },
      });
    },
    // eslint-disable-next-line consistent-return
    *commodityDetail(
      {
        payload: { errorCallback, number },
      },
      { put, call }
    ) {
      const response = yield call(commodityDetail, number);
      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      yield put({
        type: 'changeCommodityContent',
        payload: {
          attr: 'detail',
          data: response.data,
        },
      });
    },
  },

  reducers: {
    changeCommodityContent(
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
