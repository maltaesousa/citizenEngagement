angular.module('app').factory('IssuesService', function($http) {
/**
 * This service provides access to issues
 */
  var service = {};

  /**
   * Get all the issues formatting coordinates to be handled
   * in leaflet.
   */
  service.getIssues = function(cache) {
    cache = cache || true;
    return fetchAllIssues().then(function(issues) {
      _.each(issues, function(issue) {
        issue.lat = issue.location.coordinates[1];
        issue.lng = issue.location.coordinates[0];
      });
      return issues });
  };

  service.getIssue = function(issueId) {
    return fetchAllIssues().then(function(issues) {
      return _.find(issues, { id: issueId });
    });
  };

  service.setIssue = function(issue) {
    issue.createdAt = moment().format();
    return saveIssue(issue);
  }

  service.getTypes = function() {
    return loadTypes().then(function(types) {
      return types });
  };

  /**
   * Fetch all issues
   * 
   * @param {boolean} cache if true, cache enabled
   * @param {int} page current page being fetched
   * @param {Object} issues list of issues
   */
  function fetchAllIssues(page, issues) {
    page = page || 1;
    issues = issues || [];
    return $http({
      method: "GET",
      url: 'https://masrad-dfa-2017-c.herokuapp.com/api/issues',
      params: { include: "issueType", page: page }
    }).then(function(res) {
      if (res.data.length) {
        issues = issues.concat(res.data);
        return fetchAllIssues(page + 1, issues);
      }
      return issues;
    });
  }

  var typesPromise
  function loadTypes() {
    if (!typesPromise) {
      typesPromise = $http({
        method: "GET",
        url: 'https://masrad-dfa-2017-c.herokuapp.com/api/issueTypes',
        params: {}
      }).then(function(res) {
        return res.data;
      });
    }

    return typesPromise;
  }

  function saveIssue(issue) {
    console.log(issue);
    return $http({
      method: "POST",
      url: 'https://masrad-dfa-2017-c.herokuapp.com/api/issues',
      data: issue
    }).then(function (res) {
      return res.data;
    });
  }

  return service;
});