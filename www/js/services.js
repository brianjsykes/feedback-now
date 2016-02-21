angular.module('fbn.services', [])

.factory("NewEvent", function($firebaseObject, $rootScope) {
  var newEventRef = new Firebase($rootScope.fbRoot + "/items");
  return $firebaseObject(eventsRef);
})

.factory("Timer", function() {
	
})