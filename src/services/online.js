import { stringify } from 'qs';
import request from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export async function login(params) {
  return request('/offline/api/manage/admin/login', {
    method: 'POST',
    body: params,
  });
}

export async function riderList(params) {
  return request(`/offline/api/manage/rider/list?${stringify(params)}`);
}
