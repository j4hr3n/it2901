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

	'endrePassord' : function(newPassword){
		Accounts.setPassword(Meteor.userId(), newPassword)
	},

	//This updates the db with profile pic
	'addProfilePicture' : function(link){
			//console.log(link);
			Meteor.users.update({_id : Meteor.userId()}, {$set : { "profile.profilePicture" : link}})
		},

	'acceptEvent' : function(eventId){

          var ev = Events.findOne(eventId);
          var test = Events.update({_id : eventId, "participants" : { $elemMatch : { "username" : Meteor.user().username} } }, { $set : { "participants.$.attending" : GOING}});
          console.log("test: " + test);
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

	'createEvent' : function(owner, name, description, date, location, participants, type,
		exercises, isPublic) {

		var newEvent = {
			owner: owner,
	        name: name,
	        description: description,
	        date: date,
	        location: location,
	        participants: participants,
	        type: type,
	        exercises: exercises,
	        "public": isPublic,
            createdBy : ""
	    }
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
        /*for(var participant in newEvent.participants){
			Meteor.users.update(
				{_id : participant._id},
				{ $push : { "profile.events" : { eventID: ev_id, participating: 0} } }
			);
        }*/
        Meteor.call("createNewsPost", owner, { "newEvent":	{ eventID: ev_id} });

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
