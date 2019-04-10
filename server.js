const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const logger = require("morgan");


const app = express();

// Have express use these middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));

// Serve built files
console.log(__dirname);
console.log(path.join(__dirname, 'images'));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'app/build')));



const data = require("./data.json");

const router = express.Router();

router.get("/students", (req, res) => {
    res.json(data);
});

router.get("*", (req, res) => {
    res.sendStatus(404);
});
app.use("/api", router);

app.listen(80, () => console.log("Express.js is now running on port 80"));