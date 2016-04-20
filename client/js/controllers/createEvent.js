angular
.module('it2901')
.controller('createEventCtrl', createEventCtrl);

function createEventCtrl($scope, $reactive) {  
    $reactive(this).attach($scope);


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

    this.fireCreateEventModal = function() {
        this.resetEvent();
        
        $('.ui.small.modal.createEvent').modal('show');
        
        $('#datepick').datepicker({ language: 'no'});
        $('#datepick').datepicker().on("changeDate", function(e) {

            newDate = new Date(e.date);

            date = (newDate.getDate() < 10 ? "0"+newDate.getDate() : newDate.getDate())
            month = ((newDate.getMonth()+1) < 10 ? "0"+(newDate.getMonth()+1) : (newDate.getMonth()+1))
            
            $("#datepickInput").val(
                newDate.getFullYear()+"-"+month+"-"+date);
        });
    }

    $scope.fireDatepicker = function() {
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