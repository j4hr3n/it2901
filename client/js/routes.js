angular
  .module('it2901')
  .config(config)
  .run(run);

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
    .state('downloads', {
      url: '/downloads',
      templateUrl: 'client/templates/downloads.html'
    })
    .state('contactPage', {
      url : '/contactPage',
      templateUrl : 'client/templates/contactPage.html',
      controller : ''
    })

    .state('publicProfile', {
      url : '/public/:username',
      templateUrl : 'client/templates/publicProfile.html',
      controller : 'publicProfileCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'client/templates/profile.html',
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) { 
            return $q.reject('AUTH_REQUIRED');
          } else { return $q.resolve(); }
      }}
    })

    .state('activities', {
      url: '/activities',
      templateUrl: 'client/templates/activities.html',
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) { 
            return $q.reject('AUTH_REQUIRED');
          } else { return $q.resolve(); }
      }}
    })
    .state('activities.balanse', {
      url: '/activities/balanse',
      templateUrl: 'client/templates/balanse.html'
    })

    .state('dashboard', {
      templateUrl: 'client/templates/dashboard.html',
      controller: 'dashboardCtrl',
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) { 
            return $q.reject('AUTH_REQUIRED');
          } else { return $q.resolve(); }
      }}
    })
    .state('dashboard.eventlist', {
      templateUrl: 'client/event-list/event-list.html',
      controller : 'eventListCtrl'
    })
    .state('dashboard.eventlist.createEvent',{
      url: '/dashboard',
      templateUrl: 'client/templates/createEvent.html',
      controller: 'createEventCtrl'
    })

    .state('egneAktiviteter', {
      templateUrl: 'client/templates/egneAktiviteter.html',
      controller: 'egneAktiviteterCtrl',
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) { 
            return $q.reject('AUTH_REQUIRED');
          } else { return $q.resolve(); }
      }}
    })
    .state('egneAktiviteter.createEvent', {
      url: '/mineAktiviteter',
      views: {
        "createEvent": {
          templateUrl: 'client/templates/createEvent.html',
          controller: 'createEventCtrl'
        }
      }
    })
    .state('egneAktiviteter.eventDetails',{
      url: '/mineAktiviteter/:eventId',
      views: {
        "createEvent": {
          templateUrl: 'client/templates/createEvent.html',
          controller: 'createEventCtrl'
        },
        "eventDetails": {
          templateUrl: 'client/templates/eventDetails.html',
          controller: 'eventDetailsCtrl',
        }}
    })

    .state('network', { // Debug?
      url: '/network',
      templateUrl: 'client/templates/network.html',
      controller: 'networkController'
    })
    .state('venner', { // Debug?
      rl: '/venner',
      templateUrl: 'client/templates/venner.html',
      controller : 'profileCtrl'
    })
    .state('example', { // Debug?
      url: '/example',
      templateUrl: 'client/miniex/parent.html'
    })
    .state('dashboard.child', { // Debug?
      url: '/child',
      templateUrl: 'client/event-list/event-list.html',
      controller : 'eventListCtrl'
    })

    .state('personalData', {
      url : '/personalData',
      templateUrl : 'client/templates/personalData.html',
      controller : ''
    });

  $urlRouterProvider.otherwise('/');
}

function run($rootScope, $state) {
  $rootScope.$on('$stateChangeError',
    (event, toState, toParams, fromState, fromParams, error) => {
      if (error === 'AUTH_REQUIRED') {
        console.log("Login required");
        $state.go('home');
      }
    }
  );
}