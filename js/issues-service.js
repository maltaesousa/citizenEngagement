angular.module('app').factory('IssuesService', function($http) {
/**
 * This service provides access to issues
 */
  var service = {};

  service.getIssues = function() {
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

  service.getTypes = function() {
    return loadTypes().then(function(types) {
      return types });
  };

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

  return service;
});