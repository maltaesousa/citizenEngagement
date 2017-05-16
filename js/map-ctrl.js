angular.module('app').controller('MapCtrl', function($scope, $filter, IssuesService, $geolocation, $uibModal, $stateParams, $rootScope) {
  var map = this;
  map.markers = []; // markers shown on map
  map.issues = []; // data
  map.editMode = false; // Does the user want to add a point ?
  map.cursor = 'auto'; // handles cursor style

  map.defaults = {
    zoomControl: false // the scroll wheel you shall use
  };

  map.center = {
    // These are the coordinates for the center of Yverdon-les-Bains
    lat: 46.778474,
    lng: 6.63,
    zoom: 15 // This one is actually optional
  }

  /**
   * Markers appearance
   */
  var defaultIcon = {
    type: "vectorMarker",
    icon: "coffee",
    markerColor: "red"
  }

  /**
   * Get all the issues. It's in a function so it can be triggered
   * after creating/modifying an issue.
   */
  map.getIssues = function () {
    IssuesService.getIssues().then(function(issues) {
      _.each(issues, function(issue) {
          issue.icon = defaultIcon;
        });
        map.issues = issues;
        console.log(map.issues);
        map.markers = issues;
    });
  }
  map.getIssues();
  

  map.filterOpen = function() {
    $uibModal.open({
      templateUrl: "templates/filtermodal.html",
      controller: "FilterCtrl",
      controllerAs: "filterCtrl",
    }).closed.then(function() {
      map.getIssues();
    });
  };
  /**
   * I wanted to filter directly map.markers with pipeline filter in html
   * But it threw a lot of errors although it worked.
   * This solution, found on stackoverflow is a cleaner workaround
   */
  $scope.$watch("map.searchText", function(newVal) {
    if (newVal !== '') {
      map.markers = $filter('filter')(map.issues, {'description': newVal});
    } else {
      map.markers = map.issues;
    }
  });
/**
 * This switches the edit mode on or off
 */
  map.toggleEditMode = function(on) {
    if (on) {
      map.editMode = true;
      map.cursor = 'crosshair'
    } else {
      map.editMode = false;
      map.cursor = 'auto';
    }
  }

/**
 * What happens when user clicks on canvas.
 * 
 * Throws a "Possibly unhandled rejection"because of dismiss() in ctontroller.
 * I don't know why.
 * But when I was trying to find out why, I stumbled upon a funny comment
 * so here's the link: https://github.com/angular-ui/bootstrap/issues/6412
 * (last comment) I hope this can excuse the thrown error? :)
 */
  $scope.$on('leafletDirectiveMap.click', function(event, args) {
    if (map.editMode) {
      map.toggleEditMode();
      $uibModal.open({
        templateUrl: "templates/savemodal.html",
        controller: "SaveCtrl",
        controllerAs: "saveCtrl",
        resolve: {
          latlng: args.leafletEvent.latlng
        }
      }).closed.then(function() {
        map.getIssues();
      });
    }
  });

  $scope.$on('leafletDirectiveMap.blur', function(event) {
    map.toggleEditMode();
  });

  $rootScope.$on('stateChangeSuccess', function () {
    console.log("fired");
  });

  $geolocation.getCurrentPosition()
    .then(function (position) {
      console.log(position)
    }, function (error) {
      console.log(error);
    })
});