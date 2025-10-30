import express from "express";
import session from "express-session";
import fs from "fs";
import { releaseDates } from "./logic/appLogic.server.js";
import { savePost } from "./logic/appLogic.server.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile } from 'node:fs/promises';



const port = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const postsFile = fs.readFileSync("gamesPosts.json", "utf8");
const posts = JSON.parse(postsFile, "utf8");


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "1234",
    resave: false, 
    saveUninitialized: true
}));

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, "public/styles/images"));
    },
    filename: async function(req, file, cb){
        try {
            const postNumber = posts.length + 1;
            const fileExtension = path.extname(file.originalname);
            cb(null, `post${postNumber}${fileExtension}`); 
        } 
        catch (error) {
            console.log(error);
            cb(error);
        }
    }
});

const upload = multer({ storage });

app.get("/", (req, res) => {
    const gameReleaseDates = releaseDates();
    const toast = req.session.toast;
    req.session.toast = null;
    res.render("index.ejs",
        {
            posts: posts,
            releaseDates: gameReleaseDates,
            toast: toast
        }
    );
});

app.post("/writePost", upload.single("filename"), async (req, res) => {
    try {
        await savePost(req.body, posts.length, req, posts);
        req.session.toast = {message: "Post created succesfully", type: "success"};
    }
    catch (error) {
        console.log(error);
        req.session.toast = {message: "Could not create the post: " + error, type: "error"};
    }
    res.redirect("/");
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