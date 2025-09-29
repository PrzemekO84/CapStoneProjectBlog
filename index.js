import express from "express";
import fs from "fs";
import { releaseDates } from "./logic/appLogic.js";

const port = 3000;
const app = express();


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const posts = JSON.parse(fs.readFileSync("gamesPosts.json", "utf8"));

app.get("/", (req, res) => {
    const gameReleaseDates = releaseDates();
    res.render("index.ejs",
        {
            posts: posts,
            releaseDates: gameReleaseDates
        }
    );
    console.log("XDDD");
    console.log(gameReleaseDates);
});

app.get("/about", (req, res) => {
    res.render("about.ejs",
        {

        }
    );
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs",
        {

        }
    );
});


app.listen(port, () =>{
    console.log("Server running on port " + port);
});