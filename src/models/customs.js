import { customsList, customsSearch, customsEdit } from '@/services/online';

export default {
  namespace: 'customs',
  state: {
    list: {},
    detail: {},
    status: {},
  },

  effects: {
    // eslint-disable-next-line consistent-return
    *customsList(
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
      const response = yield call(customsList, payload);
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
    *customsDetail(
      {
        payload: { errorCallback, params },
      },
      { put, call }
    ) {
      const res = yield call(customsList);
      const {
        data: { pageSize },
      } = res;
      const current = Math.ceil(Number(params.number) / pageSize);
      const response = yield call(customsList, { current });
      const {
        data: { list },
      } = response;
      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      if (Number(response.code) === 1) {
        if (params.building === 'null') {
          // eslint-disable-next-line no-param-reassign
          params.building = null;
        }
        for (let i = 0; i < list.length; i += 1) {
          if (
            list[i].user_id === Number(params.number) &&
            list[i].building_name === params.building
          ) {
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

    // eslint-disable-next-line consistent-return
    *customsSearch(
      {
        payload: { errorCallback, ...payload },
      },
      { put, call }
    ) {
      const response = yield call(customsSearch, payload);
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

    *customsEdit(
      {
        payload: { errorCallback, successCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(customsEdit, values);
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
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
