angular.module('app').controller('MapCtrl', function(
  $scope, $filter, IssuesService, $geolocation, $uibModal, $stateParams, $rootScope) {
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
    lat: 46.778,
    lng: 6.641,
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
   * Get all the issues. It's in a function so it can be called
   * after creating/modifying an issue to refresh view.
   */
  map.getIssues = function () {
    IssuesService.getIssues().then(function(issues) {
      _.each(issues, function(issue) {
          issue.icon = defaultIcon;
        });
        map.issues = issues;
        map.markers = issues;
        console.log('appelé');
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
      }).result.then(function() {
        map.getIssues();
      }, function() {
        /**
         * Need to do something when modal is dismissed otherwise an error is shown
         * see here: https://github.com/angular-ui/bootstrap/issues/6412
         * (last comment is funny)
         */
        console.log('Modal dismissed');
      });
    }
  });

  $scope.$on('leafletDirectiveMap.blur', function(event) {
    map.toggleEditMode();
  });

  $scope.$on('leafletDirectiveMarker.click', function(event, args) {
    console.log(args);
  });

  /**
   * Zoom to marker with id provided in the state
   * 
   * C'est pas très beau, c'est appelé autant de fois qu'il y a de markers.
   * Apparemment, a chaque marker ajouté = un content loaded. Il faudrait que
   * le chargement du state se comporte comme une promesse et qu'une fois tous les
   * markers ajoutés, on fasse le zoom.
   * 
   * J'ai vu que cette manière de faire avec les event est dépréciée et qu'une nouvelle
   * approche existe à l'aide de "Transtions hooks". Je n'ai malheureusement pas 
   * le temps de le tester
   */
  $scope.$on('$viewContentLoaded', function () {
    if ($stateParams.id) {
      issue = _.find(map.markers, {id: $stateParams.id});
      map.center = {
        lat: issue.lat,
        lng: issue.lng,
        zoom: 18
      }
    }
  });

  $geolocation.getCurrentPosition()
    .then(function (position) {
      console.log(position)
    }, function (error) {
      console.log(error);
    })
});