/**
 * Controls the issue details in the accordion body on the left panel.
 */
angular.module('app').controller('IssueCtrl', function(IssuesService, CommentsService, $stateParams, $uibModal, $scope) {
  var issueCtrl = this;
  issueCtrl.comments = {}; // comments related to the current issue
  issueCtrl.comment = {}; // new comment

  var issueId = $stateParams.id;
  IssuesService.getIssue(issueId).then(function(issue) {
    issueCtrl.issue = issue;
  });

  issueCtrl.getComments = function() {
    CommentsService.getComments(issueId).then(function(comments) {
      issueCtrl.comments = comments;
    });
  };
  issueCtrl.getComments();

  issueCtrl.addComment = function() {
    CommentsService.setComment(issueCtrl.comment).then(function() {
      issueCtrl.getComments(); // refresh the comments
      issueCtrl.comment = {};
      $scope.commentForm.$setPristine();
    });
  }

});
