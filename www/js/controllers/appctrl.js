angular.module('fbn.controllers')

.controller('AppCtrl', function($scope, $ionicModal, $ionicHistory, $rootScope, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.logout = function() {
    var ref = new Firebase($rootScope.fbRoot)
    ref.unauth();
    $ionicHistory.nextViewOptions({ historyRoot: true }) 
    $state.go('app.login');
  }

})