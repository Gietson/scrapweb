'use strict';

angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        title: 'Strona główna',
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'mainCtrl',
        params: {
          sort: 'dupa'
        }
      });
      /*.state('productDetail', {
        title: 'Details of selected product',
        params: {
          id: null,
          slug: null
        },
        url: '/p/:slug',
        templateUrl: 'app/main/product-details.html',
        controller: 'ProductDetailsCtrl'
      })
      .state('SubProduct', {
        title: 'All products under current category or brand',
        url: '/:page/:slug/:_id',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        params: {
          id: null,
          sort: null,
          brand: null,
          category: null,
          price1: 0,
          price2: 100000
        }
      });*/
  });
