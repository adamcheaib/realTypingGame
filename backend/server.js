const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
    const {name, school, score} = req.body;

    const db = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json"), "utf-8"));
    console.log(name, school, score);
    db.push({
        name: name,
        school: school,
        score: score,
    });

    fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(db, null, 2));
    return res.status(200).json({
        message: "User added!"
    });
})

app.get("/leaderboard", (req, res) => {
    const db = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json"), "utf-8"));
    return res.status(200).json({db: db})
})

app.listen(1234, (req, res) => {
    console.log("Listening on port 1234");
})