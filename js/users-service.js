angular.module('app').factory('UsersService', function($http) {
/**
 * This service provides access to users
 */
  var service = {};
  /**
   * Returns an array with usernames
   */
  service.getUsernames = function() {
    return loadUsers().then(function(users) {
      var usernames = [];
      _.each(users, function(user) {
        usernames.push(user.name);
      });
      console.log(issue.issueType);
      return usernames });
  };

  var usersPromise;
  function loadUsers() {
    if (!usersPromise) {
      console.log("get");
      usersPromise = $http({
        method: "GET",
        url: 'https://masrad-dfa-2017-c.herokuapp.com/api/users',
        params: {}
      }).then(function(res) {
        return res.data;
      });
    }

    return usersPromise;
  }

  return service;
});
