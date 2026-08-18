import express from "express";
import mysql from "mysql2";
import session from "express-session";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Panorama",
});

const app = express();

app.use(session({
  secret: "importantsecret",
  resave: true,
  saveUninitialized: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../front"), { index: false }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../front/login.html"));
});

app.post("/auth", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        connection.query(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password], function (error, results, fields) {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect("/home");
                } else {
                    res.send("Incorrect Username and/or Password!");
                }
                res.end();
            }
        );
    } else { res.send("Please enter Username and Password!"); res.end(); }
});

app.get("/home", function (req, res) {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.send('Please login to view this page!');
    } 
    res.end();
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});