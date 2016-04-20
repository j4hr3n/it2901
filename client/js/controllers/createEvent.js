angular
.module('it2901')
.controller('createEventCtrl', createEventCtrl);

function createEventCtrl($scope, $reactive) {  
    $reactive(this).attach($scope);

    
    //console.log(Meteor.user())

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


    /*this.addEvent = () => {
            
        this.newEvent.owner = Meteor.user()._id;
        this.newEvent.createdBy = Meteor.user().username;
        this.newEvent.isAttendingCount = 0;
        var ev_id = Events.insert(this.newEvent);
        var ev = Events.findOne({ '_id' : ev_id });

        //legge til newEvent for alle de som er invitert, work in progress
        for(var i = 0; i < this.newEvent.participants.length; i++ ){

            theUser = Meteor.users.findOne({'_id' : this.newEvent.participants[i]._id});
            Meteor.call('addEvent', theUser, ev);
        }
    }*/

        this.newEvent = {};

        $('.ui.small.modal.createEvent').modal('hide');

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
            "public": "",
            createdBy : ""
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