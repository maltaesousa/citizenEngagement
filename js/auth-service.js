angular.module('app').factory('AuthService', function(store) {
  var service = {
    token: store.get('auth-token'),
    setToken: function(token) {
      service.token = token;
      store.set('auth-token', token);
    },
    unsetToken: function() {
      service.token = null;
      store.remove('auth-token')
    }
  };

  return service;
});