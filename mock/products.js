const productsList = (req, res) => {
  const { current = 1, pageSize = 20 } = req.query;
  const products = new Array(pageSize);
  const total = 100;
  for (let i = 0; i < pageSize; i += 1) {
    products[i] = {
      product_id: 1 + i,
      product_name: '苹果果',
      product_price: '3',
      product_description: '不好吃, 太酸了',
      product_unit: '个',
      product_sales: 0,
      product_category_id: i + 1,
      product_create_time: '2019-03-17T12:36:59.000Z',
      product_update_time: '2019-03-17T12:41:11.570Z',
      product_state: 1,
      product_img: '',
      category_name: '水果',
    };
  }
  const response = {
    code: 1,
    msg: '请求成功',
    data: {
      total,
      current,
      pageSize,
      list: products,
    },
  };
  res.json(response);
};

export default {
  'GET /offline/api/manage/product/getList': productsList,
};
