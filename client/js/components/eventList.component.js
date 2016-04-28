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

  this.subscribe('events');

  this.helpers({
      events: () => {
        var user =  Meteor.user();

        if (user) {
          return user.profile.events;

        } else {
          return null;
        }
     }
  });

  this.removeEvent = (event) => {
    Events.remove({_id: event._id});    
  }
}; 