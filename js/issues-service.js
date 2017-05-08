/**
 * This service provides access to issues
 */
angular.module('app').factory('IssuesService', function($http) {

  var service = {};
  // default parameters to get issues
  var defaults = {
    include: "issueType",
    pageSize: 50
  };
  var filter = {};

  var formatCoord = function(issue) {
    issue.lat = issue.location.coordinates[1];
    issue.lng = issue.location.coordinates[0];
  };

  /**
   * Gets issues depending on there's a filter or not.
   */
  service.getIssues = function() {
    var issuesPromise;
    if (_.isEmpty(filter)) {
      issuesPromise = fetchAllIssues();
    } else {
      issuesPromise = fetchFilteredIssues();
    }
    return issuesPromise.then(function(issues) {
      _.each(issues, formatCoord);
      return issues });
  };

  service.getIssue = function(issueId) {
    return fetchAllIssues().then(function(issues) {
      return _.find(issues, { id: issueId });
    });
  };

  /**
   * Adds issues parameters to default ones
   */
  service.setFilter = function(filter) {
    console.log(filter);
  }

  service.setIssue = function(issue) {
    issue.createdAt = moment().format();
    return saveIssue(issue);
  }

  /**
   * Fetch all issues
   * 
   * @param {int} page current page being fetched
   * @param {Object} issues list of issues
   */
  function fetchAllIssues(page, issues) {
    page = page || 1;
    issues = issues || [];
    return $http({
      method: "GET",
      url: 'https://masrad-dfa-2017-c.herokuapp.com/api/issues',
      params: angular.extend(defaults, { page: page })
    }).then(function(res) {
      if (res.data.length) {
        issues = issues.concat(res.data);
        return fetchAllIssues(page + 1, issues);
      }
      return issues;
    });
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