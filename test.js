/**
 * Created by AdityaShibrady on 11/3/15.
 */
//Callback functions
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
var success = function (data) {
    console.log('Data [%s]', data);
};

var Twitter = require('twitter-node-client').Twitter;

//Get this data from your twitter apps dashboard
var config = {
    "consumerKey": "pUhmj3kdqxjAen82RD5BX9kHE",
    "consumerSecret": "2QxB7RiNdJhXu4mvBXdLqotjgesbcpMJW52KwUsw9kqhIhjo0z",
    "accessToken": "105777356-cj3a7NY9BL4UGDpWz2ONvaL7f7IXUXMpG7qKTgm6",
    "accessTokenSecret": "KwckLghzxKLd4NqzHcOTocU0gaqm7P5B2eyWCgW3NrZk5"
}

var twitter = new Twitter(config);

//Example calls

twitter.getUserTimeline({ screen_name: 'aditya_shibrady', count: '10'}, error, success);