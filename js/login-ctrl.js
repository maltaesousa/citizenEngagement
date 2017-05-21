angular.module('app').controller('LoginCtrl', function (AuthService, $http, $state) {
  var login = this;
  login.user = {};
  login.newuser = {};

  login.connect = function () {
    delete login.alert;
    login.loading = true;
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
      login.loading = false;
    });
  };

  login.createUser = function () {
    delete login.alert;
    login.loading = true;
    login.newuser.roles = ["citizen"];
    $http({
      method: 'POST',
      url: 'https://masrad-dfa-2017-c.herokuapp.com/api/users',
      data: login.newuser
    }).then(function (res) {
      login.user = {
        name: login.newuser.name,
        password: login.newuser.password
      }
      login.connect();
    }).catch(function (error) {
      if (error.data.name.kind === "user defined") {
        login.alert = {
          message: "Your username is already taken"
        }
      } else {
        login.alert ={
          message : "FFFFUUUUUUU!! Internet is broken, come back later."
        }
      }
      login.loading = false;
      login.alert.error = true;
    });
  };
});