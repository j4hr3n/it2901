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
    .state('downloads',{
      url: '/downloads',
      templateUrl: 'client/templates/downloads.html'
    })
    .state('loggedIn',{
      url: '/LoggedIn',
      templateUrl: 'client/templates/LoggedInScreen.html'
    })
    .state('network',{
      url: '/network',
      templateUrl: 'client/templates/network.html',
      controller: 'networkController'
    })
    .state('balanse', {
      url: '/activities/balanse',
      templateUrl: 'client/templates/balanse.html'
    })

  $urlRouterProvider.otherwise('/');
}
