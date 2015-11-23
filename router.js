

module.exports = function(app){

    app.get("/", function(req, res){
        console.log("Loading root");
        res.render("index.html");
    });
    app.get("/search", function(req, res){
        console.log("Loading search");
        res.render("search.html");
    });

    app.get("/dest", function(req, res){
        console.log("Loading dest");
        res.render("Destination.html");
    });
    app.get("/stream", function(req, res){
        console.log("Loading stream");
        res.render("stream.html");
    });
    app.get("/customers", function(req, res){
        console.log("Loading Customers");
        res.render("customers.html");
    });

};