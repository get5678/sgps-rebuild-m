import { stringify } from 'qs';
import request from '@/utils/request';

// Login

// 注册
export async function manageRegiste(params) {
  return request('/online/api/manage/admin/registe', {
    method: 'POST',
    body: params,
  });
}
export async function manageLogin(params) {
  return request('/online/api/manage/admin/login', {
    method: 'POST',
    body: params,
  });
}
export async function Logout(params) {
  return request(`/online/api/manage/admin/logout`, {
    method: 'POST',
    body: params,
  });
}
// 验证码
export async function getCaptcha(params) {
  return request(`/online/api/verify/getCaptcha?${stringify(params)}`);
}

// UploadPic
export async function uploadPic(params) {
  return request(`/online/api/upload`, {
    method: 'POST',
    body: params,
  });
}

// Commodity 商品种类
export async function commodityList(params) {
  return request(`/online/api/manage/category/search?${stringify(params)}`);
}
export async function commodityDetail(name) {
  return request(`/offline/api/manage/commodity/detail?name=${name}`);
}
export async function commodityAdd(params) {
  return request(`/online/api/manage/category/add`, {
    method: 'POST',
    body: params,
  });
}
export async function commodityEdit(params) {
  return request(`/online/api/manage/category/modify`, {
    method: 'POST',
    body: params,
  });
}

// Order 订单
export async function orderList(params) {
  return request(`/online/api/manage/order/getList?${stringify(params)}`);
}

// Rider  骑手，掌柜
export async function riderList(params) {
  return request(`/online/api/manage/rider/getList?${stringify(params)}`);
}
export async function riderSreach(params) {
  return request(`/online/api/manage/rider/search?${stringify(params)}`);
}
export async function riderDetail(number) {
  return request(`/offline/api/manage/rider/detail?number=${number}`);
}
export async function riderEdit(params) {
  return request(`/online/api/manage/rider/update`, {
    method: 'POST',
    body: params,
  });
}
export async function riderDelect(params) {
  return request(`/online/api/manage/rider/delete`, {
    method: 'POST',
    body: params,
  });
}
export async function riderRegiste(params) {
  return request(`/online/api/manage/rider/registe`, {
    method: 'POST',
    body: params,
  });
}

// Shop  分店
export async function shopList(params) {
  return request(`/online/api/manage/admin/getList?${stringify(params)}`);
}
export async function shopRegiste(params) {
  return request(`/online/api/manage/admin/registe`, {
    method: 'POST',
    body: params,
  });
}
export async function shopExame(params) {
  return request(`/online/api/manage/admin/examine`, {
    method: 'POST',
    body: params,
  });
}
export async function shopEdit(params) {
  return request(`/online/api/manage/admin/update`, {
    method: 'POST',
    body: params,
  });
}

// Customs  用户
export async function customsList(params) {
  return request(`/online/api/manage/user/getList?${stringify(params)}`);
}
export async function customsSearch(params) {
  return request(`/online/api/manage/user/search?${stringify(params)}`);
}
export async function customsDetail(number) {
  return request(`/offline/api/manage/customs/detail?number=${number}`);
}
export async function customsEdit(params) {
  return request(`/online/api/manage/user/update`, {
    method: 'POST',
    body: params,
  });
}
// Coupons   优惠券
export async function couponsList(params) {
  return request(`/online/api/manage/coupons/getList?${stringify(params)}`);
}
export async function couponsAdd(params) {
  return request(`/online/api/manage/coupons/add`, {
    method: 'POST',
    body: params,
  });
}
export async function couponsEdit(params) {
  return request(`/online/api/manage/coupons/modify`, {
    method: 'POST',
    body: params,
  });
}

// Buildings   楼栋
export async function buildingsList(params) {
  return request(`/online/api/manage/building/getList?${stringify(params)}`);
}
export async function buildingsDetail(params) {
  return request(`/online/api/manage/building/getList?${stringify(params)}`);
}
export async function buildingsEdit(params) {
  return request(`/online/api/manage/building/modify`, {
    method: 'POST',
    body: params,
  });
}
export async function buildingsAdd(params) {
  return request(`/online/api/manage/building/add`, {
    method: 'POST',
    body: params,
  });
}

//  product 商品
export async function productsList(params) {
  return request(`/online/api/manage/product/getList?${stringify(params)}`);
}
export async function productsEdit(params) {
  return request(`/online/api/manage/product/modify`, {
    method: 'POST',
    body: params,
  });
}
export async function productsAdd(params) {
  return request(`/online/api/manage/product/add`, {
    method: 'POST',
    body: params,
  });
}
