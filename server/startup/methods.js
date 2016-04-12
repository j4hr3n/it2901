Meteor.methods({
		'inviteFriend' : function(theUser){
			Meteor.users.update({_id : theUser._id}, { $push : { "profile.notifications.friendRequests" : 
				{'_id' : Meteor.userId(),
				'username' : Meteor.user().username,
				'time' : Date.now(),
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

		'addFriend' : function(userId, bool){
			if ( bool == true ) {
				theUser = Meteor.users.findOne({'_id' : userId})
				Meteor.users.update({_id : Meteor.userId()}, { $push : { "profile.friends" : theUser }})
				Meteor.users.update({_id : userId}, {$push : {"profile.friends" : Meteor.user()}})
				Meteor.users.update({_id : Meteor.userId()}, {$pull : { "profile.notifications.friendRequests" : { '_id' : userId}}})
				Meteor.users.update({_id : userId}, {$pull : { "profile.notifications.friendRequests" : { '_id' : Meteor.user()}}})
			}else if ( bool == false){
				Meteor.users.update({_id : Meteor.userId()}, {$pull : { "profile.notifications.friendRequests" : { '_id' : userId}}})
			}

		},

		'test' : function(){
			return "hei";
		}
	})