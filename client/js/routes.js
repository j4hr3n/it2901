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
      url: '/contactPage',
      templateUrl: 'client/templates/contactPage.html',
      controller: ''
    })
    .state('publicProfile', {
      url: '/public/:username',
      templateUrl: 'client/templates/publicProfile.html',
      controller: 'publicProfileCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'client/templates/profile.html',
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) {


            return $q.reject('AUTH_REQUIRED');
          } else {
            return $q.resolve();
          }
        }
      }
    })

  .state('admin', {
    url: '/admin',
    templateUrl: 'client/templates/admin.html',
    controller: 'adminCtrl',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  })

  .state('activities', {
    url: '/activities',
    templateUrl: 'client/templates/activities.html',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  })


  //Balanse route
  .state('balanse', {
    url: '/activities/balanse',
    templateUrl: 'client/templates/balanse.html',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  })

  //Styrke route
  .state('styrke', {
    url: '/activities/styrke',
    templateUrl: 'client/templates/styrke.html',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  })

  //Fleksibilitet route
  .state('fleksibilitet', {
    url: '/activities/fleksibilitet',
    templateUrl: 'client/templates/fleksibilitet.html',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  })


  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'client/templates/dashboard.html',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  })

  .state('egneAktiviteter', {
      url: '/mineAktiviteter',
      templateUrl: 'client/templates/egneAktiviteter.html',
      controller: 'egneAktiviteterCtrl',
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) {
            return $q.reject('AUTH_REQUIRED');
          } else {
            return $q.resolve();
          }
        }
      }
    })
    .state('egneAktiviteter.eventDetails', {
      url: '/:eventId',
      templateUrl: 'client/templates/eventDetails.html',
      controller: 'eventDetailsCtrl',
    })

  .state('network', { // Debug?
      url: '/network',
      templateUrl: 'client/templates/network.html',
      controller: 'networkController'
    })
    .state('venner', { // Debug?
      url: '/venner',
      templateUrl: 'client/templates/venner.html',
      controller: 'profileCtrl'
    })
    .state('example', { // Debug?
      url: '/example',
      templateUrl: 'client/miniex/parent.html'
    })

  .state('personalData', {
    url: '/personalData',
    templateUrl: 'client/templates/personalData.html',
    controller: 'personalDataCtrl'
  })

  .state('*', {
    url: '/*',
    templateUrl: 'client/templates/404.html',
  });

  $urlRouterProvider.otherwise('/');
}

function run($rootScope, $state) {
  $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState,
    fromParams, error) => {
    if (error === 'AUTH_REQUIRED') {
      console.log("Login required");
      $state.go('home');
    }
  });
}
