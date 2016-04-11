Meteor.methods({
	'addFriend' : function(theUser){
		Meteor.users.update({_id : theUser._id}, { $push : { "profile.notifications.friendRequests" : 
			{'_id' : Meteor.userId(),
			'username' : Meteor.user().username,
			'time' : Date.now(),
			'status' : false
			}
		}})
		//console.log(Meteor.users.findOne({username: "Babs"}, {notifications:1, _id:0}))
		//Meteor.users.update({_id : Meteor.userId()}, { $push : { "profile.friends" : theUser }})
	},

	'addNewsPost' : (user, data, isPublic = false) => {
		/* 'data needs one of the following properties:

		friendAdded : { newFriendID: <user id>}
		userPost: { title: <string>,
					description: <string>,
					resources (optional): <reference>}
		newEvent: { eventID: <eventID>}
		joinedEvent: { eventID: <eventID>}
		*/
		
		if (_.size(data) != 1) {
			throw new Meteor.Error(404, "'data' needs to have exactly one"
				+" type (friendAdded, userPost, newEvent, etc., "
				+" see method comment for more info.)");
		}

		if data.hasOwnProperty("friendAdded") {
			var info = data.friendAdded;
			var type = "friendAdded";
		} else if data.hasOwnProperty("userPost") {
			var info = data.userPost;
			var type = "userPost";
		} else if data.hasOwnProperty("newEvent") {
			var info = data.newEvent;
			var type = "newEvent";
		} else if data.hasOwnProperty("joinedEvent") {
			var info = data.joinedEvent;
			var type = "joinedEvent";
		} else {
			throw new Meteor.Error(404, "'data' needs to have exactly one"
				+" type (friendAdded, newActivity, userPost, newEvent, etc., "
				+" see method comment for more info.)");
		}

		NewsPosts.insert({
			owner: user,
	        info: info,
	        type: type,
	        date: new Date(),
	        "public": isPublic
      });
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