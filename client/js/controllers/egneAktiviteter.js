angular
.module('it2901')
.controller('egneAktiviteterCtrl', egneAktiviteterCtrl);

function egneAktiviteterCtrl($scope, $reactive) {  
    $reactive(this).attach($scope);

     $scope.fireCreateEventModal = function() {
        $('.ui.small.modal.createEvent').modal('show');
      }

    $scope.fireDatepicker = function() {
    $('.choosedate').datepicker({});
      }

    $('#addFriends').dropdown({
        allowAdditions: true
    });

    $('.ui.status.button').popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 300,
      hide: 800
    }
  })
;

    this.newEvent = {};

    this.subscribe('events');

    this.helpers({
        events: () => {
           return Events.find({});
       }, /*
        oneEvent: () => {
          return Events.findOne({_id: $stateParams.eventId});
        },*/
   });

    this.addEvent = () => {
        this.newEvent.owner = Meteor.user()._id;
        Events.insert(this.newEvent);
        this.newEvent = {};
    };

    this.removeEvent = (event) => {
        Events.remove({_id: event._id});
    }


}; 