'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('status', {
                title: 'Wysłane oraz zablokowane ogłoszenia ',
                url: '/status',
                templateUrl: 'app/status/status.html',
                controller: 'StatusCtrl',
                authenticate: true
            });
    });
