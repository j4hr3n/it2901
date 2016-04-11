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
    Events.remove({
      _id: event._id
    });
  }


};
