import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { getCaptcha, manageLogin, Logout } from '@/services/online';

const codeAuthority = {
  0: 'admin',
  1: 'user',
  10: 'guest',
};

export default {
  namespace: 'login',

  state: {
    status: {},
    data: {},
    imgs: '',
    name: '管理员',
    avatar: undefined,
  },

  effects: {
    // *loginIdentify({ errorCa1llback, payload }, { put, call }) {
    //   const res = yield call(manageIdentify, payload);
    //   if (Number(res.code) !== 1) {
    //     return errorCallback(res.msg);
    //   }
    //   yield put({
    //     type: 'changeLoginStatus',
    //     payload: res,
    //   });
    // },

    *login({ payload }, { call, put }) {
      const response = yield call(getCaptcha, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    // eslint-disable-next-line consistent-return
    *logout(
      {
        payload: { errorCallback, values, successCallback },
      },
      { call, put }
    ) {
      const response = yield call(Logout, values);

      if (Number(response.code) !== 1) {
        return errorCallback(response.msg);
      }
      if (Number(response.code) === 1) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            admin_identity: 10,
          },
        });
        successCallback();
        reloadAuthorized();
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
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
        type: 'updateOrderContent',
        payload: {
          attr: 'imgs',
          data: response.data,
        },
      });
    },

    *manageLogin(
      {
        payload: { errorCallback, successCallback, values },
      },
      { put, call }
    ) {
      const response = yield call(manageLogin, values);
      if (Number(response.code) !== 1) {
        errorCallback(response.msg);
      }
      if (Number(response.code) === 1) {
        successCallback();
        yield put({
          type: 'changeLoginStatus',
          payload: {
            admin_identity: response.data.admin_identity,
            admin_name: response.data.admin_name,
          },
        });
        reloadAuthorized();
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   console.log(redirectUrlParams,"redirettUrlParams")
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }
        yield put(
          routerRedux.push({
            pathname: '/rider/list',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(
      state,
      {
        // eslint-disable-next-line camelcase
        payload: { admin_name, admin_identity },
      }
    ) {
      setAuthority(codeAuthority[admin_identity]);
      return {
        ...state,
        status: admin_identity,
        name: admin_name,
      };
    },
    updateStatus(state, { payload }) {
      return {
        ...state,
        status: { ...state.status, ...payload },
      };
    },
    updateOrderContent(
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
