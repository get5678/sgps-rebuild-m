export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/registerResult',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin' || 'user'],
    routes: [
      { path: '/', redirect: 'user/login' },
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
          // {
          //   path: '/commodity/detail/:number',
          //   name: 'commoditydetail',
          //   component: './commodity/Detail',
          // },
          {
            path: '/commodity/edit/:number/:current',
            name: 'commodityedit',
            component: './commodity/Edit',
          },
        ],
      },
      // products
      {
        path: './products',
        name: 'products',
        icon: 'barcode',
        routes: [
          {
            path: '/products/list',
            name: 'productslist',
            component: './products/List',
          },
          // {
          //   path: '/products/detail/:number',
          //   name: 'productsdetail',
          //   component: './products/Detail',
          // },
          {
            path: '/products/edit/:number/:current',
            name: 'productsedit',
            component: './products/Edit',
          },
        ],
      },
      // order
      {
        path: '/order',
        name: 'order',
        icon: 'calendar',
        routes: [
          {
            path: '/order/list',
            name: 'orderlist',
            component: './order/list',
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
            path: '/rider/detail/:number/:current',
            name: 'riderdetail',
            component: './rider/Detail',
          },
          {
            path: '/rider/edit/:number/:current',
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
        authority: ['admin'],
        routes: [
          {
            path: '/shop/list',
            name: 'shoplist',
            component: './shop/List',
          },
          // {
          //   path: '/shop/detail/:number',
          //   name: 'shopdetail',
          //   component: './shop/Detail',
          // },
          {
            path: '/shop/edit/:number/:current',
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
          // {
          //   path: '/customs/detail/:number',
          //   name: 'customsdetail',
          //   component: './customs/Detail',
          // },
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
            path: '/coupons/edit/:number/:current',
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
        routes: [
          {
            path: '/buildings/list',
            name: 'buildingslist',
            component: './buildings/List',
          },
          {
            path: '/buildings/edit/:number/:current',
            name: 'buildingsedit',
            component: './buildings/Edit',
          },
        ],
      },

      {
        component: '404',
      },
    ],
  },
];
