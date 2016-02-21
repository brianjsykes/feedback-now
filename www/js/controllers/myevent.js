angular.module('fbn.controllers')

.controller('MyEventCtrl', function($scope, $rootScope, $firebaseObject, $firebaseArray, $ionicLoading) {
  $scope.eventCreated = false;
  $scope.formData = { eventTitle: ""};
  $scope.eventId = null;
  $scope.eventData = {}
  $scope.eventUrl = null;
  $scope.startTime = null;
  var startTimeMils = null;
  $scope.elapsedTime = null;

  $scope.createEvent = function() {
    $ionicLoading.show();
    getNewEventId().then(function(id) {
      $scope.eventId = id;
      $scope.eventUrl = $rootScope.fbRoot + '/events/' + $scope.eventId
      var newEventRef = new Firebase($scope.eventUrl);
      var obj = $firebaseObject(newEventRef);
      obj.owner = $rootScope.user.uid;
      obj.eventTitle = $scope.formData.eventTitle;

      console.log("creating...")
      obj.$save().then(function(ref) {
        obj.$loaded()
          .then(function(data) {
            $scope.eventData = data;
            console.log("created", $scope.eventData);
            console.log("title", $scope.eventData.eventTitle)
            $scope.eventCreated = true;
            $ionicLoading.hide();
          })
      }, function(error) {
        console.log('error', error)
      });
    }, function(error) {
      console.log(error);
      $ionicLoading.hide();

      newEventRef.on('value', function(dataSnapshot) {
        $scope.eventData = dataSnapshot;
      })

    });
  }

  $scope.startEvent = function() {
    $ionicLoading.show();
    $scope.eventUrl = $rootScope.fbRoot + '/events/' + $scope.eventId
    var eventRef = new Firebase($scope.eventUrl);
    var startTimeMils = Date.now();
    console.log("now", startTimeMils);
    $scope.startTime = new Date(startTimeMils).toLocaleString();
    console.log($scope.startTime);
    eventRef.child('startTime').set(startTimeMils.toString());
    $ionicLoading.hide();
    $scope.$apply();
    runTimer();
  }

  function runTimer() {
    var start = new Date($scope.startTime);
    var year = start.getFullYear();
    var month = start.getMonth();
    var day = start.getDate();
    var hr = start.getHours();
    var min = start.getMinutes();
    var sec = start.getSeconds();
    elapseMe({year: year, month: month,day: day,hr : hr, min : min, sec: sec,targetId:"elapsedTime", update : true, show: "all" });
  }

  function generateString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  function getNewEventId() {
    var promise = new RSVP.Promise(function(fulfill, reject) {
      var id = generateString();
      console.log("checking if ID exists", id);
      var eventsUrl = $rootScope.fbRoot + '/events';
      var eventsRef = new Firebase(eventsUrl);
      eventsRef.child(id).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        if (exists) {
          getNewEventId();
        } else {
          fulfill(id);
        }
      });
    });
    return promise;
  }
});