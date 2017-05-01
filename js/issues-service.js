angular.module('app').factory('IssuesService', function($http) {
/**
 * This service provides access to issues
 */
  var service = {};

  service.getIssues = function() {
    return fetchAllIssues().then(function(issues) {
      return issues });
  };

  service.getIssue = function(issueId) {
    return fetchAllIssues().then(function(issues) {
      return _.find(issues, { id: issueId });
    });
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
        console.log(page);
        return fetchAllIssues(page + 1, issues);
      }
      return issues;
    });
  }

  return service;
});
