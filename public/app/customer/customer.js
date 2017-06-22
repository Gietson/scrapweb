'use strict';

angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('customer', {
        title: 'Użytkownicy',
        url: '/customer',
        templateUrl: 'app/customer/customer.html',
        controller: 'CustomerCtrl',
        authenticate: true
      });
  });
