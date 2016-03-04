'use strict';
  angular
    .module('it2901',
      ['angular-meteor',
      'ui.router'
      ])
    .run(function($rootScope){
      $rootScope.fireLoginModal = function(){
        console.log("login clicked");
        alert("hello")
        $('#loginModal').modal('show');
      }
    })
