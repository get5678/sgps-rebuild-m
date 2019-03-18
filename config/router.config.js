export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/', redirect: '/user/login' },
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
      // commodity
      {
        path: './commodity',
        name: 'commodity',
        icon: 'star',
        routes: [
          {
            path: '/commodity/list',
            name: 'commoditylist',
            component: './commodity/List',
          },
          {
            path: '/commodity/detail/:number',
            name: 'commoditydetail',
            component: './commodity/Detail',
          },
          {
            path: '/commodity/edit/:number',
            name: 'commodityedit',
            component: './commodity/Edit',
          },
        ],
      },
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
      // Shop
      {
        path: '/shop',
        name: 'shop',
        icon: 'home',
        routes: [
          {
            path: '/shop/list',
            name: 'shoplist',
            component: './shop/List',
          },
          {
            path: '/shop/detail/:number',
            name: 'shopdetail',
            component: './shop/Detail',
          },
          {
            path: '/shop/edit/:number',
            name: 'shopedit',
            component: './shop/Edit',
          },
        ],
      },

      // Customs
      {
        path: '/customs',
        name: 'customs',
        icon: 'user',
        routes: [
          {
            path: '/customs/list',
            name: 'customslist',
            component: './customs/List',
          },
          {
            path: '/customs/detail/:number',
            name: 'customsdetail',
            component: './customs/Detail',
          },
          {
            path: '/customs/edit/:number',
            name: 'customsedit',
            component: './customs/Edit',
          },
        ],
      },
      // coupons
      {
        path: '/coupons',
        name: 'coupons',
        icon: 'profile',
        routes: [
          {
            path: '/coupons/list',
            name: 'couponslist',
            component: './coupons/list',
          },
          {
            path: '/coupons/edit/:number',
            name: 'couponsedit',
            component: './coupons/edit',
          },
          {
            path: '/coupons/detail/:number',
            name: 'couponsdetail',
            component: './coupons/detail',
          },
        ],
      },
      // Buildings
      {
        path: '/buildings',
        name: 'buildings',
        icon: 'hdd',
        // routes: [{}],
      },
      {
        component: '404',
      },
    ],
  },
];
