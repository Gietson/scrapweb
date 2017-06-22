'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('login', {
                title: 'Logowanie ',
                url: '/login',
                templateUrl: 'app/account/login/login.html',
                controller: 'LoginCtrl'
            })
            .state('signup', {
                title: 'Rejestracja ',
                url: '/signup',
                templateUrl: 'app/account/signup/signup.html',
                controller: 'SignupCtrl'
            })
            .state('settings', {
                title: 'Zmiana hasła ',
                url: '/settings',
                templateUrl: 'app/account/settings/settings.html',
                controller: 'SettingsCtrl',
                authenticate: true
            });
    });
