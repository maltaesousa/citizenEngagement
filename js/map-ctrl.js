angular.module('app').controller('MapCtrl', function(
  $scope, $filter, IssuesService, $geolocation, $uibModal, $stateParams, $rootScope) {
  var map = this;
  map.markers = []; // markers shown on map, can be a filtered version of map.issues
  map.issues = []; // data provided by IssueService
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
  };

  /**
   * This controls the colors depending on states
   */
  map.colors = {
    'new': 'red',
    'inProgress': 'orange',
    'rejected':'gray',
    'resolved':'green'
  };

  /**
   * This controls the icons depending on types
   */
  map.icons = {
    'dangerous-road':'road',
    'graffiti':'paint-brush',
    'broken-streetlight':'lightbulb-o'
  };

  /**
   * Get all the issues and makes them fancy
   */
  map.getIssues = function () {
    IssuesService.getIssues().then(function(issues) {
      _.each(issues, function(issue) {
          issue.icon = {
            type : "vectorMarker"
          }
          /**
           * Is there a better way to do this? I want to merge two objects
           * where the value of one will be the key of the other.
           */
          issue.icon.icon = _.get(map.icons, issue.issueType.name, 'star');
          issue.icon.markerColor = _.get(map.colors, issue.state, 'black');
        });
        map.issues = issues;
        map.markers = issues;
    });
  };
  map.getIssues();

  /**
   * Opens the modal to filter the issues shown on map
   */
  map.filterOpen = function() {
    $uibModal.open({
      templateUrl: "templates/filtermodal.html",
      controller: "FilterCtrl",
      controllerAs: "filterCtrl",
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
  };

  /**
   * If editMode is on and user clicks on map, it will open a
   * modal for user to report a new issue
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
        console.log('Modal dismissed');
      });
    }
  });

  /**
   * Toogle edit mode to off when user clicks outside the map
   */
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
   * Apparemment, a chaque marker ajouté à la carte = un content loaded. Il faudrait que
   * le chargement du state se comporte comme une promesse et qu'une fois tous les
   * markers ajoutés, on fasse le zoom.
   * 
   * J'ai vu que cette manière de faire avec les event est dépréciée et qu'une nouvelle
   * approche existe à l'aide de "Transtions hooks". Je n'ai malheureusement pas eu
   * le temps de le tester..
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

  /**
   * Zoom to user position
   */
  $geolocation.getCurrentPosition().then(function(position) {
    map.center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      zoom: 16
    }
  }, function (error) {
    console.log(error);
  })
});