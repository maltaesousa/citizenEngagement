/**
 * Controls the issue details in the accordion body on the left panel and the comments
 */
angular.module('app').controller('IssueCtrl', function(IssuesService, CommentsService, $stateParams, $uibModal, $scope) {
  var issueCtrl = this;
  issueCtrl.comments = {}; // comments related to the current issue
  issueCtrl.comment = {}; // new comment

  var issueId = $stateParams.id;
  IssuesService.getIssue(issueId).then(function(issue) {
    console.log(issue);
    issueCtrl.issue = issue;
  });

  issueCtrl.getComments = function() {
    issueCtrl.comments.loading = true;
    CommentsService.getComments(issueId).then(function(comments) {
      issueCtrl.comments = comments;
      issueCtrl.comments.loading = false;
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
