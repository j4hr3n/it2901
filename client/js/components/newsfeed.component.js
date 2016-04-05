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

	this.postsPerPage = 10
	this.pageNumber = 1;

	this.helpers({
		posts: () => {
			return NewsPosts.find({})
		},
		postsCount: () => {
          return Counts.get('numberOfNewsfeedPosts');
        }
	})

	this.subscribe("newsfeedPosts", () => {
		return [{
			limit: parseInt(this.postsPerPage),
			skip: parseInt(
				(this.getReactively('pageNumber')-1) * this.postsPerPage),
			sort: { date: 1}
		}]
	})

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