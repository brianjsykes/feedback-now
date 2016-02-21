angular.module('fbn.controllers')

.controller('EventCtrl', function($scope, $stateParams, $rootScope) {
  $scope.eventId = $stateParams.eventId;
  var url = $rootScope.fbRoot + '/events/' + $scope.eventId;
  var usersUrl = $rootScope.fbRoot + '/users'
  var ref = new Firebase(url);
  $scope.event = {}
  $scope.ownerName = null;
  $scope.startTime = null;
  $scope.elapsedTime = null;
  $scope.endTime = null;

  function runTimer() {
    var start = new Date($scope.startTime);
    var year = start.getYear() + 1900;
    var month = start.getMonth();
    var day = start.getDate();
    var hr = start.getHours();
    var min = start.getMinutes();
    var sec = start.getSeconds();
    elapseMe({year: year, month: month,day: day,hr : hr, min : min, sec: sec,targetId:"elapsedTime", update : true, show: "all" });
  }

  ref.on("value", function(snapshot) {
    $scope.event = snapshot.val();
    $scope.startTime = (new Date(parseInt($scope.event.startTime))).toLocaleString();
    $scope.endTime = (new Date(parseInt($scope.event.endTime))).toLocaleString();
    var userUrl = usersUrl + '/' + $scope.event.owner;
    var userRef = new Firebase(userUrl);
    userRef.on('value', function(snapshot) {
      var user = snapshot.val();
      $scope.ownerName = user.displayName;
      $scope.$apply()
    })
  }, function(error) {
    console.log(error);
  })

  runTimer();

})
