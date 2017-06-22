'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('notification', {
                title: 'Powiadomienia ',
                url: '/notification',
                templateUrl: 'app/notification/notification.html',
                controller: 'NotificationCtrl',
                authenticate: true
            });
    });
