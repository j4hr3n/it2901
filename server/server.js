if (Meteor.isServer){
	Meteor.startup(function () {
		Meteor.publish("allUsers", function () {
		  return Meteor.users.find({}, {'profile': 1, 'username': 1, 'notifications' : 1});
		});
	});

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
			Meteor.users.update({_id : Meteor.userId()}, { $push : { "profile.friends" : theUser }})
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
}