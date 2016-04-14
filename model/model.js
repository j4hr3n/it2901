//Users = new Mongo.Collection("users");

NewsPosts = new Mongo.Collection("newsPosts");

Events = new Mongo.Collection("events");

Events.allow({
	insert: function (userId, event) {
		return userId && event.owner === userId;
	},
	remove: function (userId, event){
		return userId && event.owner === userId;
	}
});