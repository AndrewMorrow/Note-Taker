var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");
var PORT = process.env.PORT || 8000;
var db = require("./db/db.json");

// middleware

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// routes

// read all notes here
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"), function (err) {
        if (err) throw err;
    });
});

app.post("/api/notes", (req, res) => {
    var note = req.body;
    // console.log({ note });
    db.push(note);
    console.log({ db });
    fs.writeFileSync("./db/db.json", JSON.stringify(db));
});

// app.delete("/api/notes/:id", (req, res) => {
// req.params.id
// }

//listener

app.listen(PORT, function () {
    console.log("app now listening on localhost: " + PORT);
});
