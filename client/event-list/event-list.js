angular
.module('it2901')
.controller('eventListCtrl', eventListCtrl);

function eventListCtrl($scope, $reactive) {

    $scope.fireCreateEventModal = function() {
        $('.ui.small.modal.createEvent').modal('show');
      }

    $scope.fireDatepicker = function() {
        $('.choosedate').datepicker({});
      };

    $('#form-datepicker').datepicker();

    $('#addFriends').dropdown({
        allowAdditions: true
    });
    
    $reactive(this).attach($scope);

    this.eventForm = () => {
        document.getElementById('form').style.visibility = "visible";
    };

    this.newEvent = {};

    this.subscribe('events');

    this.helpers({
        events: () => {
           return Events.find({});
       }
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