import { buildingsList, buildingsEdit, buildingsAdd } from '@/services/online';

export default {
  namespace: 'buildings',

  state: {
    list: {},
    detail: {},
    status: {},
  },

  effects: {
    // eslint-disable-next-line consistent-return
    *buildingsList(
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
      const response = yield call(buildingsList, payload);
      if (Number(response.code !== 1)) {
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
    *buildingsEdit(
      {
        payload: { errorCallback, successCallback, ...values },
      },
      { put, call }
    ) {
      const response = yield call(buildingsEdit, values);
      if (response.code !== 1) {
        return errorCallback(response.msg);
      }
      successCallback();
      yield put({
        type: 'changeOrderContent',
        payload: {
          attr: 'detail',
          data: response.data,
        },
      });
    },

    *buildingDetail(
      {
        payload: { number, current },
      },
      { put, call }
    ) {
      const response = yield call(buildingsList, { current });
      const {
        data: { list },
      } = response;
      if (Number(response.code) === 1) {
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].building_id === Number(number)) {
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
    *buildingsAdd(
      {
        payload: { errorCallback, successCallback, ...values },
      },
      { put, call }
    ) {
      const response = yield call(buildingsAdd, values);
      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      successCallback();
      yield put({
        type: 'changeOrderContent',
        payload: {
          attr: 'detail',
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
