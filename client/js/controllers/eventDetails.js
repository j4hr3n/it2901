angular
.module('it2901')
.controller('eventDetailsCtrl', eventDetailsCtrl);

function eventDetailsCtrl($scope, $stateParams, $reactive) {  
    $reactive(this).attach($scope);

    this.subscribe('events');
    this.subscribe('allUsers');

    this.helpers({
        events: () => {
           return Events.find({});
         },

         currentEvent: () => {
          if (!Meteor.userId())
            throw new Meteor.Error(404, "Need to be logged in to access events.");

          if (!$stateParams.eventId)
            return null;

          ev = Events.findOne({_id: $stateParams.eventId})

          console.log("Events.findOne({_id: "+$stateParams.eventId +" }) = "
            + Events.findOne({_id: $stateParams.eventId}));

          if (ev == null) {
            throw new Meteor.Error(404, "Event not found."+$stateParams.eventId);
          } else {
            return ev;
          }
        } 
      });


    $scope.eventId = $stateParams.eventId;
    $scope.count = 0;

    $scope.participants = this.currentEvent.participants
    for (var i = 0; i < this.currentEvent.participants.length; i++) {
      
      if (this.currentEvent.participants[i].attending == true) {
          $scope.count++;
      }
    };

    $scope.fireEditEventModal = function() {
      $('.ui.small.modal.editEvent').modal('show');
    }

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

      this.save = () => {


      Events.update({
      _id: this.currentEvent._id
    }, {
      $set: {
        name: this.currentEvent.name,
        description: this.currentEvent.description,
        date: this.currentEvent.date,
        location: this.currentEvent.location,
        //participants: this.currentEvent.participants,
        type: this.currentEvent.type,
        level: this.currentEvent.level,
        //exercises: 
         public: this.currentEvent.public,
      }
    }, (error) => {
      if (error) {
        console.log('Oops, unable to update the event...');
      } else {
        console.log('Done!');
        $('.ui.small.modal.editEvent').modal('hide');
      }
    });
    }


};
