'use strict';

angular.module('app')
.factory('ModalAds',['$rootScope','$uibModal', function ($rootScope, $uibModal) {

  var obj = {};
  var selectModalInstanceCtrl = function ($scope,$uibModalInstance, $injector, data, options, toastr) {

      //var api = options.api;
      var api = $injector.get(options.api);
    $scope.data = angular.copy(data);
    $scope.options = options;
    $scope.saveItem = function(item){
        if($scope.data._id){
          api.update({ id:$scope.data._id }, $scope.data).$promise.then(function() {

          }, function(error) { // error handler
            if(error.data.errors){
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
            }
            else{
              var msg = error.data.message;
              toastr.error(msg);
            }
          });
        }
        else{
          api.save($scope.data).$promise.then(function() {

          }, function(error) { // error handler
            if(error.data.errors){
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
            }
            else{
              var msg = error.data.message;
              toastr.error(msg);
            }
          });
        }
        $uibModalInstance.close(item);
    };


      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

      $scope.deleteAllValues = function () {
          $scope.data = '';
      }
      $scope.deleteValue = function (val) {

      }
  };

  // We need to manually inject to be minsafe
  selectModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', '$injector', 'data', 'options', 'toastr'];

  obj.show = function(data,options){
      var modalOptions = {
          templateUrl: 'components/modalAds/modalAds.html',
          controller: selectModalInstanceCtrl,
          controllerAs: 'modal',
          windowClass: 'modal-danger',
          resolve: {
              data: function () { return data; },
              options : function () { return options; }
          }
      };
      $uibModal.open(modalOptions);

  };

  return obj;

}]);
