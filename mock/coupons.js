const couponsList = (req, res) => {
  const { current = 1, pageSize = 10 } = req.query;
  const coupons = new Array(pageSize);
  const total = 100;
  const couponsname = ['满 50 减 30', '满 50 打 8.8 折', '满 199 减 100'];
  const category = ['满减', '折扣'];
  const range = ['全场', '热销', '个买'];
  for (let i = 0; i < pageSize; i += 1) {
    coupons[i] = {
      coupons_id: i,
      coupons_name: couponsname[Math.floor(Math.random() * 3)],
      coupons_type: category[Math.ceil(Math.random())],
      validityRange: range[Math.floor(Math.random() * 3)],
      validityTimeB: Date.now(),
      // eslint-disable-next-line no-restricted-properties
      validityTimeE: Date.now() + Math.pow(10, 8),
    };
  }
  const response = {
    code: '1',
    msg: 'sucess',
    data: {
      total,
      current,
      pageSize,
      list: coupons,
    },
  };
  res.json(response);
};

const couponsDetail = (req, res) => {
  const coupons = {
    coupons_id: 5,
    coupons_name: '测试',
    coupons_type: 'dsdsdsdsdsds',
  };

  const response = {
    code: '1',
    msg: 'd',
    data: {
      detail: coupons,
    },
  };
  res.json(response);
};

export default {
  'GET /offline/api/manage/coupons/getList': couponsList,
  'GET /offline/api/manage/coupons/detail': couponsDetail,
};
