angular.module('app').controller('IssueCtrl', function(IssuesService, $stateParams, $uibModal) {
  var issueCtrl = this;

  var issueId = $stateParams.id;
  IssuesService.getIssue(issueId).then(function(issue) {
    issueCtrl.issue = issue;
  });

});
