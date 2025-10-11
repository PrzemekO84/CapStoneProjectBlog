import express from "express";
import fs from "fs";
import { releaseDates } from "./logic/appLogic.server.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";


const port = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const postsFile = fs.readFileSync("gamesPosts.json", "utf8");
const posts = JSON.parse(postsFile, "utf8");


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, "public/styles/images"));
    },
    filename: async function(req, file, cb){
        try {
            const posts = JSON.parse(await fs.promises.readFile(postsFile, "utf8"));
            const postNumber = posts.length + 1;
            const fileExtension = path.extname(file.originalname);
            cb(null, `post${postNumber}${fileExtension}`); 
        } 
        catch (error) {
            cb(error);
        }
    }
});

const upload = multer({ storage });

app.get("/", (req, res) => {
    const gameReleaseDates = releaseDates();
    res.render("index.ejs",
        {
            posts: posts,
            releaseDates: gameReleaseDates
        }
    );
});

app.post("/writePost", upload.single("filename"), async (req, res) => {
    try {
        const body = req.body;
        console.log(body);

        const newPost = {
            id: posts.length + 1,
            type: body.postTypeDropdown,
            gameName: body.gameTitle,
            gameRelease: body.releaseDate,
            title: body.postTitle,
            image: `styles/images/${body.file.filename}`,
            description: body.description,
            rating: body.gameRating
        }

        if(body.postTypeDropdown === "Game post"){
            newPost.gameRelease = "Not applicable";
            newPost.rating = "Not applicable";
        }

        // posts.push(newPost);
        // await fs.promises.writeFile(postsFile, JSON.stringify(posts));
    } 
    catch (error) {
        console.log(error);
    }

})

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