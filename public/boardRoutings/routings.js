angular.module('mBoardRouting', ['ngRoute'])
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/list', {    //when('/list/:page', {
                    templateUrl: 'boardViews/list.html',
                    controller: 'listCtrl'
                }).
                when('/view/:msgObjId', {
                    templateUrl: 'boardViews/view.html',
                    controller: 'viewCtrl'
                }).
                when('/write', {
                    templateUrl: 'boardViews/write.html',
                    controller: 'writeCtrl'
                }).
                when('/edit/:msgObjId', {
                    templateUrl: 'boardViews/edit.html',
                    controller: 'editCtrl'
                }).
                otherwise({
                    redirectTo: '/list/'
                });
        }]);