Meteor.methods({
	'createUser' : (username, password, email, nameFirst, nameLast, bio) => {
		this.user = {
		    'username': username,
		    'password': password,
		    'email': email,
		    'profile': {
		      'nameFirst': nameFirst,
		      'nameLast': nameLast,
		      'bio': bio,
		      'friends': [],
		      'notifications' : {
		        'friendRequests' : [],
		        'activities' : []
		      }
		    }
		};

		Accounts.createUser(this.user, (err) => {
			if (err) {
				console.log("Failed creating new user: " + err);
				throw new Meteor.Error(404, "Failed creating new user.");
			}
			else {
				console.log("Created new user: " + this.user.username);
			}
		});
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
		
		if (_.size(info) != 1) {
			throw new Meteor.Error(404, "'info' needs to have exactly one"
				+" type (friendAdded, userPost, newEvent, etc., "
				+" see method comment for more info.)");
		}
		newsPost_new = {};

		if info.hasOwnProperty("friendAdded") {
			newsPost_new.type = "friendAdded";
			newsPost_new.newFriendID = info.friendAdded.newFriendID;

		} else if info.hasOwnProperty("userPost") {
			newsPost_new.type = "userPost";
			newsPost_new.title = info.userPost.title;
			newsPost_new.description = info.userPost.description;

			if info.userPost.hasOwnProperty("resources") {
				newsPost_new.resources = info.userPost.resources;
			}
		} else if info.hasOwnProperty("newEvent") {
			newsPost_new.type = "newEvent";
			newsPost_new..newEvent = info.newEvent;

		} else if info.hasOwnProperty("joinedEvent") {
			newsPost_new.type = "joinedEvent";
			newsPost_new.joinedEvent = info.joinedEvent;

		} else {
			throw new Meteor.Error(404, "'info' needs to have exactly one"
				+" type (friendAdded, newActivity, userPost, newEvent, etc., "
				+" see method comment for more info.)");
		}
		newsPost_new.ownerID = userID;
		newsPost_new.public = isPublic;
		newsPost_new.date = new Date();

		NewsPosts.insert(newsPost_new);
	},

	'addFriend' : function(theUser){
		Meteor.users.update({_id : theUser._id}, 
			{ $push : { "profile.notifications.friendRequests" : 
			{'_id' : Meteor.userId(),
			'username' : Meteor.user().username,
			'time' : new Date(),
			'status' : false
			}
			Meteor.call("createNewsPost", { "friendAdded": 
				{ newFriendID: theUser._id});
		}})
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
	}
})