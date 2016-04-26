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

    $scope.eventNotification = function(){
      user = Meteor.user();
      return user.profile.events.length
    } 
    
    $reactive(this).attach($scope);

    this.newEvent = {};

    this.subscribe('events');

    this.helpers({
      events: () => {

        var display = [];
        var evs = Meteor.user().profile.events;
        var all = Events.find({});

        for(var i = 0; i < evs.length; i++){

          var oid = evs[i].eventId;
          var temp = Events.findOne(oid);

          display.push(temp);
        }

        all.forEach(function(ev){
          if(ev.public == true){
            var should_insert = true;
            for(var i = 0; i < display.length; i++){
              if(display[i]._id == ev._id){
                should_insert=false;
                break;
              }
            }
            if (should_insert) {
              display.push(ev);
            }
          }
        });
//Sorter events på dato
        display.sort(function(a,b){
          return new Date(a.date) - new Date(b.date);
        });

        return display;
      }
    });

  
    this.removeEvent = (event) => {
        Events.remove({_id: event._id});
        
    }


}; 