angular.module('rehjeks.login', [])
  .controller('LoginController', function($scope, Auth) {
    $scope.user = {};
    $scope.showLogin = true;
    $scope.showSignup = false;
    $scope.signin = false;
    $scope.actionTitle = 'Login';
    $scope.loggedin = window.GlobalUser.username !== ''; // Shouldn't have to use this eventually

    $scope.loggedin = document.cookie !== "undefined" && document.cookie !== "";




    $scope.login = function () {
      console.log('user object contains ', $scope.user);
      Auth.authorize($scope.user, '/login', $scope);
      $scope.$parent.showDropdown = false;
    };

    $scope.submit = function() {
      if ($scope.showLogin) {
        Auth.authorize($scope.user, '/login', $scope)
        .then((resp)=>$scope.$parent.showDropdown=false);
      } else if ($scope.showSignup) {

        Auth.authorize($scope.user, '/signup', $scope);
      }
      var form = document.getElementsByName('loginForm')[0];
      form.reset();
    };

    $scope.seeLogin = function() {
      console.log('trying to show signin');
      $scope.showLogin = true;
      $scope.showSignup = false;
      $scope.actionTitle = 'Login';
    };

    $scope.seeSignup = function() {
      console.log('trying to show signin');
      $scope.showLogin = false;
      $scope.showSignup = true;
      $scope.actionTitle = 'Signup';
    };

    $scope.logout = function() {
      console.log('logging out');
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      window.GlobalUser.username = '';

      $scope.loggedin = false;
    };


  });
