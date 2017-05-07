angular.module('app').controller('LoginCtrl', function (AuthService, $http, $state) {
  var login = this;
  login.user = {};
  login.newuser = {};

  login.connect = function () {
    delete login.alert;
    $http({
      method: 'POST',
      url: 'https://masrad-dfa-2017-c.herokuapp.com/api/auth',
      data: login.user
    }).then(function (res) {
      AuthService.setToken(res.data.token);
      $state.go('home');
    }).catch(function (error) {
      login.alert = {
        message: "Unable to log you.",
        error: true
      }
    });
  };

  login.createUser = function () {
    delete login.alert;
    login.newuser.roles = ["citizen"];
    $http({
      method: 'POST',
      url: 'https://masrad-dfa-2017-c.herokuapp.com/api/users',
      data: login.newuser
    }).then(function (res) {
      login.alert = {
        message: "Your account has been created, please log in",
        info: true
      }
      $state.go('login');
    }).catch(function (error) {
      if (error.data.name.kind === "user defined") {
        login.alert = {
          message: "Your username is already used"
        }
      } else {
        login.alert ={
          message : "FFFFUUUUUUU!! Internet is broken, come back later."
        }
      }
      login.alert.error = true;
    });
  };
});