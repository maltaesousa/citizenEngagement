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

  service.refreshIssues = function() {
    return fetchAllIssues(cache=false).then(function(issues) {
      return issues });
  };

  service.getIssue = function(issueId) {
    return fetchAllIssues().then(function(issues) {
      return _.find(issues, { id: issueId });
    });
  };

  function fetchAllIssues(page, issues, cache) {
    page = page || 1;
    issues = issues || [];
    cache = cache || true;
    return $http({
      method: "GET",
      cache: cache,
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

  return service;
});
