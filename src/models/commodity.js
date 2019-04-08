import { commodityList, commodityAdd, commodityEdit } from '@/services/online';

export default {
  namespace: 'commodity',
  state: {
    list: {},
    detail: {},
    status: {},
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
        payload: { errorCallback, number, current },
      },
      { put, call }
    ) {
      const response = yield call(commodityList, { current });
      const {
        data: { list },
      } = response;
      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      if (Number(response.code) === 1) {
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].category_id === Number(number)) {
            yield put({
              type: 'changeCommodityContent',
              payload: {
                attr: 'detail',
                data: list[i],
              },
            });
          }
        }
      }
    },

    // eslint-disable-next-line consistent-return
    *commodityAdd(
      {
        payload: { errorCallback, successCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(commodityAdd, values);
      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      successCallback();
      yield put({
        type: 'changeCommodityContent',
        payload: {
          attr: 'list',
          data: response.data,
        },
      });
    },

    *commodityEdit(
      {
        payload: { successCallback, errorCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(commodityEdit, values);
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
      }
      if (Number(response.code) === 1) {
        successCallback();
        yield put({
          type: 'changeCommodityContent',
          payload: {
            attr: 'list',
            data: response.data,
          },
        });
      }
    },

    // eslint-disable-next-line require-yield
    *updateStatus({ payload }, { put }) {
      put({
        type: 'updateStatus',
        data: payload,
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
