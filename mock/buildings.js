const buildingsList = (req, res) => {
  const { current = 1, pageSize = 10 } = req.query;
  const buildings = new Array(pageSize);
  const total = 100;
  const building = ['1号', '2号', '3号', '4号', '5号'];
  for (let i = 0; i < pageSize; i += 1) {
    buildings[i] = {
      building_id: i,
      building_name: building[Math.ceil(Math.random() * 5)],
      building_is_open: 1,
    };
  }
  const response = {
    code: 1,
    msg: '请求成功',
    data: {
      total,
      current,
      pageSize,
      list: buildings,
    },
  };
  res.json(response);
};

export default {
  'GET /offline/api/manage/building/getlist': buildingsList,
};
