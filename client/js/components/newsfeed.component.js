angular.module("it2901").directive("newsfeed", function () {
	return {
		restrict: "E",
		templateUrl: "client/js/components/newsfeed.html",
		controllerAs: "newsfeed",
		controller: newsfeedCtrl
	}
});

function newsfeedCtrl($scope, $reactive) {
	$reactive(this).attach($scope);


	this.postsPerPage = 6;
	this.elementNumber = 0;

	this.showPostCreator = false;

	this.helpers({
		posts: () => {
			if (!Meteor.userId())
				throw new Meteor.Error(403, "[Newsfeed] Need to be logged in to access newsfeed.");
			
			return NewsPosts.find({}).map((post) => {
				post.owner = Meteor.users.findOne({_id: post.ownerID });

				if (post.owner == null) {
					throw new Meteor.Error(404, "[Newsfeed] Unable to find owner ID '"
						+ post.ownerID +"'");
				}
				post.ownerLink = post.owner.username;
				
				if (post.ownerID == Meteor.userId()) {
					post.owner = "Du";
				} else {
					post.owner = (post.owner.profile.nameFirst 
						+" "+ post.owner.profile.nameLast);
				}

				switch (post.type) {
					case "friendAdded":
						if (post.newFriendID == Meteor.userId()) {

							post.newFriend = "deg";
							post.newFriendLink = Meteor.user().username;
						} else {
							post.newFriendUser = Meteor.users.findOne({_id: post.newFriendID });

							if (post.newFriendUser == null) {
								throw new Meteor.Error(404, "[Newsfeed] Unable to find user ID '"
									+ post.newFriendID +"'");
							}
							post.newFriend = (post.newFriendUser.profile.nameFirst 
								+" "+ post.newFriendUser.profile.nameLast);
							
							post.newFriendLink = post.newFriendUser.username;
						}
						break;
					case "userPost":
						post.showDesc = false;
						break;
					case "newEvent":
						post.event = Events.findOne({_id: post.eventID });
						break;
					case "joinedEvent":
						post.event = Events.findOne({_id: post.eventID });
						break;
					default:
						throw TypeError("[Newsfeed] Found post with invalid post type: \""
							+ post.type + "\"");
						break;
				}
				return post;
			});
		},
		postsCount: () => {
          return Counts.get('numberOfNewsfeedPosts');
        }
	});

	this.subscribe("events");

	this.subscribe("newsfeedPosts", () => {
		return [{
			limit: parseInt(this.postsPerPage),
			skip: parseInt(this.getReactively('elementNumber')),
			sort: { date: -1}
		}]
	});

	this.changePage = (pageDiff) => {
		console.log("[Newsfeed] changed element from "+this.elementNumber+" to "+(this.elementNumber + this.postsPerPage*pageDiff)+ " ("+this.postsPerPage+", "+pageDiff+")");
		
		this.elementNumber = Math.max(0, Math.min(this.postsCount-this.postsPerPage, 
			this.elementNumber + this.postsPerPage*pageDiff));
	};

    this.resetPost = () => {
    	this.newPost = {
			title: "",
			description: ""
    	};
    }
    this.resetPost();
	
	this.addNewPost = () => {
		Meteor.call("createNewsPost", Meteor.userId(), { "userPost":
				this.newPost});
		this.showPostCreator = false;
		this.resetPost();
	};
}