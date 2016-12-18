angular.module('rehjeks.solve', [
  'ngAnimate'
])
.controller('SolveController', function($scope, $interval, Server, $sce, $timeout, $cookies, RegexParser, $moment, PUBNUB, Pubnub) {

  ////////////////////////
  // Internal variables
  // & functions
  ////////////////////////


  ////////////////////////
  // $scope variables
  ////////////////////////

  $scope.regexValid;
  $scope.attempt;
  $scope.myName;
  $scope.opponentName;
  $scope.opponentAttempt;



  ////////////////////////
  // $scope functions
  ////////////////////////

  $scope.submit = function() {

    if ($scope.checkSolution()) {
      $scope.timeToSolve = new Date() - challStartTime;
      $scope.success = true;
      $scope.showOtherAnswers = true;
      $scope.failure = false;
    } else {
      $scope.failure = false;
    }

    if ($scope.success) {
      Server.submitUserSolution($scope.attempt, $scope.challengeData.id, $scope.timeToSolve);
      window.GlobalUser.solvedChallenges.push($scope.challengeData.id);
      $scope.success = false;
      $scope.failure = false;
      $scope.getRandom();
    } else {
      $scope.failure = true;
    }
  };

  $scope.sendText = function(text) {
    
  }



  ////////////////////////
  // Run scripts!!
  ////////////////////////

  // Load Challenge
  // if (Server.currentChallenge.data !== undefined) {
  //   $scope.challengeData = Server.currentChallenge.data;
  //   $scope.highlightedText = $sce.trustAsHtml(Server.currentChallenge.data.text);
  //   $scope.attempt = '//gi';
  //   $scope.getOtherSolutions();

  //   // Timeout to wait until the page has fully loaded first.
  //   $timeout(function() {
  //     $scope.$broadcast('focusOnMe');
  //   }, 0);

  // } else {
  //   $scope.getRandom();
  // }

  // // Start Timer!
  // var solutionClock = $interval(function() {
  //   updateTimer(challStartTime);
  // }, 1000);



})
// Custom Directive to trigger focus on the regex prompt in the correct cursor position
// Just broadcast a "focusOnMe" event in the scope to trigger this action.
.directive('focusOnMe', function() {
  return function (scope, element) {
    scope.$on('focusOnMe', function() {
      element[0].focus();
      element[0].setSelectionRange(1, 1);
    });
  };
});


