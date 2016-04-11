angular
.module('it2901')
.controller('createEventCtrl', createEventCtrl);

function createEventCtrl($scope, $reactive) {  
    $reactive(this).attach($scope);


    $scope.fireCreateEventModal = function() {
        $('.ui.small.modal.createEvent').modal('show');
      }

    $scope.fireDatepicker = function() {
    $('.choosedate').datepicker({});
      }

    $('#addUsers').dropdown({
        allowAdditions: true
    });

    this.newEvent = {};

    this.subscribe('events');

    this.helpers({
        events: () => {
          return Events.find({});
       },
        users: () => {
          return Meteor.users.find({}, {'username':1});
    }, /*
        oneEvent: () => {
          return Events.findOne({_id: $stateParams.eventId});
        },*/
   });

    this.addEvent = () => {
        this.newEvent.owner = Meteor.user()._id;
        Events.insert(this.newEvent);
        this.newEvent = {};
        $('.ui.small.modal.createEvent').modal('hide');
    };

    this.removeEvent = (event) => {
        Events.remove({_id: event._id});
    }


}; 