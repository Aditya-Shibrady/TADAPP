

module.exports = function(app){

    app.get("/", function(req, res){
        console.log("Loading root");
        res.render("index.html");
    });

    app.get("/home", function(req, res){
        console.log("Loading home");
        res.render("home.html");
    });

    app.get("/search", function(req, res){
        console.log("Loading search");
        res.render("search.html");
    });

    app.get("/dest", function(req, res){
        console.log("Loading dest");
        res.render("Destination.html");
    });
    app.get("/stats", function(req, res){
        console.log("Loading stats");
        res.render("stats.html");
    });

};