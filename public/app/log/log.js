'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('log', {
                title: 'Logi systemu ',
                url: '/log',
                templateUrl: 'app/log/log.html',
                controller: 'LogCtrl',
                authenticate: true
            });
    });
