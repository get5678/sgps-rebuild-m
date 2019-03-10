export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // rider
      {
        path: '/rider',
        name: 'rider',
        icon: 'ordered-list',
        routes: [
          {
            path: '/rider/list',
            name: 'riderlist',
            component: './rider/List',
          },
          {
            path: '/rider/detail/:number',
            name: 'riderdetail',
            component: './rider/Detail',
          },
          {
            path: '/rider/edit/:number',
            name: 'rideredit',
            component: './rider/Edit',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
