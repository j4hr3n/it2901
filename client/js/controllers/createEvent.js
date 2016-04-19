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

    $('.ui.fluid.search.dropdown').dropdown({});

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

    this.resetEvent = () => {
        this.newEvent = { // Order-sensitive: See Meteor Method "createEvent"
            owner: Meteor.user()._id,
            name: "",
            description: "",
            date: new Date(),
            location: "",
            participants:  [],
            type: "",
            exercises: "",
            "public": ""
        };
    }
    this.resetEvent();

    this.addEvent = () => {
        Meteor.apply('createEvent', _.values(this.newEvent), false, (err) => {
            if (err) {
                console.log("Failed creating new event: " + err);
            }
            else {
                console.log("Created new event: " + this.newEvent.name);
                $('.ui.small.modal.createEvent').modal('hide');
                this.resetEvent();
            }
        });
    };
}; 