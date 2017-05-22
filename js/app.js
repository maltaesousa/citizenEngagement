angular.module('app', [
  'ui.router',
  'angular-storage',
  'ui.bootstrap',
  'angularjs-dropdown-multiselect',
  'leaflet-directive',
  'ngGeolocation']);

angular.module('app').config(function ($locationProvider, $stateProvider,
 $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
    $stateProvider
    .state('home', {
        url: '/issues',
        templateUrl: './templates/main.html'
    });

    $stateProvider.state('home.issues', {
      url: '/:id',
      controller: 'IssueCtrl as issueCtrl',
      templateUrl: '/templates/issue.html'
    });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: './templates/login.html',
        controller: 'LoginCtrl as login'
    });

    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: './templates/admin.html'
    });

    $urlRouterProvider.otherwise(function($injector) {
        $injector.get('$state').go('home');
    });

    $locationProvider.html5Mode(true);
});

angular.module('app').run(function(AuthService, $rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
    console.log('fired');
        if (!AuthService.token && toState.name !== 'login') {
            console.log(AuthService.token);
            event.preventDefault();
            $state.go('login');
        }
    });
});
