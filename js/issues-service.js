angular.module('app').factory('IssuesService', function($http) {
/**
 * This service provides access to issues
 */
  var service = {};

  service.getIssues = function() {
    return loadIssues().then(function(issues) {
      return issues });
  };

  service.getIssue = function(issueId) {
    return loadIssues().then(function(issues) {
      return _.find(issues, { id: issueId });
    });
  };

  service.getType = function(typeRef) {
    return loadTypes().then(function(types) {
      return _.find(types, { href: typeRef });
    });
  }

  var issuesPromise;
  function loadIssues() {
    if (!issuesPromise) {
      issuesPromise = $http({
        method: "GET",
        url: 'https://masrad-dfa-2017-c.herokuapp.com/api/issues',
        params: { include: "issueType" }
      }).then(function(res) {
        return res.data;
      });
    }

    return issuesPromise;
  }
/*
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
*/
  return service;
});
