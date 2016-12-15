angular.module('rehjeks.leaderboard', [
  'ngCookies'
])

  .controller('leaderBoardController', function ($scope, Server, $cookies, $sce) {
    $scope.username = $cookies.get('username');
    $scope.leaders = [];
    $scope.listLimit = 10;
    $scope.getUsers = function () {
      Server.getUsers($scope);
    }

    $scope.highlight = function () {
      var currentUser = $scope.username;
      var highlightedText = $scope.username.replace(currentUser, '<span class="highlighted-text">$&</span');
      $scope.highlightedText = $sce.trustAsHtml(highlightedText);
    }

    $scope.findUser = function (name) {
      if (name === $scope.username) {
        $scope.highlight();
        return true;
      }
    }

    $scope.$watch(function () { return $cookies.get('username'); }, function () {
      var username = $cookies.get('username');
      $scope.username = username;
    });

  })