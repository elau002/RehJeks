angular.module('rehjeks.leaderboard', [
  'ngCookies'
])

  .controller('leaderBoardController', function ($scope, Server, $cookies, $sce) {
    $scope.username = $cookies.get('username');
    $scope.leaders = [];
    $scope.filteredleaders = [];

    $scope.getUsers = function () {
      Server.getUsers($scope)
        .then(function () {
          var counter = 0;
          $scope.leaders.sort(function (a, b) {
            return a.score - b.score;
          }).forEach(function (item) {
            item.index = counter;
            counter++;
          })
          for (var i = 0; i < $scope.leaders.length; i++) {
            console.log($scope.leaders[i].username)
            if ($scope.leaders[i].username === $scope.username && i < 10) {
              console.log('beginning', i)
              return $scope.filteredleaders = $scope.leaders.slice(0, 10);
            } else if ($scope.leaders[i].username === $scope.username && $scope.leaders[i + 9] !== undefined && i >= 10) {
              console.log('middle', i)
              return $scope.filteredleaders = $scope.leaders.slice(i - 1, i + 9);
            } else if ($scope.leaders[i].username === $scope.username && $scope.leaders[i + 9] === undefined) {
              return $scope.filteredleaders = $scope.leaders.slice($scope.leaders.length - 10, $scope.leaders.length);
            }
          }
        })
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

    // $scope.filterleaders = function (user) {
    //   $scope.getUsers();
    //   console.log($scope.leaders);
    //   console.log(user)
    // }
  })