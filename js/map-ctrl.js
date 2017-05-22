angular.module('app').controller('MapCtrl', function(
  $scope, $filter, IssuesService, $geolocation, $uibModal, $stateParams, $rootScope, $uiViewScroll, $state) {
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
    map.loading = true;
    IssuesService.getIssues().then(function(issues) {
      _.each(issues, function(issue) {
          issue.icon = {
            type : 'awesomeMarker',
            prefix: 'fa'
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
        map.loading = false;
        console.log(issues);
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
   * (and maybe the only way to do it properly)
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
    var selected = angular.element( document.querySelector( '#issue' + args.model.id ) );
    $state.go('home.issues', args.model.id);
    $uiViewScroll(selected);
    _.each(map.markers, function(issue) {
      if (args.model.id === issue.id) {
        issue.open = true;
      }
    });
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