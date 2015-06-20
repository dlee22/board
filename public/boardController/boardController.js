angular.module('mBoardList', ['ngRoute','mGlobalService'])
    .controller('listCtrl', ['$rootScope','$scope','$location','myHttpService','mGlobalServiceData',
        function($rootScope,$scope, $location, myHttpService, mGlobalServiceData) {

            mGlobalServiceData.pageInfo.listPerPage = 5;

            $scope.listPerPage = mGlobalServiceData.pageInfo.listPerPage ; //TEST

            //������Ǵ� �Լ��� $rootScope �� ����...
            $rootScope.GoToPage = function () {
                $location.path( '/list' );
            };

            $rootScope.GoToUrl = function (url) {
                $location.path(url);
            };

            $scope.listIndexAry=mGlobalServiceData.pageInfo.listIndexAry;

            //console.log( "listCtrl  :myHttpService.getPagedList!!" ); //debug
            myHttpService.getPagedList(mGlobalServiceData.pageInfo.currentPage, mGlobalServiceData.pageInfo.listPerPage);
            $scope.guestMsgs = mGlobalServiceData.msgDatas;

            //$scope.testStr = "listCtrl!!!"; //test
        }]);
//=====================================================================================================
angular.module('mBoardEdit', ['ngRoute','mGlobalService'])
    .controller('editCtrl', ['$scope','$location','mGlobalServiceData','myHttpService',
    function($scope, $location, mGlobalServiceData, myHttpService) {
        //$scope.currentPage = mGlobalServiceData.pageInfo.currentPage;
        $scope.formData = mGlobalServiceData.already_fetched_data;

        $scope.UpdateGuestMsg = function() {
            if ($scope.formData.contents.length > 0) {
                //console.log("contents valid"); //debug
                myHttpService.update($scope.formData)
                    .success(function() {
                        $scope.formData = {}; //reset
                        $location.path( "/list" );

                    })
                    .error (function () {
                    console.log('update Error'); //debug
                });
            }else{
                console.log("contents invalid!!");
                //TODO
            }
        };
    }]);
//=====================================================================================================
angular.module('mBoardView', ['ngRoute','mGlobalService'])
    .controller('viewCtrl', ['$scope', '$routeParams','$location','mGlobalServiceData','myHttpService',
    function($scope, $routeParams, $location, mGlobalServiceData, myHttpService) {

        var thisIsLastPageAndMsgCnt=0;
        if(mGlobalServiceData.pageInfo.currentPage == mGlobalServiceData.pageInfo.totalPages ){
            //console.log('mGlobalServiceData.pageInfo.totalMsgCnt=',mGlobalServiceData.pageInfo.totalMsgCnt); //debug
            //console.log('mGlobalServiceData.pageInfo.listPerPage=',mGlobalServiceData.pageInfo.listPerPage); //debug
            //������ �������� �޽��������� 1�������� �̸޽����� �����ϴ� ���, ���� �������� ��ȯ�� �ʿ���!!
            thisIsLastPageAndMsgCnt = mGlobalServiceData.pageInfo.totalMsgCnt % mGlobalServiceData.pageInfo.listPerPage;
            if(thisIsLastPageAndMsgCnt==0){
                thisIsLastPageAndMsgCnt = mGlobalServiceData.pageInfo.listPerPage;
            }
            //console.log('thisIsLastPageAndMsgCnt=',thisIsLastPageAndMsgCnt); //debug
        }
        //$scope.currentPage = mGlobalServiceData.pageInfo.currentPage;
        myHttpService.view($routeParams.msgObjId)
            .success(function(data) {
                $scope.msgObjId = $routeParams.msgObjId;
                $scope.userMsg = data;

                mGlobalServiceData.already_fetched_data=data; //for editing
            });

        //delete
        $scope.deleteMsg = function (){
            myHttpService.delete($routeParams.msgObjId)
                .success(function() {
                    //������ �������� ������ �Խù� ������, last ������ ����(-1)
                    if(thisIsLastPageAndMsgCnt ==1){
                        //console.log('decrease page !!'); //debug
                        mGlobalServiceData.pageInfo.currentPage -=1;
                    }

                    $location.path( "/list" );
                })
                .error (function () {
                console.log('deleteMsg Error'); //debug
                $location.path( "/list" );
            });
        };

        //edit
        $scope.editMsg = function (){
            $location.path( "/edit/"+ $routeParams.msgObjId );
        };
    }]);
//=====================================================================================================
angular.module('mBoardWrite', ['ngRoute','mGlobalService'])
    .controller('writeCtrl', ['$scope', '$location','mGlobalServiceData','myHttpService',
    function($scope, $location, mGlobalServiceData, myHttpService) {

        //$scope.currentPage = mGlobalServiceData.pageInfo.currentPage;
        $scope.formData = {};
        $scope.CreateGuestMsg = function() {
            if ($scope.formData.user != undefined && $scope.formData.title != undefined && $scope.formData.contents != undefined) {
                myHttpService.create($scope.formData)
                    .success(function() {
                        $scope.formData = {}; //reset
                        $location.path( "/list" );

                        mGlobalServiceData.pageInfo.currentPageSet=1;//20141214
                        mGlobalServiceData.pageInfo.currentPage =1;
                    })
                    .error (function () {
                    console.log('create Error'); //debug
                });
            }
        };
    }]);