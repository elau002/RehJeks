angular.module('rehjeks.leaderboard', [])

  .controller('leaderBoardController', function ($scope, Server) {
    $scope.leaders = [];
    $scope.getUsers = function () {
      Server.getUsers($scope);
    }
  })