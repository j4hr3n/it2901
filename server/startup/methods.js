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
		      'personalData' : [{'title': 'Median duration of locomotion bouts', value: "0"}, {'title': 'Number of strides', value: "0"}, {'title': 'Stride time', value: "0"}, {'title': 'Mean walking speed', value: "0"}, {'title': 'Index harmonicity', value: "0"}, {'title': 'Frequency variability', value: "0"},{'title': 'Harmonic ratio', value: "0"}, {'title': 'Dominant frequency', value: "0"}, {'title': 'Sample and permutation entropy', value: "0"}, {'title': 'Local dynamic stability', value: "0"}, {'title': 'Ingen data', value: "0"}, {'title': 'Ingen data', value: "0"}],
		      'friends': [],
		      'events' : [],
		      'exercises' : [],
		      'notifications' : {
		        'friendRequests' : [],
		        'activities' : []
		      },
		      'messages' : [],
		      'profilePicture' : profilePicture

		    }
		};

		Accounts.createUser(this.user);

		console.log("Created new user: '"+ this.user.username +"'")
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
			&& !Meteor.user().isAdmin) {
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
		console.log('[updatePersonalData] Hello');
		console.log(newData);
		Meteor.users.update({_id : userID}, {$set : { "profile.personalData" : newData}})
	},

	'acceptEvent' : function(eventId) {

		if (!Meteor.userId()) {
			throw new Meteor.Error(403, "Need to be logged in to accept event invitation.")
		};

        Events.update(
        	{_id : eventId },
        	{ $pull : { "participants" : 
        		{ username: Meteor.user().username} } }
        );       
        var changed = Events.update(
        	{_id : eventId },
        	{ $push : { "participants" : 
        		{ username: Meteor.user().username, "attending" : GOING } } }
        );

        if (changed == 0)
        	throw new Meteor.Error(404, "Unable to update database.")

        Meteor.users.update(
        	{_id : Meteor.userId() },
        	{ $pull : { "profile.events" : 
        		{ eventId: eventId} } }
        );       
        var changed = Meteor.users.update(
        	{_id : Meteor.userId() },
        	{ $push : { "profile.events" : 
        		{ eventId: eventId, "attending" : GOING } } }
        );

        if (changed == 0)
        	throw new Meteor.Error(404, "Unable to update database (Event DB may be now corrupt).")

        console.log("[acceptEvent] "+Meteor.user().username
        	+" accepted eventID: "+eventId);

        Meteor.call("createNewsPost", Meteor.userId(), 
        	{ "joinedEvent":	{ eventID: eventId} });
	},

	'denyEvent' : function(eventId) {

		if (!Meteor.userId) {
			throw new Meteor.Error(403, "Need to be logged in to deny event invitations.")
		};

        Events.update(
        	{_id : eventId },
        	{ $pull : { "participants" : 
        		{ username: Meteor.user().username} } }
        );
        var changed = Events.update(
        	{_id : eventId },
        	{ $push : { "participants" : 
        		{ username: Meteor.user().username, "attending" : NOT_GOING } } }
        );

        if (changed == 0) {
        	throw new Meteor.Error(404, "Unable to update database.")
        }

        Meteor.users.update(
        	{_id : Meteor.userId() },
        	{ $pull : { "profile.events" : 
        		{ eventId: eventId} } }
        );       
        var changed = Meteor.users.update(
        	{_id : Meteor.userId() },
        	{ $push : { "profile.events" : 
        		{ eventId: eventId, "attending" : NOT_GOING } } }
        );

        if (changed == 0)
        	throw new Meteor.Error(404, "Unable to update database (Event DB may be now corrupt).")

        console.log("[denyEvent] "+Meteor.user().username
        	+" denied eventID: "+eventId);
	},

	'deleteEvent' : function(eventId){
		Meteor.users.update({}, {$pull : { "profile.events" : { "eventId" : eventId}}}, { "multi" : true })
		Events.remove(eventId);
	},

	'updateEventParticipants': (eventID, newParticipants, resetAttendees=true) => {
		//console.log("'updateEventParticipants' called with "+eventID+" and "+newParticipants)

		uEvent = Events.findOne({ _id: eventID });

    	if (uEvent == null) {
    		throw new Meteor.Error(404, "Unable to find event with ID='"
    			+ eventID +"'");
    	}

		existingAttends = {};
		for (var i = 0; i < uEvent.participants.length; i++) {
			attUsername = uEvent.participants[i].username;
			
			existingAttends[attUsername] = uEvent.participants[i].attending;

			//console.log("pulling "+ attUsername+ " from "+uEvent.name)
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
		    	//console.log("[participants] OwnerComparison: "+participant+" == "+uEvent.createdBy)
		    }
	    	
	    	newParticipants_formatted.push(
	    		{ username: participant, "attending" : attending})

        	writeResult = Meteor.users.update(
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

	    	//console.log("[participants] "+ uEvent.name +": username: "+  participant
	    	//	+ " attending: "+ attending +" WR: "+ writeResult);
	    	//console.log(Meteor.users.findOne({username:participant}).profile.events);
        })
        
        Events.update({ _id: eventID },
        	{$set: 
        		{ participants: newParticipants_formatted }
        	});
        //console.log("[participants] Final result of Event:")
	    //console.log(Events.findOne({_id: uEvent._id}).participants)
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
			&& !Meteor.user().isAdmin) {
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
        console.log("Created new Event: '"+ newEvent.name +"'")

        Meteor.call("updateEventParticipants", ev_id, participants, true, 
        	(err) => { 
        		if (err) { 
        			Events.remove({ _id: ev_id });
        			throw err; 
        	}}
        );

        Meteor.call("createNewsPost", owner._id, { "newEvent":	{ eventID: ev_id} }, 
        	newEvent.public);
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

	'addExercisetoUser' : (userId, exId) => {
			user = Meteor.users.findOne({ _id: userId });
			ex = user.profile.exercises;
			for(var i = 0; i < ex.length; i++){
				console.log("exId: ", exId , "loopedId: ", ex[i]._id);
				if(ex[i]._id == exId){
					return
				}
			}
			Meteor.users.update({ _id : userId}, 
				{$push : { "profile.exercises" : { '_id' : exId}}});
			
			console.log("idAdded: ", exId);
			console.log("exercise added: ", user.profile.exercises);

			
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

		console.log("Created new NewsPost ("+ newsPost_new.type +")");
	},

	'createNewExercise' : function(owner, name, description, types, url) {
		exercise = {
			owner: owner,
			name: name,
			description: description,
			types: types,
			url: url
		}
		var ex_id = Exercises.insert(exercise);
		var t = Exercises.findOne({_id : ex_id});

		console.log("Created new Exercise: '"+ exercise.name +"'")
		
		//console.log('created: ', Exercises.findOne({name : exercise.name}));
/*


		owner = Meteor.users.findOne({ username: ownerUsername });
		if (owner == null) {
			throw new Meteor.Error(404, "The required owner '"+ 
				ownerUsername +"' doesn't exist.");
		}
		if (name == null || name == "") {
			throw new Meteor.Error(404, "The field 'name' is required.");
		}
		if (Meteor.isClient && owner != Meteor.user()
			&& Meteor.user().isAdmin != 1) {
			throw new Meteor.Error(403, "No permission to create exercises.");
		}*/
/*
		var newExercise = {
			createdBy: owner.username,
	        name: name,
	        description: description,
	        type: type,
	        url: url,
	        images: images
	    }*/
	    
        //var ex_id = Exercises.insert(exercise);

		//TODO Notification when admin has added new exercise
        //Meteor.call("createNewsPost", owner._id, { "newEvent":	{ eventID: ev_id} });

	},

	'removeExercise' : function(exId){
		Exercises.remove({_id : exId});
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

	'addFriend' : function(userId, bool, user2ID=null){
		if (user2ID != null && user2ID != Meteor.userId()) {
			if (Meteor.isClient && !(Meteor.user() && Meteor.user().isAdmin))
				throw Meteor.Error(403, "No permission to edit other users")

			user2 = Meteor.users.findOne({'_id' : user2ID})
		} else {
			user2ID = Meteor.userId();
			user2 = Meteor.user()
		}

		userId = Meteor.users.findOne({'_id' : userId})._id
		user = Meteor.users.findOne({'_id' : userId})

		if ( bool == true ) {

			Meteor.users.update({_id : user2ID}, 
				{ $push : { "profile.friends" : user }})
			Meteor.users.update({_id : userId}, 
				{$push : {"profile.friends" : user2}})

			Meteor.users.update({_id : user2ID}, 
				{$pull : { "profile.notifications.friendRequests" : { '_id' : userId}}})
			Meteor.users.update({_id : userId}, 
				{$pull : { "profile.notifications.friendRequests" : { '_id' : user2ID}}})

			Meteor.call("createNewsPost", user2ID, { "friendAdded":
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

	'deleteFriend' : function(username) {
		
		var theUser = Meteor.users.findOne({username: username})
		Meteor.users.update({_id : Meteor.userId()}, { $pull : { "profile.friends" : { username : username} }});
		Meteor.users.update({ username : username}, { $pull : { "profile.friends" : { username : Meteor.user().username} }});
	},

	'setUserIsAdmin' : function(username, isAdmin) {
		if (Meteor.isClient && !Meteor.user().isAdmin) {
			throw new Meteor.Error(403, "No permission to set administrators.");
		}

		Meteor.users.update({ username: username}, { $set: {isAdmin: isAdmin}});

		testuser = Meteor.users.findOne({ username: username})
		console.log("Set "+username+" to admin("+isAdmin+")")
	}
})
