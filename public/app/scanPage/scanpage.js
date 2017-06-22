'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('scanpage', {
                title: 'Skanowane strony ',
                url: '/scanpage',
                templateUrl: 'app/scanPage/scanpage.html',
                controller: 'ScanPageCtrl',
                authenticate: true
            });
    });
