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
    this.resetEvent();

    

    this.fireCreateEventModal = function() {

        $('.ui.small.modal.createEvent').modal({ detachable: false }).modal('refresh').modal('show');
        
        
        $('#datepick').datepicker({ language: 'no'});
        $('#datepick').datepicker().on("changeDate", function(e) {

            newDate = new Date(e.date);

            date = (newDate.getDate() < 10 ? "0"+newDate.getDate() : newDate.getDate())
            month = ((newDate.getMonth()+1) < 10 ? "0"+(newDate.getMonth()+1) : (newDate.getMonth()+1))
            
            $("#datepickInput").val(
                newDate.getFullYear()+"-"+month+"-"+date);
        });
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
          return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    }, 
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
            
/*
        this.newEvent.owner = Meteor.user()._id;
        var ev_id = Events.insert(this.newEvent);
console.log("participants: " + this.newEvent.participants);

        var ev = Events.findOne({ '_id' : ev_id });
        Events.update({_id : ev._id}, { $push : { "participants" : Meteor.user()._id}
        });

 console.log("participants: " +  ev.participants.length);

        //legge til newEvent for alle de som er invitert, work in progress
        if(this.newEvent.participants != null){
        for(var i = 0; i < this.newEvent.participants.length; i++ ){

            theUser = Meteor.users.findOne({'_id' : this.newEvent.participants[i]._id});
            Meteor.call('addEvent', theUser, ev);
        }
        }

        this.newEvent = {};

        $('.ui.small.modal.createEvent').modal('hide');
    }
}; 
*/
