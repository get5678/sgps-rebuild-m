import { couponsList, couponsAdd, couponsEdit } from '@/services/online';

export default {
  namespace: 'coupons',

  state: {
    list: {},
    detail: {},
    status: {},
  },

  effects: {
    // eslint-disable-next-line consistent-return
    *couponsList(
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
      const response = yield call(couponsList, payload);
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

    // eslint-disable-next-line consistent-return
    *couponsDetail(
      {
        payload: { errorCallback, number },
      },
      { put, call }
    ) {
      const res = yield call(couponsList);
      const {
        data: { pageSize },
      } = res;
      const current = Math.ceil(Number(number) / pageSize);
      const response = yield call(couponsList, { current });
      const {
        data: { list },
      } = response;
      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      for (let i = 0; i < list.length; i += 1) {
        if (list[i].coupons_id === Number(number)) {
          yield put({
            type: 'changeOrderContent',
            payload: {
              attr: 'detail',
              data: list[i],
            },
          });
        }
      }
    },
    // eslint-disable-next-line consistent-return
    *couponsAdd(
      {
        payload: { errorCallback, successCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(couponsAdd, values);
      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      successCallback();
      yield put({
        type: 'changeOrderContent',
        payload: {
          attr: 'list',
          data: response.data,
        },
      });
    },

    // eslint-disable-next-line consistent-return
    *couponsEdit(
      {
        payload: { errorCallback, successCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(couponsEdit, values);
      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      if (Number(response.code) === 1) {
        successCallback();
        yield put({
          type: 'changeOrderContent',
          payload: {
            attr: 'detail',
            data: response.data,
          },
        });
      }
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
    updateStatus(state, { payload }) {
      return {
        ...state,
        status: { ...state.status, ...payload },
      };
    },
  },
};
