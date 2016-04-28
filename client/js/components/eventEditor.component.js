angular
.module('it2901')
.directive('eventEditor', function () {
    var linkFunction = function(scope, element, attributes) {
        scope.eventToEdit = attributes["event"];
      };
    return {
        restrict: "E",
        templateUrl: "client/js/components/eventEditor.html",
        link: linkFunction,
        controllerAs: "evEditC",
        controller:  eventEditorCtrl,
        scope: {
            eventToEdit: "@event"
        }
    }
});

function eventEditorCtrl($scope, $reactive) {  
    $reactive(this).attach($scope);

    if (!Meteor.user())
        throw new Meteor.Error(403, "[Event-editor] Not logged in.");

    this.droppedDropdown = false;

    this.userList = [];

    this.subscribe('allUsers');
    this.subscribe('events');

    this.resetEvent = () => {
        this.newEvent = { // Order-sensitive: See Meteor Method "createNewEvent"
            createdBy: Meteor.user().username,
            name: "",
            description: "",
            date: new Date(),
            location: "",
            participants: [],
            type: [],
            exercises: "",
            "public": ""
        };
    }

    this.loadEvent = () => {
        this.newEvent = Events.findOne({ _id: $scope.eventToEdit });

        if (this.newEvent == null) {
            throw new Meteor.Error(404, "[Event-editor] Event not found: '"
                +$scope.eventToEdit+"'.");
        }

        if (Meteor.user().username != this.newEvent.createdBy && Meteor.user().admin != 1) 
            throw new Meteor.Error(403, "[Event-editor] No permission to edit event.");

        this.newEvent.participants = this.newEvent.participants.map((part) => {
            return part.username;
        })
    }

    this.resetEvent();

    this.helpers({
        type: () => {
            if ($scope.eventToEdit == undefined)
                return "create";
            else {
                console.log("editable: "+$scope.eventToEdit);
                return "edit";
            }
        },
        modalID: () => {
            if (this.type == "edit")
                return $scope.eventToEdit;
            else
                return "eventCreate";
        },
        users: () => {

            return Meteor.users.find({}).map((user) => {
                if (user.username != Meteor.user().username) {

                    this.userList[user.username] = user;
                    return user;
                }
            });
        },
        participants: () => {
            if (this.type == "edit") {
                if (this.newEvent._id == undefined) {
                    this.loadEvent();
                }
                    
                console.log("newEvent participants ("+this.type+"):"+ this.newEvent._id)

                console.log(this.newEvent)
                console.log(this.newEvent.participants)
                return this.newEvent.participants
            } else {
                return [];
            }
        },
        eventType: () => {
            if (this.newEvent != undefined) {
                return this.newEvent.type;
            }
            else {
                return [];
            }
        }
    });

    this.fireEditEventModal = function() {
        if (!Meteor.user())
            throw new Meteor.Error(403, "[Event-editor] Not logged in.");

        if (this.type == "create") {
            this.resetEvent();
        } else {
            this.loadEvent();
        }

        if (!this.droppedDropdown) {

            $('.ui.fluid.search.dropdown').dropdown({});
            this.droppedDropdown = true;
        }

        $('#datepick-'+this.modalID).datepicker({ language: 'no', startDate: new Date()});

        if (this.type == "edit") {
            $('#datepick-'+this.modalID).datepicker('setDate', this.newEvent.date);
        }

        $('#modal-'+ this.modalID).modal('show');
    }

    this.submitEvent = () => {
        this.newEvent.participants = this.participants;

        this.newEvent.type = this.eventType;
        this.newEvent.date = $('#datepick-'+this.modalID).datepicker('getDate');

        console.log("submitEvent:")
        console.log($('#datepick-'+this.modalID).datepicker('getDate'))
        console.log(_.values(this.newEvent));
        
        if (this.type == "create") {

            this.newEvent.participants.push(Meteor.user().username);

            Meteor.apply('createNewEvent', _.values(this.newEvent), false, (err) => {
                if (err) {
                    console.log("Failed creating new event: " + err);
                }
                else {
                    console.log("Created new event: " + this.newEvent.name);
                    $('.ui.small.modal.editEvent').modal('hide');
                    this.resetEvent();
                }
            });
        } else {

            if (!_.contains(this.newEvent.participants, Meteor.user().username))
                this.newEvent.participants.push(Meteor.user().username);

            Meteor.apply('updateEvent', _.values(this.newEvent), false, (err) => {
                if (err) {
                    console.log("Failed updating event: " + err);
                }
                else {
                    console.log("Updated event: " + this.newEvent.name);
                    $('.ui.small.modal.editEvent').modal('hide');
                }
            });

        }
    };
};