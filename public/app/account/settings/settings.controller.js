'use strict';

angular.module('app')
    .controller('SettingsCtrl', function ($scope, User, Auth) {
        $scope.errors = {};

        $scope.changePassword = function (form) {
            $scope.submitted = true;
            if (form.$valid) {
                Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
                    .then(function () {
                        $scope.message = 'Hasło zostało zmienione.';
                    })
                    .catch(function () {
                        form.password.$setValidity('mongoose', false);
                        $scope.errors.other = 'Błędne hasło';
                        $scope.message = '';
                    });
            }
        };
    });
