NewsPosts = new Mongo.Collection("newsPosts");

Events = new Mongo.Collection("events");

Exercises = new Mongo.Collection("exercises");

PersonalData = new Mongo.Collection("personalData")

Meteor.users.allow({
	insert: function (userId, userDoc) {
		return userId && userDoc._id == userId;
	},
	update: function(userId, userDoc, fieldNames, modifier) {
		return userId && userDoc._id == userId;
	},
	remove: function (userId, userDoc){
		return userId && userDoc._id == userId;
	}
});

Events.allow({
	insert: function (userId, event) {
		return userId && event.owner == userId;
	},
	update: function(userId, event, fieldNames, modifier) {
		return userId && (event.owner == userId
			|| _.contains(event.participants, userId));
	},
	remove: function (userId, event){
		return userId && event.owner == userId;
	}
});

Exercises.allow({
	insert: function (userId, exercise) {
		return userId && exercise.owner == userId;
	},
	update: function(userId, exercise, fieldNames, modifier) {
		return userId && (exercise.owner == userId
			|| _.contains(exercise.participants, userId));
	},
	remove: function (userId, exercise){
		return userId && exercise.owner == userId;
	}
});

NewsPosts.allow({
	insert: function (userId, post) {
		return userId && post.ownerID === userId;
	},
	update: function (userId, post, fieldNames, modifier) {
		return userId && post.ownerID === userId;
	},
	remove: function (userId, post){
		return userId && post.ownerID === userId;
	}
});

//UNFINISHED. Be able to insert the data from PersonalData into the DB
PersonalData.allow({
	insert: function (userId, personalData) {
		return userId && personalData.ownerID === userId;
	},
	update: function (userId){
		return userId && personalData.ownerID === userId;
	},
	remove: function (userId){
		return userId && personalData.ownerID === userId;
	}
});