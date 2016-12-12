//////////////////////////////////
//                              //
//        DUMMY DATA            //
//                              //
//////////////////////////////////


window.GlobalUser = {};
window.GlobalUser.username = '';
window.GlobalUser.userId = '';
window.GlobalUser.solvedChallenges = [];

var exampleChallengeList = [
  {
    id: 1,
    userId: 1,
    title: 'challenge number 1',
    prompt: 'be challenged, breaux',
    text: 'abcdef',
    difficulty: 'mega hard',
    expected: ['a'],
    answer: '^\\w',
    cheats: ['something']
  },
  {
    id: 2,
    userId: 2,
    title: 'challenge number 2',
    prompt: 'be super challenged, breaux',
    text: 'abcdef',
    difficulty: 'mega hard',
    expected: ['a'],
    answer: '^\\w',
    cheats: ['something']
  }
];


//////////////////////////////////
//                              //
//            APP               //
//                              //
//////////////////////////////////

//var serverUrl = 'http://localhost:8000'; //Update me with Process.Env.Port?

angular.module('rehjeks.factories', [
  'ngCookies',
  'ngSanitize'
])
.factory('Auth', function($http, $location, $window) {

  var serverURL = $location.protocol() + '://' + location.host;

  var authorize = function( {username, password}, route, $scope) {
    return $http({
      method: 'POST',
      url: serverURL + route,
      data: JSON.stringify({username: username, password: password})
    })
    .then(
      function(successRes) { //first param = successCallback
        window.GlobalUser.username = successRes.data.username;
        window.GlobalUser.userId = successRes.data.userid;
        document.cookie = `username=${successRes.data.username}; userId=${successRes.data.userid};`;
        $scope.loggedin = true;
        return true;
      },
      function(errorRes) { //second param = errorCallback
        console.log(errorRes);
      }
    );
  };

  var logout = function() {

    $http({
      method: 'GET',
      url: serverUrl + '/logout'
    })
    .then(result => console.log('logged out response from back-end'));

  };

  return {
    authorize: authorize,
    logout: logout
  };


})
.factory('Server', function($http, $location, $cookies, $sanitize) {

  var serverURL = $location.protocol() + '://' + location.host;
  //shared acces for Challenges and Solve Controller
  var currentChallenge = {data: undefined};

  var getRandom = function($scope) {

    var difficulty = $scope.difficulty;
    var username = $cookies.get('username');
    var solvedChallenges = window.GlobalUser.solvedChallenges;
    // var solvedChallenges = window.GlobalUser.solvedChallenges;

    var params = username ? {username, difficulty} : {difficulty, solvedChallenges};

    return $http({
      method: 'GET',
      url: serverURL + '/challenge',
      params: params,
      paramSerializer: '$httpParamSerializerJQLike'
    })
    .then(
      function(returnedChallenge) { //first param = successCallback

        //pass challenge to proper scope to display
        $scope.challengeData = returnedChallenge.data;

        //save current challenge in shared access
        currentChallenge.data = returnedChallenge.data;

        return returnedChallenge.data.text;

      })
    .catch(
      function(errorRes) { //second param = errorCallback
        console.log(errorRes);
      });

  };


  var getAllChallenges = function($scope, difficulty, quantity) {

    $http({
      method: 'GET',
      url: serverURL + '/challenges',
      params: {difficulty, quantity}
    })
    .then(
      function(returnedData) { //first param = successCallback
        $scope.challengeList = returnedData.data;
      })
    .catch(
      function(errorRes) { //second param = errorCallback
        console.log(errorRes);
      });

  };


  var getUserChallenges = function($scope, username) {
    // Getting user specific challenges to display on profile
    return $http({
      method: 'GET',
      url: serverURL + '/challenges',
      params: {username: username},
      paramSerializer: '$httpParamSerializerJQLike'
    })
    .then(function(challenges) {
      $scope.user.challenges = challenges.data;
    });
  };



  var getChallenge = function(challenge) {

        //SET currentChallengeData to returned Data
    currentChallenge.data = challenge;
    $location.path('solve');

  };

  var submitUserSolution = function(solution, challengeId, timeToSolve) {

    var submission = {
      solution: solution,
      username: $cookies.get('username'),
      challengeId: challengeId,
      timeToSolve: timeToSolve
    };

    $http({
      method: 'POST',
      url: 'solution',
      data: JSON.stringify(submission)
    });

  };

  var submitNewChallenge = function($scope) {
    // Creating new challenge by user

    let {submitData:{title, prompt, text, difficulty, expected, answer, cheats}} = $scope;

    text = $sanitize(text);

    let submitData = {
      username: $cookies.get('username'),
      title: title,
      prompt: prompt,
      text: text,
      difficulty: difficulty,
      expected: expected(),
      answer: answer,
      cheats: cheats
    };

    return $http({
      method: 'POST',
      url: serverURL + '/challenge',
      data: JSON.stringify(submitData)
    });

  };
  ///////////////////////////
  //    Factory Interface  //
  ///////////////////////////

  return {
    getAllChallenges: getAllChallenges,
    getUserChallenges: getUserChallenges,
    getRandom: getRandom,
    getChallenge: getChallenge,
    currentChallenge: currentChallenge,
    submitUserSolution: submitUserSolution,
    submitNewChallenge: submitNewChallenge
  };

})
.factory('RegexParser', function() {

  var regexBody = /[^\/].*(?=\/[gim]{0,3}$)/;
  var regexFlags = /[gim]{0,3}$/;

  var makeRegex = function(regexStr) {
    var attemptBody = regexStr.match(regexBody);
    var attemptFlags = regexStr.match(regexFlags);

    // Create new regex object
    return new RegExp(attemptBody, attemptFlags);
  };

  return makeRegex;
});
