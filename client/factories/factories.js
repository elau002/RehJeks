//////////////////////////////////
//                              //
//        DUMMY DATA            //
//                              //
//////////////////////////////////


window.GlobalUser = {};
window.GlobalUser.solvedChallenges = [];

//////////////////////////////////
//                              //
//            APP               //
//                              //
//////////////////////////////////

angular.module('rehjeks.factories', [
  'ngCookies',
  'ngSanitize'
])

.factory('Auth', function($http, $location, $window) {

  var serverURL = $location.protocol() + '://' + location.host;

  //Authorize method used to authenticate user when logging in or signing up
  //Cookie is stored in document.cookie with username and userId info

  var authorize = function( {username, password}, route, $scope) {
    return $http({
      method: 'POST',
      url: serverURL + route,
      data: JSON.stringify({username: username, password: password})
    })
    .then(
      function(successRes) { //first param = successCallback

        // Set cookies if login successful!
        document.cookie = `username=${successRes.data.username}; userId=${successRes.data.userid};`;

        // This will change the "Login" anchor tag in the navbar to your username
        $scope.loggedin = true;
        return true;
      },
      function(errorRes) { //second param = errorCallback
        return errorRes;
      }
    );
  };

  /*Logout method used to logout user by sending a GET request to the server
    where the session is destroyed */

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

  //Gets a random challenge by sending a request to the server
  //Queries on username stored in cookies in order to get a challenge 
  //not already solved by user

  var getRandom = function($scope) {

    var difficulty = $scope.difficulty;
    var username = $cookies.get('username');

    // solvedChallenges is an array of the challenge IDs that we keep track of
    // if the user isn't logged in, so we don't keep serving them challenges
    // they have already solved
    var solvedChallenges = window.GlobalUser.solvedChallenges;

    // Only send solvedChallenges if user is not signed in. Otherwise just send username
    // And the server will find which challenges they have already solved from the database
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

  var getUsers = function($scope) {

    return $http({
      method:'GET',
      url: serverURL + '/leaderboard',
    })
    .then(function(allUsers) {
      console.log(allUsers.data)
      $scope.leaders = allUsers.data
    })
    .catch(function(err){
      console.log(err)
    })
  };
  //Gets all challenges

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

  //Gets all User challenges by sending a GET request to server and querying by username

  var getUserChallenges = function($scope) {
    // Getting user specific challenges to display on profile

    return $http({
      method: 'GET',
      url: serverURL + '/challenges',
      params: {username: $cookies.get('username')},
      paramSerializer: '$httpParamSerializerJQLike'
    })
    .then(function(challenges) {
      $scope.user.challenges = challenges.data;
    });
  };

  //SETs currentChallengeData to returned Data

  var getChallenge = function(challenge) {
    // SET currentChallengeData to returned Data upon clicking a challenge in Challenges view

    currentChallenge.data = challenge;
    $location.path('solve');

  };


  //Sends a POST request to server in order to verify if user submitted solution is valid  

  var submitUserSolution = function(solution, challengeId, timeToSolve) {

    var submission = {
      solution: solution,
      username: $cookies.get('username'),
      challengeId: challengeId,
      timeToSolve: timeToSolve
    };

    return $http({
      method: 'POST',
      url: 'solution',
      data: JSON.stringify(submission)
    });

  };

  // Creating new challenge by user

  var submitNewChallenge = function($scope) {

    let {submitData:{title, prompt, text, difficulty, expected, answer, cheats}} = $scope;

    text = $sanitize(text);

    let submitData = {
      username: $cookies.get('username'),
      title: title,
      prompt: prompt,
      text: text,
      difficulty: difficulty,
      expected: expected(), // generated by a function, not entered in the submit form, so we must invoke it
      answer: answer,
      cheats: cheats
    };

    return $http({
      method: 'POST',
      url: serverURL + '/challenge',
      data: JSON.stringify(submitData)
    });

  };

  var getOtherSolutions = function($scope) {
    // Get other solutions for a given challenge to be displayed upon solving the challenge.
    let {challengeData: {id}} = $scope;

    return $http({
      method: 'GET',
      url: serverURL + '/solution',
      params: {challengeId: id, quantity: 5}
    });

  }
  ///////////////////////////
  //    Factory Interface  //
  ///////////////////////////

  return {
    getAllChallenges: getAllChallenges,
    getUserChallenges: getUserChallenges,
    getRandom: getRandom,
    getChallenge: getChallenge,
    getUsers: getUsers,
    currentChallenge: currentChallenge,
    submitUserSolution: submitUserSolution,
    submitNewChallenge: submitNewChallenge,
    getOtherSolutions: getOtherSolutions
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
