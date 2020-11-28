var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");
var { v4: uuidv4 } = require("uuid");
var PORT = process.env.PORT || 3010;
var db = require("./db/db.json");

// middleware

app.use(express.json());
// serves the public folder initially
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes

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
    // generates a unique id with the uuid package
    let id = uuidv4();
    var note = req.body;
    // adds a unique id to the note
    note.id = id;
    // pushes the note to the db.json variable
    db.push(note);
    // writes the variable to the db.json file
    fs.writeFile(
        path.join(__dirname, "/db/db.json"),
        JSON.stringify(db),
        (err) => {
            if (err) throw err;
        }
    );
    // sends back the db.json file
    res.json(db);
});

app.delete("/api/notes/:id", (req, res) => {
    let delId = req.params.id;
    // filters the array and returns all objects without a matching delId
    let filteredNotes = (array, value) => {
        return array.filter((ele) => {
            return ele.id != value;
        });
    };

    let newNotes = filteredNotes(db, delId);

    // rewrites to the db.json after filtering
    fs.writeFile(
        path.join(__dirname, "/db/db.json"),
        JSON.stringify(newNotes),
        (err) => {
            if (err) throw err;
        }
    );

    db = newNotes;
    // sends back the db.json file
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
