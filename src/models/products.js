import { productsList, productsEdit, productsAdd, commodityList } from '@/services/online';

export default {
  namespace: 'products',
  state: {
    list: {},
    detail: {},
    status: {},
  },

  effects: {
    // eslint-disable-next-line consistent-return
    *productsList(
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
      const response = yield call(productsList, payload);
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
    *categoryList(
      {
        payload: { errorCallback, ...payload },
      },
      { put, call }
    ) {
      const response = yield call(commodityList, payload);
      if (Number(response.code) !== 1) {
        errorCallback(response.code);
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
    *productsSearch(
      {
        payload: { errorCallback, ...values },
      },
      { put, call }
    ) {
      const response = yield call(productsList, values);
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
    *productsEdit(
      {
        payload: { errorCallback, successCallback, ...values },
      },
      { put, call }
    ) {
      const response = yield call(productsEdit, values);
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

    *productsDetail(
      {
        payload: { number, current },
      },
      { put, call }
    ) {
      // const res = yield call(productsList);
      // const {
      //   data: { pageSize },
      // } = res;
      // // eslint-disable-next-line no-param-reassign
      // current = Math.ceil(number / pageSize);
      const response = yield call(productsList, { current });
      const {
        data: { list },
      } = response;
      if (Number(response.code) === 1) {
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].product_id === Number(number)) {
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
    *productsAdd(
      {
        payload: { errorCallback, successCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(productsAdd, values);
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
