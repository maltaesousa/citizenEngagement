angular.module('app').controller('IssuesCtrl', function(IssuesService) {
  var issuesCtrl = this;

  IssuesService.getIssues().then(function(issues) {
    issuesCtrl.issues = issues;
  });
});