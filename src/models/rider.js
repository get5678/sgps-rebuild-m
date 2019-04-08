import { riderList, riderSreach, riderDelect, riderRegiste, riderEdit } from '@/services/online';

export default {
  namespace: 'rider',
  state: {
    list: {},
    detail: {},
    status: {},
  },

  effects: {
    // eslint-disable-next-line consistent-return
    *riderList(
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

      const response = yield call(riderList, payload);
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
    *riderDetail(
      {
        payload: { errorCallback, number, current },
      },
      { put, call }
    ) {
      const response = yield call(riderList, { current });
      const {
        data: { list },
      } = response;
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
      }
      if (Number(response.code) === 1) {
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].rider_id === Number(number)) {
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

    *riderEdit(
      {
        payload: { errorCallback, successCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(riderEdit, values);
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

    *riderSreach(
      {
        payload: { errorCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(riderSreach, values);
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
      }
      yield put({
        type: 'changeOrderContent',
        payload: {
          attr: 'list',
          data: response.data,
        },
      });
    },

    *riderDelect(
      {
        payload: { errorCallback, successCallback, id },
      },
      { put, call }
    ) {
      const response = yield call(riderDelect, { id });
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

    *riderRegiste(
      {
        payload: { errorCallback, successCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(riderRegiste, values);
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
