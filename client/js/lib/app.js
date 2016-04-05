'use strict';
  angular
    .module('it2901',
      ['angular-meteor',
      'ui.router',
      'accounts.ui',
      'angularUtils.directives.dirPagination'
      ])
    .run(function($rootScope){
      $rootScope.fireLoginModal = function(){
        $('.ui.small.modal.login').modal('show');
      },
      $rootScope.fireRegisterModal = function(){
        $('.ui.small.modal.register').modal('show');
      }
    })
    
  Meteor.subscribe("allUsers");

