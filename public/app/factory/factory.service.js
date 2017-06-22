'use strict';

angular.module('app')
    // Sample factory (dummy)
    .factory('factory', [function () {
        var somValue = 42;
        return {
            someMethod: function () {
                return somValue;
            }
        };
    }])
    .factory('Ads', function ($http) {
        return {
            query: function (filtr, callback) {
                $http.post('/api/ads', filtr
                ).success(function (data) {
                    callback(null, data);
                }).
                error(function (err) {
                    callback(err);
                });
            },
            cols: [
                {field: "photos", title: "Zdjęcie", show: false},
                {field: "title", title: "Tytuł", show: true, dataType: 'text'},
                {field: "district", title: "Dzielnica", show: true, dataType: 'text'},
                {field: "city", title: "Miasto", show: true, dataType: 'text'},
                {field: "price", title: "Cena", show: true, dataType: 'number'},
                {field: "size", title: "Rozmiar", show: true, dataType: 'number'},
                {field: "priceM2", title: "Cena/m2", show: true, dataType: 'number'},
                {field: "propertyType", title: "Typ", show: true, dataType: 'text'},
                {field: "agency", title: "Agencja", show: true, dataType: 'boolean'},
                {field: "numberOfRooms", title: "Pokoje", show: true, dataType: 'number'},
                {field: "numberOfBathrooms", title: "Łazienki", show: true, dataType: 'number'},
                {field: "parking", title: "Parking", show: true, dataType: 'text'},
                {field: "dateScan", title: "Data", show: true, dataType: 'text'},
                {field: "dateAdd", title: "Data Dodania", show: true},
                {field: "userName", title: "User", sortable: 'userName', show: true, dataType: 'text'},
                {field: "phoneNumber", title: "Telefon", show: true, dataType: 'number'},
                {field: "page", title: "Strona", show: true, dataType: 'text'},
                {field: "active", title: "Aktywny", show: true, dataType: 'boolean'}
            ]
        };
    })
    .factory('Unique', ['$resource', function ($resource) {
        return $resource('/api/ads', {value: '@id'}, {'update': {method: 'PUT'}});
    }])
    .factory('Notification', ['$resource', function ($resource) {
        return $resource('/api/notification/:id', null, {'update': {method: 'PUT'}});
    }])
    .factory('ScanPage', ['$resource', function ($resource) {
        //console.log('jestem w scanpage factory');
        return $resource('/api/ScanPage/:id', null, {'update': {method: 'PUT'}});
    }])
    .factory('Log', ['$resource', function ($resource) {
        //console.log('jestem w log factory');
        var obj = {};
        obj = $resource('/api/log/:id', null, {'update': {method: 'PUT'}});
        return obj;
    }])
    .factory('Blocked', ['$resource', function ($resource) {
        var obj = {};
        obj = $resource('/api/blocked/:id', null, {'update': {method: 'PUT'}});
        obj.cols = [
            {field: "title", title: "Tytuł", show: true, dataType: 'text'},
            {field: "url", title: "Adres Strony", show: true, dataType: 'text'},
            {field: "district", title: "Dzielnica", show: true, dataType: 'text'},
            {field: "city", title: "Miasto", show: true, dataType: 'text'},
            {field: "price", title: "Cena", show: true, dataType: 'number'},
            {field: "size", title: "Rozmiar", show: true, dataType: 'number'},
            {field: "priceM2", title: "Cena/m2", show: true, dataType: 'number'},
            {field: "agency", title: "Agencja", show: true, dataType: 'boolean'},
            {field: "userName", title: "Użytkownik", show: true, dataType: 'text'},
            {field: "phoneNumber", title: "Telefon", show: true, dataType: 'number'},
            {field: "page", title: "Strona", show: true, dataType: 'text'},
            {field: "active", title: "Aktywny", show: true, dataType: 'boolean'}
        ];

        return obj;
    }])
    .factory('Setting', ['$resource', function ($resource) {
        return $resource('/api/setting/:id', null, {'update': {method: 'PUT'}});
    }])
    .factory('Status', ['$resource', function ($resource) {
        return $resource('/api/status/:id', null, {'update': {method: 'PUT'}});
    }])
    .factory('Order', ['$resource', function ($resource) {
        console.log($resource);
        var obj = {};
        obj = $resource('/api/orders/:id', null, {'update': {method: 'PUT'}});
        obj.my = $resource('/api/orders/my', null, {'update': {method: 'PUT'}});
        obj.status = [
            {name: 'Pending Payment', val: 402},
            {name: 'Order Placed', val: 201},
            {name: 'Order Accepted', val: 202},
            {name: 'Order Executed', val: 302},
            {name: 'Shipped', val: 200},
            {name: 'Delivered', val: 200},
            {name: 'Cancelled', val: 204},
            {name: 'Not in Stock', val: 404}
        ];
        return obj;
    }]);
