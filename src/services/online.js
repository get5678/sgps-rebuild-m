import { stringify } from 'qs';
import request from '@/utils/request';

// Login

// 注册
export default function manageRegiste() {
  return request('/online//api/manage/admin/registe', {
    method: 'POST',
  });
}
// 验证码
export async function manageIdentify(params) {
  return request(`/online/api/verify/getCaptcha?${stringify(params)}`);
}

// Commodity
export async function commodityList(params) {
  return request(`/online/api/manage/category/search?${stringify(params)}`);
}
export async function commodityDetail(number) {
  return request(`/offline/api/manage/commodity/detail?number=${number}`);
}

// Rider
export async function riderList(params) {
  return request(`/offline/api/manage/rider/list?${stringify(params)}`);
}

export async function riderDetail(number) {
  return request(`/offline/api/manage/rider/detail?number=${number}`);
}

// Shop
export async function shopList(params) {
  return request(`/offline/api/manage/shop/list?${stringify(params)}`);
}

// Customs
export async function customsList(params) {
  //  return request(`/offline/api/manage/customs/list${stringify(params)}`);
  return request(`/online/api/manage/user/getList?${stringify(params)}`);
}
export async function customsSearch(params) {
  return request(`/online/api/manage/user/search?${stringify(params)}`);
}
export async function customsDetail(number) {
  // return request(`/offline/api/manage/customs/detail${number}`);
  return request(`/offline/api/manage/customs/detail?number=${number}`);
}

// Coupons
export async function couponsList(params) {
  return request(`/offline/api/manage/coupons/getList?${stringify(params)}`);
}
