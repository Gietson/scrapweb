'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('blocked', {
                title: 'Blokuj ogłoszenia ',
                url: '/blocked',
                templateUrl: 'app/blocked/blocked.html',
                controller: 'BlockedCtrl',
                authenticate: true
            });
    });
