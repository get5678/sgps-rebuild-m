const customsList = (req, res) => {
  const { current = 1, pageSize = 10 } = req.query;
  const names = new Array(pageSize);
  const total = Math.ceil(Math.random() * 100);
  const place = ['8栋', '15栋', '9栋', '1栋', '3栋'];
  const name = ['小李', '小红', '小明', '小子', '小妹', '小马'];
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

const customsDetail = (req, res) => {
  const { number } = req.query;
  const namesList = ['红', '白', '哟'];
  const phonenumber = ['13203833626', '16353627233'];
  const page = Math.ceil(Math.random() * 10);

  const response = {
    code: 100001,
    msg: '请求成功',
    data: {
      number,
      name: namesList[Math.floor(Math.random() * 6)],
      house: Math.ceil(Math.random() * 4),
      phonenumber: phonenumber[Math.floor(Math.random())],
      pay: 10000,
      page,
      updateTime: Date.now(),
      introduce: '学生',
      status: '已经认证',
      time: '1个月',
    },
  };
  res.json(response);
};

export default {
  'GET /offline/api/manage/customs/list': customsList,
  'GET /offline/api/manage/customs/detail': customsDetail,
};
