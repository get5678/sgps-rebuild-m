const uuidv1 = require('uuid/v1');

const riderList = (req, res) => {
  const { current = 1, pageSize = 10 } = req.query;
  const names = new Array(pageSize);
  const total = Math.ceil(Math.random() * 100);
  const name = ['1', '2', '3', '4', '5', '6'];
  const phonenumber = 12345667;
  for (let i = 0; i < pageSize; i += 1) {
    names[i] = {
      number: uuidv1()
        .split('-')
        .join(''),
      name: name[Math.floor(Math.random() * 6)],
      house: Math.ceil(Math.random() * 4),
      phonenumber,
      ID: 500105199824252627,
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
  'GET /offline/api/manage/rider/list': riderList,
  // 'GET /offline/api/manage/rider/detail': riderDetail,
};
