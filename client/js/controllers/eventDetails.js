angular
.module('it2901')
.controller('eventDetailsCtrl', eventDetailsCtrl);

function eventDetailsCtrl($scope, $stateParams, $reactive) {  
    $reactive(this).attach($scope);

    $scope.eventId = $stateParams.eventId;


    $('#status').popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 300,
      hide: 800
    }
  });
    $('.participants.button').popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 200,
      hide: 200
    }
  });
    $('.participating.button').popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 200,
      hide: 200
    }
  });

    this.newEvent = {};

    this.subscribe('events');
    this.subscribe('users');

    this.helpers({
        events: () => {
           return Events.find({});
       },
       currentEvent: () => {
          return Events.findOne({_id: $stateParams.eventId});
        }, 
       

   });
    this.partic
    ipating = "6";
    this.level = "middels";

    this.addEvent = () => {
        this.newEvent.owner = Meteor.user()._id;
        Events.insert(this.newEvent);
        this.newEvent = {};
    };

    this.removeEvent = (event) => {
        Events.remove({_id: event._id});
    }


}; 