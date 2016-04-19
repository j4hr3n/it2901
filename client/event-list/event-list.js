angular
.module('it2901')
.controller('eventListCtrl', eventListCtrl);

function eventListCtrl($scope, $reactive) {

    $scope.fireCreateEventModal = function() {
        $('.ui.small.modal.createEvent').modal('show');
      }

    /*$scope.closeModal = function(){
      $('.ui.small.modal.createEvent').modal('hide all');
      
    }*/
    
    $reactive(this).attach($scope);

    this.newEvent = {};

    this.subscribe('events');

    this.helpers({
        events: () => {
          var user =  Meteor.user();

         if(user){
          return user.profile.events;

        }
        else{
          return null;
        }
       }
   });

  
    this.removeEvent = (event) => {
        Events.remove({_id: event._id});
        
    }


}; 