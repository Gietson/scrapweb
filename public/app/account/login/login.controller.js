'use strict';

angular.module('app')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $resource) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to the page with requested a login
          Auth.redirectToAttemptedUrl();
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
        /*console.log('provider=' + provider);
        Auth.face(provider)
            .then( function(){
                Auth.redirectToAttemptedUrl();
            });
*/
       // var login = $resource('/auth/' + provider);
       // console.log('login=' + JSON.stringify(login));
    };
  });
