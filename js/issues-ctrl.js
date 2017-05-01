angular.module('app').controller('IssuesCtrl', function($scope, IssuesService) {
  var issuesCtrl = this;

  IssuesService.getIssues().then(function(issues) {
    issuesCtrl.issues = issues;
  });

  $scope.$broadcast('my-event', {data: "ready"});
});