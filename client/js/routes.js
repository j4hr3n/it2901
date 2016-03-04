angular
  .module('it2901')
  .config(config);

function config($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('it2901', {
      abstract: true,
      templateUrl: 'client/templates/app.html',
    })
    .state('home', {
      url: '/',
      templateUrl: 'client/templates/home.html',
      controller: 'homeController'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'client/templates/profile.html'
    })
    .state('activities',{
      url: '/activities',
      templateUrl: 'client/templates/activities.html'
    })

  $urlRouterProvider.otherwise('/');
}
