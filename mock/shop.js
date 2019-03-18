const shopList = (req, res) => {
  const { current = 1, pageSize = 10 } = req.query;
  const names = new Array(pageSize);
  const total = Math.ceil(Math.random() * 100);
  const place = ['8教', '15栋小商店', '9栋小商店', '老仙们', '信息澳门'];
  const name = ['重邮小商店', '新世纪', '家乐福', '永辉', '重客隆', '沃尔玛'];
  const phonenumber = 67619079;

  for (let i = 0; i < pageSize; i += 1) {
    names[i] = {
      number: Math.ceil(Math.random() * 10000000000),
      name: name[Math.floor(Math.random() * 5)],
      place: place[Math.floor(Math.random() * 5)],
      phonenumber,
    };
  }
  const response = {
    code: 100001,
    msg: '请求成功',
    data: {
      total,
      current,
      pageSize,
      list: names,
    },
  };
  res.json(response);
};

export default {
  'GET /offline/api/manage/shop/list': shopList,
};
