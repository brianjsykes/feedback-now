angular.module('fbn.controllers')

.controller('HomeCtrl', function($scope, $state, $rootScope, $ionicHistory) {
  if ($rootScope.isLoggedIn === false) {
    $ionicHistory.nextViewOptions({ historyRoot: true }) 
    $state.go('app.login')
  }

  $scope.user = $rootScope.user;

  $scope.data = { }
 
  $scope.goToEvent = function() {
    $state.go('app.event', {eventId: $scope.data.eventCode})
    //go to event page
  }

  $scope.startNew = function() {
    $state.go('app.myevent')
  }

  $scope.browseEvents = function() {
    $state.go('app.browse')
  }
 
})