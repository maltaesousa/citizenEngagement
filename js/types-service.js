  /**
   * This service provides access to issue types
   */
angular.module('app').factory('TypesService', function($http) {

  var service = {};

  service.getTypes = function() {
    return fetchAllTypes().then(function(types) {
      return types;
    });
  };

  /**
   * Fetch all types
   * 
   * @param {int} page current page being fetched
   * @param {Object} types list of types
   */
  function fetchAllTypes(page, types) {
    page = page || 1;
    types = types || [];
    return $http({
      method: "GET",
      url: 'https://masrad-dfa-2017-c.herokuapp.com/api/issueTypes',
      params: { pageSize: 50, page: page }
    }).then(function(res) {
      if (res.data.length) {
        types = types.concat(res.data);
        return fetchAllTypes(page + 1, types);
      }
      return types;
    });
  }

  return service;
});