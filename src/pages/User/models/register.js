import { getCaptcha, manageRegiste } from '@/services/online';

export default {
  namespace: 'register',
  state: {
    status: {},
    imgs: ' ',
  },

  effects: {
    *getCaptcha(
      {
        payload: { errorCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(getCaptcha, values);
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
      }
      yield put({
        type: 'changeOrderContent',
        payload: {
          attr: 'imgs',
          data: response.data,
        },
      });
    },

    *manageRegiste(
      {
        payload: { errorCallback, successCallback, ...values },
      },
      { put, call }
    ) {
      const response = yield call(manageRegiste, values);
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
      }
      if (Number(response.code) === 1) {
        successCallback();
        yield put({
          type: 'up',
          payload: response.data,
        });
      }
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
  },
};
