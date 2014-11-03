if (Meteor.isClient) {

    Tracker.autorun(function() {
        Meteor.call('refreshPosts', function(posts){
            Template.posts.subreddit = function() {
                return '!frontpage';
            };
            Template.posts.posts = function() {
                return posts;
            };
        });

    });


  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
    var postsBySubreddit = { };
    Meteor.methods({
        refreshPosts:function(subreddit) {
            subreddit = subreddit || '!frontpage';
            return postsBySubreddit[subreddit] || [ ];
        }
    });
    function getPostsFromReddit(options) {
        options = options || { };
        var url = 'https://www.reddit.com/';
        if (options.subreddit) {
            url += subreddit;
        }
        url += '/new';
        url += options.format || '.json';
        HTTP.call('GET', url, function(error, result) {
            if (!error) {
                if (options.callback) {
                    var posts = result.data.children.map(function(rawPost) {
                        return post.data;
                    });
                    options.callbacK(posts);
                }
            } else {
                if (options.failure) {
                    options.failure(error);
                }
            }
        });
    }

    getPostsFromReddit({
        callback:function(posts) {
            postsBySubreddit['!frontpage'] = posts;
        }
    });
}