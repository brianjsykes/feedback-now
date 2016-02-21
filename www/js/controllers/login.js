angular.module('fbn.controllers')

.controller('LoginCtrl', function($scope, $state, $rootScope, $ionicHistory) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.signupData = {};
  $scope.state = 'login';


  $scope.signupClicked = function() {
    $scope.state = 'signup'
  }

  $scope.backToLogin = function() {
    $scope.state = 'login'
  }

  function goHome() {
    $ionicHistory.nextViewOptions({ historyRoot: true }) 
    $state.go('app.home');
  }

  function storeUserData(authData){
    var ref = new Firebase($rootScope.fbRoot)
    var userRef = ref.child("users").child(authData.uid);
    var userData = $rootScope.getUserData(authData);
    userRef.set(userData);
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var ref = new Firebase($rootScope.fbRoot);
    ref.authWithPassword({
      email: $scope.loginData.email,
      password: $scope.loginData.password
    }, function(error, authData) {
      if (error) {
        alert(error.message)
      } else {
        console.log("Auth data", authData);
        storeUserData(authData);
        goHome();
      }
    })
  };

  $scope.doSignup = function() {
    var ref = new Firebase($rootScope.fbRoot);
    ref.createUser({
      email: $scope.signupData.email,
      password: $scope.signupData.password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
        alert(error)
      } else {
        ref.authWithPassword({
          email: $scope.signupData.email,
          password: $scope.signupData.password
        }, function(error, authData) {
          if (error) {
            alert(error.message);
          } else {
            console.log("auth data", authData);
            authData.password.displayName = $scope.signupData.first + " " + $scope.signupData.last
            storeUserData(authData);

            $scope.state = 'login';
            goHome();
          }
        })
      }
    })
  }

  $scope.fbLogin = function() {
    var ref = new Firebase($rootScope.fbRoot);
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        alert(error.message);
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        alert("foo")
        storeUserData(authData);
        $state.go('app.home');
      }
    }, {
      remember: "sessionOnly",
      scope: "email,user_likes"
    });
  }

  $scope.googleLogin = function() {
    var ref = new Firebase($rootScope.fbRoot);
    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        alert(error.message)
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        storeUserData(authData);
        goHome();
      }
    }, {
      remember: "sessionOnly",
      scope: "email"
    });
  }
})