angular.module('app').controller('IssueCtrl', function(IssuesService, CommentsService, $stateParams, $uibModal) {
  var issueCtrl = this;
  issueCtrl.comments = {};

  var issueId = $stateParams.id;
  IssuesService.getIssue(issueId).then(function(issue) {
    issueCtrl.issue = issue;
  });

  CommentsService.getComments(issueId).then(function(comments) {
    issueCtrl.comments = comments;
  });

});
