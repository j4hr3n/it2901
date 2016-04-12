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

	this.postsPerPage = 10;
	this.elementNumber = 0;

	this.helpers({
		posts: () => {
			newsPosts = NewsPosts.find({});

			for (post in newsPosts) {
				post.owner = Meteor.users.findOne({_id: post.ownerID });

				switch (post.type) {
					case "friendAdded":
						post.newFriend = Meteor.users.findOne({_id: post.newFriendID });
						break;
					case "userPost":
					post.title = post.info.title;
					post.description = post.info.description;
						break;
					case "newEvent":
						post.event = Meteor.users.findOne({_id: post.eventID });
						break;
					case "joinedEvent":
						post.event = Meteor.users.findOne({_id: post.eventID });
						break;
					default:
						console.log("Found post with invalid post type: "+ post.type)
						break;
				}
			}
			return newsPosts;
		},
		postsCount: () => {
          return Counts.get('numberOfNewsfeedPosts');
        },
        friendResourcesNeeded: (posts) => {

        }
	});

	this.subscribe("newsfeedPosts", () => {
		return [{
			limit: parseInt(this.postsPerPage),
			skip: parseInt(this.getReactively('elementNumber')),
			sort: { date: 1}
		}]
	});

	this.changePage = (pageDiff) => {
		console.log("changed element from "+this.elementNumber+" to "+(this.elementNumber + this.postsPerPage*pageDiff)+ " ("+this.postsPerPage+", "+pageDiff+")");
		
		this.elementNumber = Math.max(0, Math.min(this.postsCount-this.postsPerPage, 
			this.elementNumber + this.postsPerPage*pageDiff));
		console.log(this.elementNumber);
	};

	this.newPost = {
		title: "Tittel",
		description: 'Beskrivelse',
		//date: null,
		//owner: Meteor.users.findOne()._id,
		//"public": false
    };
	
	this.addNewPost = () => {
		NewsPosts.insert({
			title: newPost.title,
			description: newPost.title,
			date: new Date(),
			owner: Meteor.user()._id,
			"public": false
		})
	};
}