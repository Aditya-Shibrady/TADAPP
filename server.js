var http = require('http'),
    express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./collectionDriver').CollectionDriver;

var app = express();
app.set('port', process.env.PORT || 3001);
app.set('views', [__dirname, __dirname + '/views']);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
//app.use(express.bodyParser()); // <-- add
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/static", express.static(__dirname + '/public'));
app.use("/lib", express.static(__dirname + '/lib'));
app.use("/app", express.static(__dirname + '/app'));

require("./router.js")(app);

var mongoHost = 'localHost'; //A
var mongoPort = 27017;
var collectionDriver;

var mongoClient = new MongoClient(new Server(mongoHost, mongoPort)); //B
mongoClient.open(function(err, mongoClient) { //C
    if (!mongoClient) {
        console.error("Error! Exiting... Must start MongoDB first");
        process.exit(1); //D
    }
    var db = mongoClient.db("MyDatabase");  //E
    collectionDriver = new CollectionDriver(db); //F
});

app.get('/:collection', function(req, res) { //A
    var params = req.params; //B
    collectionDriver.findAll(req.params.collection, function(error, objs) { //C
        if (error) { res.send(400, error); } //D
        else {
            console.log(objs);
            res.send(objs);
            //if (req.accepts('html')) { //E
            //    res.render('data',{objects: objs, collection: req.params.collection}); //F
            //} else {
            //    res.set('Content-Type','application/json'); //G
            //    res.send(200, objs); //H
            //}
        }
    });
});

app.get('/:collection/:entity', function(req, res) { //I
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
        collectionDriver.get(collection, entity, function(error, objs) { //J
            if (error) { res.send(400, error); }
            else { res.send(200, objs); } //K
        });
    } else {
        res.send(400, {error: 'bad url', url: req.url});
    }
});

app.post('/:collection', function(req, res) { //A
    var object = req.body;
    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(err,docs) {
        if (err) { res.send(400, err); }
        else { res.send(201, docs); } //B
    });
});

//Callback functions
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
var success = function (data) {
    console.log('Data [%s]', data);
};
//
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

twitter.getUserTimeline({ screen_name: 'aditya_shibrady', count: '2'}, error, success);
console.log("\n");
console.log(".......................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................");
//twitter.getUserTimeline({ screen_name: 'davemo2012', count: '1'}, error, success);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
}).listen(3001, '0.0.0.0');
