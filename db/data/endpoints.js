module.exports = {
    "GET /api": {
      "description": "serves up a json representation of all the available endpoints of the api"
    },
    "GET /api/categories": {
      "description": "serves an array of all categories",
      "queries": [],
      "exampleResponse": {
        "categories": [
          {
            "description": "Players attempt to uncover each other's hidden role",
            "slug": "Social deduction"
          }
        ]
      }
    },
    "GET /api/reviews": {
      "description": "serves an array of all reviews",
      "queries": ["category", "sort_by", "order"],
      "exampleResponse": {
        "reviews": [
          {
            "title": "One Night Ultimate Werewolf",
            "designer": "Akihisa Okui",
            "owner": "happyamy2016",
            "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            "category": "hidden-roles",
            "created_at": 1610964101251,
            "votes": 5
          }
        ]
      }
    },
    "GET /api/reviews/:review_id": {
      "description": "serves an object of the review with the given id",
      "queries": [],
      "exampleResponse": {
        "review": {
          "review_id": 1,
          "title": "Culture a Love of Agriculture With Agricola",
          "review_body": "You could sum up Agricola with the simple phrase 'Farmyeard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
          "designer": "Uwe Rosenberg",
          "review_img_url": "https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          "votes": 1,
          "category": "strategy",
          "owner": "tickle122",
          "created_at": "2021-01-18 10:00:20.514",
          "comment_count": 3
        }
      }
    },
    "PATCH /api/reviews/:review_id": {
      "description": "updates the votes on the given review by the number provided (+ive or -ive) and responds with the updated object",
      "queries": [],
      "exampleBody": { "inc_votes": 3 },
      "exampleResponse": {
        "review": {
          "review_id": 1,
          "title": "Culture a Love of Agriculture With Agricola",
          "review_body": "You could sum up Agricola with the simple phrase 'Farmyeard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
          "designer": "Uwe Rosenberg",
          "review_img_url": "https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          "votes": 1,
          "category": "strategy",
          "owner": "tickle122",
          "created_at": "2021-01-18 10:00:20.514",
          "comment_count": 6
        }
      }
    },
    "GET /api/reviews/:review_id/comments": {
      "description": "returns an array of all of the comments left on the given review",
      "queries": [],
      "exampleResponse": {
        "comments": [
          {
            "comment_id": 10,
            "votes": 9,
            "created_at": "2021-03-27 14:15:31.11",
            "author": "grumpy19",
            "body": "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim.",
            "review_id": 2
          },
          {
            "comment_id": 1,
            "votes": 16,
            "created_at": "2017-11-22 12:36:03.389",
            "author": "happyamy2016",
            "body": "I loved this game too!",
            "review_id": 2
          },
          {
            "comment_id": 4,
            "votes": 16,
            "created_at": "2017-11-22 12:36:03.389",
            "author": "tickle122",
            "body": "EPIC board game!",
            "review_id": 2
          }
        ]
      }
    },
    "POST /api/reviews/:review_id/comments": {
      "description": "creates a new comment on the given review, if it exists",
      "queries": [],
      "exampleBody": { "username": "mallionaire", "body": "This is a comment" },
      "exampleResponse": {
        "review": {
          "comment_id": 7,
          "body": "This is a comment",
          "review_id": 1,
          "author": "mallionaire",
          "votes": 0,
          "created_at": "2022-11-16T09:53:27.278Z"
        }
      }
    },
    "GET /api/users": {
      "description": "returns an array of all users",
      "queries": [],
      "exampleResponse": {
        "users": [
          {
            "username": "mallionaire",
            "name": "haz",
            "avatar_url": "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          },
          {
            "username": "philippaclaire9",
            "name": "philippa",
            "avatar_url": "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
          },
          {
            "username": "bainesface",
            "name": "sarah",
            "avatar_url": "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
          },
          {
            "username": "dav3rid",
            "name": "dave",
            "avatar_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
          }
        ]
      }
    },
    "DELETE /api/comments/:comment_id": {
      "description": "removes the comment with the given id",
      "queries": [],
      "exampleResponse": {}
    }
  }