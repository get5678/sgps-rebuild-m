import { shopList, shopExame, shopEdit } from '@/services/online';

export default {
  namespace: 'shop',
  state: {
    list: {},
    detail: {},
    status: {},
  },

  effects: {
    // eslint-disable-next-line consistent-return
    *shopList(
      {
        payload: { errorCallback, ...payload },
      },
      { put, call }
    ) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, val] of Object.entries(payload)) {
        if (!val) {
          Reflect.deleteProperty(payload, key);
        }
      }
      const response = yield call(shopList, payload);
      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      yield put({
        type: 'changeOrderContent',
        payload: {
          attr: 'list',
          data: response.data,
        },
      });
    },

    *shopDetail(
      {
        payload: { number, current, errorCallback },
      },
      { put, call }
    ) {
      const response = yield call(shopList, { current });
      const {
        data: { list },
      } = response;
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
      }
      if (Number(response.code) === 1) {
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].admin_id === Number(number)) {
            yield put({
              type: 'changeOrderContent',
              payload: {
                attr: 'detail',
                data: list[i],
              },
            });
          }
        }
      }
    },

    *shopEdit(
      {
        payload: { errorCallback, successCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(shopEdit, values);
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
      } else {
        successCallback();
        yield put({
          type: 'changeOrderContent',
          payload: {
            attr: 'list',
            data: response.data,
          },
        });
      }
    },

    *shopExame(
      {
        payload: { errorCallback, successCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(shopExame, values);
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
      }
      if (Number(response.code) === 1) {
        successCallback();
        yield put({
          type: 'changeOrderContent',
          payload: {
            attr: 'list',
            data: response.data,
          },
        });
      }
    },

    // eslint-disable-next-line require-yield
    *updataStatus({ payload }, { put }) {
      put({
        type: 'updataStatus',
        payload,
      });
    },
  },

  reducers: {
    changeOrderContent(
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
    updataStatus(state, { payload }) {
      return {
        ...state,
        status: { ...state.status, ...payload },
      };
    },
  },
};
