angular.module('rehjeks.useroptions', [
  'ngCookies'
])

.controller('UserOptionsController', function($scope, Server, $cookies, $location) {
  $scope.user = {};
  $scope.loggedin = true;
  $scope.user.challenges = [];
  $scope.user.numberOfChallenges = $scope.user.challenges.length;
  $scope.singularOrPlural = 'challenges';

  $scope.logout = function(){
    $cookies.remove('username');
    window.GlobalUser.username = '';
    $scope.loggedin = false;

  }

  $scope.redirect = function(){
  	$location.path('/profile');
  }

  Server.getUserChallenges($scope, $cookies.get('username'))
  .then(results => $scope.user.numberOfChallenges = $scope.user.challenges.length)
  .then(function(results){
    if($scope.user.challenges.length === 1){$scope.singularOrPlural = 'challenge'};
  });

});
