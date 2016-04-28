const GOING 	= 	1;
const NOT_GOING =  -1;
const DEFAULT 	= 	0;

Meteor.methods({
	'createNewUser' : (username, password, email, profilePicture, nameFirst, nameLast, bio) => {
		this.user = {
		    'username': username,
		    'password': password,
		    'email': email,
		    'profile': {
		      'nameFirst': nameFirst,
		      'nameLast': nameLast,
		      'bio': bio,
		      'personalData' : [{'title': '', value: "0"}, {'title': '', value: "0"}, {'title': '', value: "0"}, {'title': '', value: "0"}, {'title': '', value: "0"}],
		      'friends': [],
		      'events' : [],
		      'notifications' : {
		        'friendRequests' : [],
		        'activities' : []
		      },
		      'messages' : [],
		      'profilePicture' : profilePicture

		    }
		};

		Accounts.createUser(this.user);
	},

	'updateEvent' : function(eventID, ownerUsername, name, description, date, 
		location, participants, type, exercises, isPublic) {
		// participants is here an array of the usernames, without attending-information

		owner = Meteor.users.findOne({ username: ownerUsername });
		if (owner == null) {
			throw new Meteor.Error(404, "The required owner '"+ 
				ownerUsername +"' doesn't exist.");
		}
		if (name == null || name == "") {
			throw new Meteor.Error(404, "The field 'name' is required.");
		}
		if (Meteor.isClient && owner != Meteor.user()
			&& Meteor.user().admin != 1) {
			throw new Meteor.Error(403, "No permission to edit another's event.");
		}

		var updatedEvent = {
			createdBy: owner.username,
	        name: name,
	        description: description,
	        date: date,
	        location: location,
	        type: type,
	        exercises: exercises,
	        "public": isPublic
	    }
	    
		Events.update(
			{ _id: eventID },
			{ $set: {
					createdBy: updatedEvent.createdBy,
			        name: updatedEvent.name,
			        description: updatedEvent.description,
			        date: updatedEvent.date,
			        location: updatedEvent.location,
			        type: updatedEvent.type,
			        exercises: updatedEvent.exercises,
			        public: updatedEvent.public
		    	}
     		}
        );
  
        Meteor.call("updateEventParticipants", eventID, participants, true, 
        	(err) => { 
        		if (err) { 
        			throw err; 
        	}}
        );
     },
	'endrePassord' : function(newPassword){
		Accounts.setPassword(Meteor.userId(), newPassword)
	},

	//This updates the db with profile pic
	'addProfilePicture' : function(link){
		//console.log(link);
		Meteor.users.update({_id : Meteor.userId()}, {$set : { "profile.profilePicture" : link}})
	},

	'updatePersonalData' : function(userID, newData){
		//console.log(UserID);
		console.log(newData);
		console.log('Hello');
		Meteor.users.update({_id : userID}, {$set : { "profile.personalData" : newData}})
	},

	'acceptEvent' : function(eventId){

		if (!Meteor.userId) {
			throw new Meteor.Error(403, "Need to be logged in to accept event invitation.")
		};

        var ev = Events.findOne(eventId);
        var test = Events.update({_id : eventId, "participants" : { $elemMatch : { "username" : Meteor.user().username} } }, { $set : { "participants.$.attending" : GOING}});
        console.log("test: " + test);

        Meteor.call("createNewsPost", Meteor.userId(), 
        	{ "joinedEvent":	{ eventID: eventId} });
/*
		events = Meteor.user().profile.events;
		for (var i = 0; i < events.length; i++) {
			if (events[i].eventId == eventId){

				Meteor.users.update({_id : Meteor.userId(), "profile.events.eventId": eventId},{$set : {"profile.events.$.attending" : GOING}})
				Events.update({_id : eventId, "participants.username" : Meteor.user().username}, { $set : { "participants.$.attending" : GOING}})
			}
		};*/
	},

	'denyEvent' : function(eventId){

		var ev = Events.findOne(eventId);
          Events.update({_id : eventId, "participants.username" : Meteor.user().username}, { $set : { "participants.$.attending" : NOT_GOING}});
/*
		evs = Meteor.user().profile.events
		for (var i = 0; i < evs.length; i++) {
			if (evs[i].eventId == eventId){
				Meteor.users.update({_id : Meteor.userId()}, {$pull : { "profile.events" : { "eventId" : eventId}}})
				Events.update({_id : eventId}, { $pull : { "participants" : { "username" : Meteor.user().username}}})
				//Events.update({_id : eventId}, { $inc : { "isAttendingCount" : -1}})
				//Meteor.events.update({_id : eventId}, {$pull : {"participants" : { _id : Meteor.user()}}})
				//Meteor.events.remove({"_id" : eventId})
			}
		};*/

	},

	'deleteEvent' : function(eventId){
		Meteor.users.update({}, {$pull : { "profile.events" : { "eventId" : eventId}}}, { "multi" : true })
		Events.remove(eventId);
	},

	'updateEventParticipants': (eventID, newParticipants, resetAttendees=true) => {
		console.log("'updateEventParticipants' called with "+eventID+" and "+newParticipants)

		uEvent = Events.findOne({ _id: eventID });

    	if (uEvent == null) {
    		throw new Meteor.Error(404, "Unable to find event with ID='"
    			+ eventID +"'");
    	}

		existingAttends = {};
		for (var i = 0; i < uEvent.participants.length; i++) {
			attUsername = uEvent.participants[i].username;
			
			existingAttends[attUsername] = uEvent.participants[i].attending;

			console.log("pulling "+ attUsername+ " from "+uEvent.name)
			Meteor.users.update({ username : attUsername}, 
				{$pull : { "profile.events" : { "eventId" : eventID}}})
		}

		newParticipants_formatted = [];

		newParticipants.forEach( (participant) => {

	    	if (Meteor.users.findOne({username: participant}) == null) {
	    		throw new Meteor.Error(404, "Unable to find participant username '"
	    			+ participant +"'");
	    	}

	    	if (!resetAttendees && existingAttends[uEvent.createdBy] != undefined)
		    	attending = existingAttends[uEvent.createdBy];
		    else {
		    	attending = (participant == uEvent.createdBy) ? GOING : DEFAULT;
		    	console.log("[participants] OwnerComparison: "+participant+" == "+uEvent.createdBy)
		    }
	    	
	    	newParticipants_formatted.push(
	    		{ username: participant, "attending" : attending})

        	wr = Meteor.users.update(
				{ username : participant },
				{ $push: { "profile.events": 
						{ 
							"eventId": eventID,
							"eventName": uEvent.name,
							"owner": uEvent.createdBy, 
							"attending": attending
						}
					} 
				}
			);

	    	console.log("[participants] "+ uEvent.name +": username: "+  participant
	    		+ " attending: "+ attending +" WR: "+ wr);
	    	console.log(Meteor.users.findOne({username:participant}).profile.events);
        })
        
        Events.update({ _id: eventID },
        	{$set: 
        		{ participants: newParticipants_formatted }
        	});
        console.log("[participants] Final result of Event:")
	    console.log(Events.findOne({_id: uEvent._id}).participants)
	},

	'createNewEvent' : function(ownerUsername, name="", description="", date=null, 
		location=null, participants=[], type=null, exercises=null, isPublic=false) {

		owner = Meteor.users.findOne({ username: ownerUsername });
		if (owner == null) {
			throw new Meteor.Error(404, "The required owner '"+ 
				ownerUsername +"' doesn't exist.");
		}
		if (name == null || name == "") {
			throw new Meteor.Error(404, "The field 'name' is required.");
		}
		if (Meteor.isClient && owner != Meteor.user()
			&& Meteor.user().admin != 1) {
			throw new Meteor.Error(403, "No permission to create event for others.");
		}

		var newEvent = {
			createdBy: owner.username,
	        name: name,
	        description: description,
	        date: date,
	        location: location,
	        participants: [],
	        type: type,
	        exercises: exercises,
	        "public": isPublic
	    }
	    
        var ev_id = Events.insert(newEvent);

        Meteor.call("updateEventParticipants", ev_id, participants, true, 
        	(err) => { 
        		if (err) { 
        			Events.remove({ _id: ev_id });
        			throw err; 
        	}}
        );

        Meteor.call("createNewsPost", owner._id, { "newEvent":	{ eventID: ev_id} });
/*
	    participants = [];
	    for (var i = 0; i < newEvent.participants.length; i++) {
	    	participants.push({ username: newEvent.participants[i].username, "attending" : DEFAULT})
	    };
	    participants.push({username : Meteor.user().username, "attending" : GOING});
	    newEvent.participants = participants;
	    newEvent.createdBy = Meteor.user().username;
        var ev_id = Events.insert(newEvent);
        newEvent.participants.forEach(function(participant){
        	Meteor.users.update(
				{ username : participant.username},
				{ $push : { "profile.events" : { eventId: ev_id, eventName : newEvent.name,  owner : newEvent.owner, attending: false} } }
			);
        })
*/
        /*for(var participant in newEvent.participants){
			Meteor.users.update(
				{_id : participant._id},
				{ $push : { "profile.events" : { eventID: ev_id, participating: 0} } }
			);
        }*/

	},

	'createNewsPost' : (userID, info, isPublic = false) => {
		/* 'info needs one of the following properties:

		friendAdded : { newFriendID: <user id>}
		userPost: { title: <string>,
					description: <string>,
					resources (optional): <reference>}
		newEvent: { eventID: <eventID>}
		joinedEvent: { eventID: <eventID>}
		*/

		if (info.hasOwnProperty("friendAdded") == "undefined") {
			throw new Meteor.Error(404, "'info' is undefined");
		}
		newsPost_new = {};

		if (info.hasOwnProperty("friendAdded"))  {
			newsPost_new.type = "friendAdded";
			newsPost_new.newFriendID = info.friendAdded.newFriendID;

		} else if (info.hasOwnProperty("userPost")) {
			if (info.userPost.title == "" || info.userPost.description == "")
				throw new Meteor.Error(404, "Empty title or description");

			newsPost_new.type = "userPost";

			newsPost_new.title = info.userPost.title;
			newsPost_new.description = info.userPost.description;

			if (info.userPost.hasOwnProperty("resources")) {
				newsPost_new.resources = info.userPost.resources;
			}
		} else if (info.hasOwnProperty("newEvent")) {
			newsPost_new.type = "newEvent";
			newsPost_new.eventID = info.newEvent.eventID;

		} else if (info.hasOwnProperty("joinedEvent")) {
			newsPost_new.type = "joinedEvent";
			newsPost_new.eventID = info.joinedEvent.eventID;

		} else {
			throw new Meteor.Error(404, "'info' lacks one of the required properties"
				+" types (friendAdded, userPost, newEvent, etc.), "
				+" see this method's comment for more info.)");
		}

		newsPost_new.ownerID = userID;
		newsPost_new.public = isPublic;
		newsPost_new.date = new Date();

		NewsPosts.insert(newsPost_new);

	},

	'sendMessage' : function(message, messageList){
		var date = new Date();
		time = date.toDateString() + " " + date.getHours().toString() + ":" + date.getMinutes();
		for (var i = 0; i < messageList.length; i++) {
			Meteor.users.update({username : messageList[i]}, { $push : { "profile.messages" :
				{
					'from' : Meteor.user().username,
					'message' : message,
					'time' : time,
					'status' : false
				}
			}});
		};
	},

	'deleteMessage' : function(message){
		var messages = Meteor.user().profile.messages;
		for (var i = 0; i < messages.length; i++) {
		  if (messages[i].message === message){
		    Meteor.users.update({_id : Meteor.userId()}, {$pull : { "profile.messages" : { "message" : message}}})
		  }
		};
	},

/*
	'addEvent' : function(theUser, theEvent){
		Meteor.users.update({_id : theUser._id}, { $push : { "profile.events" : theEvent}
		});
	},

	'updateEvent' : function(theUser, theEvent, ){

		if(theUser._id == theEvent.owner){
			var id = theEvent._id;
			//Meteor.users.update( { }, { $pull : { "profile.events" : {"_id" : id} }}, { "multi" : true });
			Events.update({'_id': id});
		}
	},
*/

	'inviteFriend' : function(theUser){
		Meteor.users.update({_id : theUser._id}, { $push : { "profile.notifications.friendRequests" :
			{'_id' : Meteor.userId(),
			'username' : Meteor.user().username,
			'time' : new Date(),
			'status' : false
			}
		}});


		//console.log(Meteor.users.findOne({username: "Babs"}, {notifications:1, _id:0}))
		//Meteor.users.update({_id : Meteor.userId()}, { $push : { "profile.friends" : theUser }})
	},

	'getFriends' : function(){
		var friendList = []
		friendObject = Meteor.user().profile.friends
		for (var i = 0; i < friendObject.length; i++) {
		  friendList.push(friendObject[i]._id)
		};
		return friendList;
	},

	'test' : function(){
		return "hei";
	},

	'addFriend' : function(userId, bool){
		if ( bool == true ) {
			theUser = Meteor.users.findOne({'_id' : userId})
			Meteor.users.update({_id : Meteor.userId()}, { $push : { "profile.friends" : theUser }})
			Meteor.users.update({_id : userId}, {$push : {"profile.friends" : Meteor.user()}})
			Meteor.users.update({_id : Meteor.userId()}, {$pull : { "profile.notifications.friendRequests" : { '_id' : userId}}})
			Meteor.users.update({_id : userId}, {$pull : { "profile.notifications.friendRequests" : { '_id' : Meteor.user()}}})

			Meteor.call("createNewsPost", Meteor.userId(), { "friendAdded":
				{ newFriendID: userId}});
		} else if ( bool == false){
			Meteor.users.update({_id : Meteor.userId()}, {$pull : { "profile.notifications.friendRequests" : { '_id' : userId}}})
		}

	},

	'getFriends' : function(){
		var friendList = []
		friendObject = Meteor.user().profile.friends
		for (var i = 0; i < friendObject.length; i++) {
		  friendList.push(friendObject[i]._id)
		};
		return friendList;
	},

	'deleteFriend' : function(userName){
		var theUser = Meteor.users.findOne({username : userName})
		Meteor.users.update({_id : Meteor.userId()}, { $pull : { "profile.friends" : { username : userName} }});
		Meteor.users.update({ username : userName}, { $pull : { "profile.friends" : { username : Meteor.user().username} }});
	}
})
