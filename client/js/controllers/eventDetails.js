angular
.module('it2901')
.controller('eventDetailsCtrl', eventDetailsCtrl);

function eventDetailsCtrl($scope, $stateParams, $reactive, $state) {  
  $reactive(this).attach($scope);

    this.subscribe('events');
    this.subscribe('allUsers');

    this.helpers({
        events: () => {
           return Events.find({});
         },

         currentEvent: () => {
          if (!$stateParams.eventId) {
            $state.go("eventsMainView")
            return null;
          }

          if (!Meteor.userId())
            throw new Meteor.Error(404, "Need to be logged in to access events.");

          ev = Events.findOne({_id: $stateParams.eventId})

          if (ev != null) {
            return ev;

          } else {
            console.log("[eventDetails] Event not found: '"+ $stateParams.eventId +"'");

            $state.go("eventsMainView")
            return null;
          }
        } 
      });


  $scope.eventId = $stateParams.eventId;

    $scope.participants = this.currentEvent.participants
    for (var i = 0; i < this.currentEvent.participants.length; i++) {
      
      if (this.currentEvent.participants[i].attending == true) {
          $scope.count++;
      }
    };

  $scope.goingFilter = function(object) {
    return object.attending == 1;
  }

  $scope.participants = Events.findOne({_id : $scope.eventId}).participants
  for (var i = 0; i < $scope.participants.length; i++) {
    if ($scope.participants[i].attending == true){
      $scope.count++;
    }
  };

  $('#addUsers').dropdown({
    allowAdditions: true
  });

  $('.ui.fluid.search.dropdown').dropdown({});

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
  
  this.helpers({
    events: () => {
     return Events.find({});
   },
   currentEvent: () => {
    return Events.findOne({_id: $stateParams.eventId});
  },

  attending: () => {
    var part = Events.findOne( {_id: $stateParams.eventId}).participants;
  
    for (var i = 0; i < part.length; i++ ) {
      elem = part[i];
      if (elem.username == Meteor.user().username ) {
        att = elem.attending;
        break;
      }
    }

    var status;    
    switch (att) {
      
    case -1:
      status = "Deltar ikke";
      break;
    case 0:
      status = "";
      break;
    case 1:
      status = "Deltar";
      break;
    }
    console.log("status: " + status);
    return status;
  }, 
});

};
