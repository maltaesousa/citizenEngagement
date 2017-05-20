/**
 * This service provides access to comments
 */
angular.module('app').factory('CommentsService', function($http) {

  var service = {};
  service.url = 'https://masrad-dfa-2017-c.herokuapp.com/api/issues/'

  // default parameters to get comments
  var defaults = {
    include: "author",
    pageSize: 50
  };

  /**
   * Gets comments depending on there's a filter or not.
   */
  service.getComments = function(issueID) {
    service.issueID = issueID;
    return fetchAllComments().then(function(comments) {
      return comments
    });
  };

  service.setComment = function(comment) {
    comment.createdAt = moment().format();
    return saveComment(comment);
  }

  /**
   * Fetch all comments
   */
  function fetchAllComments(page, comments) {
    page = page || 1;
    comments = comments || [];
    return $http({
      method: "GET",
      url: service.url + service.issueID + '/comments',
      params: angular.extend(defaults, { page: page })
    }).then(function(res) {
      if (res.data.length) {
        comments = comments.concat(res.data);
        return fetchAllComments(page + 1, comments);
      }
      return comments;
    }).catch(function(error) {
      console.log(error);
    });
  }

  function saveComment(comment, issueID) {
    return $http({
      method: "POST",
      url: service.url + service.issueID + '/comments',
      data: comment
    }).then(function(res) {
      return res.data;
    });
  }

  return service;
});