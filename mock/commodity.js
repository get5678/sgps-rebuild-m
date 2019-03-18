const commodityDetail = (req, res) => {
  const commodityLists = ['苹果', '栗子', '辣条', '鸡翅', '水', '纸'];
  const categorys = ['水果', '食物', '饮料', '生活用品'];
  const response = {
    code: '1',
    msg: '请求成功',
    data: {
      number: Math.ceil(Math.random() * 1000),
      name: commodityLists[Math.ceil(Math.random() * 6)],
      category: categorys[Math.floor(Math.random() * 4)],
      status: '0',
      introduce: '没什么好说得，爱买不买',
      pics:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552737150978&di=a131efc01af9a5d50923feaf1564d8df&imgtype=0&src=http%3A%2F%2Fpic15.nipic.com%2F20110712%2F7170514_190240115000_2.jpg',
    },
  };
  res.json(response);
};

export default {
  'GET /offline/api/manage/commodity/detail': commodityDetail,
};
