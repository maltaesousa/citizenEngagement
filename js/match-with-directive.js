angular.module('app').directive('matchWith', function() {
  return {
    require: 'ngModel',
    scope: {
      value: "=matchWith"
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.matchWith = function(modelValue) {
        return modelValue == scope.value;
      };
      scope.$watch("value", function() {
        ngModel.$validate();
      });
    }
  };
});