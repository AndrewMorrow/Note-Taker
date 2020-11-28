var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");
var { v4: uuidv4 } = require("uuid");
var PORT = process.env.PORT || 8000;
var db = require("./db/db.json");

// middleware

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// routes

// returns notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"), function (err) {
        if (err) throw err;
    });
});

// returns all the notes
app.get("/api/notes", (req, res) => {
    res.json(db);
});

// this happens when the user saves a note
app.post("/api/notes", (req, res) => {
    let id = uuidv4();
    var note = req.body;
    note.id = id;
    // console.log(note);
    db.push(note);
    fs.writeFile(
        path.join(__dirname, "/db/db.json"),
        JSON.stringify(db),
        (err) => {
            if (err) throw err;
        }
    );
    // console.log(db);
    res.json(db);
});

app.delete("/api/notes/:id", (req, res) => {
    // console.log(req.params.id);
    let delId = req.params.id;
    let filteredNotes = (array, value) => {
        return array.filter((ele) => {
            return ele.id != value;
        });
    };

    let newNotes = filteredNotes(db, delId);
    // console.log(newNotes);

    fs.writeFile(
        path.join(__dirname, "/db/db.json"),
        JSON.stringify(newNotes),
        (err) => {
            if (err) throw err;
        }
    );
    db = newNotes;
    // console.log(db);
    res.json(db);
});

// default to index.html if the route does not exist
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"), function (err) {
        if (err) throw err;
    });
});

//listener

app.listen(PORT, function () {
    console.log("app now listening on http://localhost:" + PORT);
});
