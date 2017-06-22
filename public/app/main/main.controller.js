'use strict';

angular.module('app')

    .controller('mainCtrl', function ($scope, $http, Ads, $loading, toastr, ModalAds, Blocked) {
        $scope.ads = {};
        $scope.sortList = [
            {name: 'new', text: 'Najnowsze'},
            {name: 'old', text: 'Najstarsze'},
        ];

        $scope.sortSelectedItem = $scope.sortList[0];

        $scope.sortChange = function (event) {
            $scope.sortSelectedItem = event;
            $scope.goFilter();
        };




        $scope.init = function () {
            $scope.form  = {
                agency: false
            };
            $scope.limitOnPage = 16;
            $scope.currentPage = 1;
            $scope.goFilter();
        };

        $scope.goFilter = function () {
            $loading.start('filter');
            var option= {
                currentPage: $scope.currentPage,
                limitOnPage: $scope.limitOnPage,
                sort: $scope.sortSelectedItem.name};

            var formData = {opt: option, data: $scope.form};

            //$scope.busy = true;
            $(".collapse").collapse('hide');

            //console.log('Wysylam do Serwera= ' + JSON.stringify(formData));
            Ads.query(formData, function (err, data) {
                if (err) {console.log('err=' + err);return;}

                $scope.ads = data.docs;
                $scope.totalItems = data.total;
                $scope.pages = data.pages;

                $scope.busy = false;
                $loading.finish('filter');
            });

        };

        $scope.init();

        $scope.edit = function (item) {
            //console.log(JSON.stringify(item));
            ModalAds.show(item, {
                action: 'edit',
                title: item._id,
                api: 'Ads',
                columns: Ads.cols,
            });
        };
        $scope.block = function (item) {
            //console.log(JSON.stringify(item));
            item._id = null;
            ModalAds.show(item, {
                action: 'block',
                title: item._id,
                api: 'Blocked',
                columns: Blocked.cols,
            });
        };
    });