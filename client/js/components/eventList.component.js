angular
.module('it2901')
.directive('eventList', () => {
    return {
        restrict: "E",
        templateUrl: "client/js/components/eventList.html",
        controllerAs: "evList",
        controller: eventListCtrl
    }
});

function eventListCtrl ($scope, $reactive) {
  $reactive(this).attach($scope);

$scope.quantity = 3;

  this.subscribe('events');

  this.helpers({
    events: () => {
      var user =  Meteor.user();

      if (user) {
        return user.profile.events.map((event) => {
          attending = event.attending;

          event = Events.findOne(event.eventId);

          if (event != undefined) {
            event.attending = attending;

            return event;

          } else {
            return;
          }
        });

      } else {
        return null;
      }
    }, 

    eventNotification: () => {
      return Meteor.user().profile.events.length
    } 
  });

  this.removeEvent = (event) => {
    Events.remove({_id: event._id});    
  }
}; 