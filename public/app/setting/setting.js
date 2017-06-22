'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('setting', {
                title: 'Ustawienia skrapowarki ',
                url: '/setting',
                templateUrl: 'app/setting/setting.html',
                controller: 'SettingCtrl',
                authenticate: true
            });
    });
