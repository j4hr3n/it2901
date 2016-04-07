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

	'addNewsPost' : (user, data, 'public' = false) => {
		/* 'data needs one of the following properties:

		friendAdded : { newFriend: <user id>}
		newActivity: { activity: <activity id>}
		userPost: { title: <string>,
					description: <string>,
					resources (optional): <reference>}
		newEvent: { event: <eventID>}
		*/
		
		if (!(_.size(data) == 1))
			throw new Meteor.Error(404, "'data' needs to have exactly one"
				+" type (friendAdded, newActivity, userPost, newEvent, etc., "
				+" see method comment.)");

		if data.hasOwnProperty("friendAdded") {

		} e
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