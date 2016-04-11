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
    .state('activities', {
      url: '/activities',
      templateUrl: 'client/templates/activities.html'
    })
    .state('downloads', {
      url: '/downloads',
      templateUrl: 'client/templates/downloads.html'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'client/templates/dashboard.html',
      controller: 'dashboardCtrl'
    })
    .state('dashboard.eventlist', {
      url: '/eventlist',
      templateUrl: 'client/event-list/event-list.html',
      controller : 'eventListCtrl'
    })
    .state('eventlist.createEvent',{
      url: '/createEvent',
      templateUrl: 'client/templates/createEvent.html',
      controller: 'createEventCtrl'
    })
    .state('network', {
      url: '/network',
      templateUrl: 'client/templates/network.html',
      controller: 'networkController'
    })
    .state('balanse', {
      url: '/activities/balanse',
      templateUrl: 'client/templates/balanse.html'
    })
    .state("newsfeedDebug", {
      url: '/news',
      template: '<newsfeed></newsfeed>'
    })
    .state('venner', {
      url: '/profile/venner',
      templateUrl: 'client/templates/venner.html'
    })
    .state('example', {
      url: '/example',
      templateUrl: 'client/miniex/parent.html' 
    })
    .state('dashboard.child', {
      url: '/child',
      templateUrl: 'client/event-list/event-list.html',
      controller : 'eventListCtrl'
    })
    .state('egneAktiviteter', {
      url: '/mineAktiviteter',
      templateUrl: 'client/templates/egneAktiviteter.html',
      controller: 'egneAktiviteterCtrl'
    })
    .state('egneAktiviteter.createEvent',{
      url:'/createEvent',
      templateUrl: 'client/templates/createEvent.html',
      controller: 'createEventCtrl'
    })
    .state('egneAktiviteter.eventDetails', {
      url: '/eventDetails',
      templateUrl: 'client/templates/eventDetails',
      controller: 'eventDetailsCtrl'
    })

  $urlRouterProvider.otherwise('/');
}
