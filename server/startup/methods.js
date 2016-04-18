Meteor.methods({
	'createNewUser' : (username, password, email, admin, profilePicture, nameFirst, nameLast, bio) => {
		this.user = {
		    'username': username,
		    'password': password,
		    'email': email,
				'admin': 0,
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
				+" types (friendAdded, newActivity, userPost, newEvent, etc.), "
				+" see method comment for more info.)");
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

	'addEvent' : function(theUser, theEvent){
		Meteor.users.update({_id : theUser._id}, { $push : { "profile.events" : theEvent}
		});
	},

	'deleteEvent' : function(theEvent){
		console.log(theEvent._id);
		var id = theEvent._id;
		Meteor.users.update( { }, { $pull : { "profile.events" : {"_id" : id} }}, { "multi" : true });
		Events.remove({'_id': id});
	},

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
