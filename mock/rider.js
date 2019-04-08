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
    code: 1,
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

const riderDetail = (req, res) => {
  const { number } = req.query;
  const namesList = ['哇咔咔', '呜啦啦', '哦哟哟', '饿呢呢', '嗡嗡嗡', '呜呜呜'];
  const phonenumber = ['13203833626', '16353627233'];
  const page = Math.ceil(Math.random() * 10);

  const response = {
    code: 1,
    msg: '请求成功',
    data: {
      number,
      name: namesList[Math.floor(Math.random() * 6)],
      house: Math.ceil(Math.random() * 4),
      phonenumber: phonenumber[Math.floor(Math.random())],
      pay: 10000,
      page,
      ID: 5001053747347364364,
      updateTime: Date.now(),
      smallPicture: 'http://pak686x2f.bkt.clouddn.com/v2-5a0e5c3e52f63db85b1377fee9300954_b.gif',
      largePicture: 'http://pak686x2f.bkt.clouddn.com/v2-f301615c18c0da109757a23371559218_b.gif',
      introduce: '钱多活少假期多，还在等什么！',
      status: '已经认证',
      time: '1个月',
    },
  };
  res.json(response);
};

export default {
  'GET /offline/api/manage/rider/list': riderList,
  'GET /offline/api/manage/rider/detail': riderDetail,
};
