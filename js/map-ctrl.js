angular.module('app').controller('MapCtrl', function($scope, IssuesService, $geolocation, $uibModal) {
  var map = this;
  map.editMode = false;
  map.cursor = 'auto'; // changes the cursor style
  map.markers = [];
  map.types = [];
  map.typeFilter=  [];
  map.filterSettings = {displayProp: 'description'};

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

  $geolocation.getCurrentPosition()
    .then(function (position) {
      console.log(position)
    }, function (error) {
      console.log(error);
    })
});