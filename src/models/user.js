import { query as queryUsers } from '@/services/user';
import { manageLogin } from '@/services/online';

export default {
  namespace: 'user',

  state: {
    list: {},
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(
      {
        payload: { values },
      },
      { call, put }
    ) {
      const response = yield call(manageLogin, values);
      // console.log(response, "fetchCurrent,response")
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
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
