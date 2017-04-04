angular.module('app', ['ui.router', 'angular-storage']);

angular.module('app').config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
    $stateProvider
    .state('home', {
        url: '',
        templateUrl: './templates/main.html'
    });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: './templates/login.html',
        controller: 'LoginCtrl as login'
    });

    $stateProvider.state('second', {
        url: '/second',
        templateUrl: './templates/second.html'
    });

    $urlRouterProvider.otherwise(function($injector) {
        $injector.get('$state').go('home');
    });
});

angular.module('app').run(function(AuthService, $rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (!AuthService.token && toState.name !== 'login') {
            event.preventDefault();
            $state.go('login');
        }
    });
});

angular.module('app').run(function(AuthService, $rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (!AuthService.token && toState.name !== 'login') {
            event.preventDefault();
            $state.go('login');
        }
    });
});