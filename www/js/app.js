// Ionic fbn App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'fbn' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'fbn.controllers' is found in controllers.js
angular.module('fbn', ['ionic', 'fbn.controllers', 'fbn.directives', 'fbn.services', 'firebase'])

.run(function($ionicPlatform, $rootScope, $window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.fbRoot = "https://feedback-now.firebaseio.com"

    $rootScope.user = {};
    $rootScope.isLoggedIn = false;

    $rootScope.getUserData = function(authData) {
      var userData = {};
      switch (authData.provider) {
        case 'google':
                userData = {
                  displayName: authData.google.displayName,
                  email: authData.google.email,
                  profileImageURL: authData.google.profileImageURL
                  }
                break;
        case 'facebook':
                userData = {
                  displayName: authData.facebook.displayName,
                  email: authData.facebook.email,
                  profileImageURL: authData.facebook.profileImageURL
                  }
                break;
        case 'password':
                if (authData.password.displayName !== null && authData.password.displayName !== undefined){
                  userData = {
                    displayName: authData.password.displayName,
                    email: authData.password.email,
                    profileImageURL: authData.password.profileImageURL
                  }
                } else {
                  userData = {
                    email: authData.password.email,
                    profileImageURL: authData.password.profileImageURL
                  }
                }
                
                break;
      }
      return userData;
    }

    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $rootScope.user = $rootScope.getUserData(authData);
        $rootScope.user.uid = authData.uid;
        $rootScope.isLoggedIn = true;
      } else {
        console.log("User is logged out");
        $rootScope.user = {};
        $rootScope.isLoggedIn = false;
      }
    }

    // Register the callback to be fired every time auth state changes
    var ref = new Firebase($rootScope.fbRoot);
    ref.onAuth(authDataCallback);

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.event', {
    url: '/event/:eventId',
    views: {
      'menuContent': {
        templateUrl: 'templates/event.html',
        controller: 'EventCtrl'
      }
    }
  })

  .state('app.myevent', {
    url: '/myevent',
    views: {
      'menuContent': {
        templateUrl: 'templates/myevent.html',
        controller: 'MyEventCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
