import express from "express";
import session from "express-session";
import nodemailer from "nodemailer";
import fs from "fs";
import { releaseDates, savePost, validation, showAlert } from "./logic/appLogic.server.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile } from 'node:fs/promises';
import { stat } from "node:fs";

const port = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const postsFile = fs.readFileSync("gamesPosts.json", "utf8");
const posts = JSON.parse(postsFile);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "1234",
    resave: false, 
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.userID = req.session.userID;

    next();
});


function requireAuth(req, res, next){
    if(!req.session.userID){
        req.session.errorMessage = "User need to be loged in to publish a post";
        return res.redirect("/regLog/signUp");
    }

    next();
}

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

app.post("/writePost", upload.single("filename"), requireAuth, async (req, res) => {
    try {
        const userProfile = req.session.userID;
        await savePost(req.body, posts.length, req, posts, userProfile);
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

app.get("/regLog/:method", (req, res) => {
    const method = req.params.method;

    const message = req.session.message;
    const status = req.session.status;
    const errorMessage = req.session.errorMessage;

    req.session.errorMessage = null;
    req.session.message = null;
    req.session.status = null;

    res.render("regLog.ejs", {
        method: method,
        message: message,
        status: status,
        errorMessage: errorMessage
    });
})

app.post("/sign", async (req, res) => {    
    const body = req.body;
    const mode = body.mode;
    

    if(mode === "signIn"){
        const { status, message, trueUsername} = await validation(body);
        if(status === true){
            req.session.userID = trueUsername;
        }

        req.session.message = message;
        req.session.status = status; 
    }
    else{
        const { status, message } = await validation(body);
        req.session.message = message;
        req.session.status = status;
    }
    

    res.redirect(`/regLog/${body.mode}`);

});

app.get("/logOut", (req, res) =>{
    req.session.destroy(() => {
        res.redirect("/");
    });
});

app.get("/gamePosts", async (req, res) =>{

    try {
        const postsFile = await fs.promises.readFile("gamesPosts.json", "utf8");
        const posts = JSON.parse(postsFile);
        res.json(posts);
    } 
    catch (error) {
        console.log(error);
    }
})

app.get("/post/:id", async (req, res) =>{
    const postId = req.params.id;

    try {
        const postsFile = await readFile("gamesPosts.json", "utf-8");
        const posts = JSON.parse(postsFile);

        const post = posts.find(p => p.id == postId);

        if(!post){
            return res.status(404).send("Post not found");
        }

        res.render("post.ejs", {
            post: post
        });
    } 
    catch (error) {
        console.log(error);
    }
    
})

app.post("/sendEmail", async (req, res) => {

    const body = req.body;
    const email = body.email;
    const message = body.message;
    const name = body.name;

    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter using the test account
    const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const info = await transporter.sendMail({
        from: `'"${name}" ${email}'`,
        to: "testEmail@example.com",
        subject: "Test Email",
        text: `${message}`,
        html: "<p>This is a <b>test email</b> sent via Ethereal!</p>",
    });

    console.log("Message sent: %s", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("Preview URL: %s", previewUrl);

    res.redirect("/contact");
})

app.listen(port, () =>{
    console.log("Server running on port " + port);
});

//dodac logowanie rejestracja // done
//dodac search // done
//dodac contact
//dodac email send