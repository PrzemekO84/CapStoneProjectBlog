import { readFile, writeFile } from 'node:fs/promises';
import bcrypt from "bcrypt";
import { stat } from 'node:fs';

export function releaseDates(){

    const currentYear = new Date().getFullYear();
    let startDate = 1958;

    const yearList = [];

    for (let i = startDate; i <= currentYear; i++) {
        yearList.push(startDate);
        startDate++;
    };

    return yearList;
};

export async function savePost(body, postNumber, req, posts){

    const randomViewCounter = Math.floor(Math.random() * 100) + 1;

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentDay = date.getDate();
    const currentMonth = date.getMonth() + 1;
    let currentHour = date.getHours();
    let currentMinutes = date.getMinutes();
    let currentSeconds = date.getSeconds();

    currentHour = String(currentHour).padStart(2, "0");
    currentMinutes = String(currentMinutes).padStart(2, "0");
    currentSeconds = String(currentSeconds).padStart(2, "0");

    const currentDate = `Date: ${currentYear}/${currentMonth}/${currentDay}: ${currentHour}:${currentMinutes}:${currentSeconds}`

    const newPost = {
        id: postNumber + 1,
        type: body.postTypeDropdown,
        gameName: body.gameTitle,
        gameRelease: body.releaseDate,
        title: body.postTitle,
        image: "styles\\images\\" + `${req.file.filename}`,
        description: body.description,
        rating: body.gameRating,
        postDate: currentDate,
        viewCounter: randomViewCounter
    }

    if (body.postTypeDropdown === "Game post") {
        newPost.gameRelease = "Not applicable";
        newPost.rating = "Not applicable";
    }

    posts.push(newPost);
    const jsonPosts = JSON.stringify(posts);
    await writeFile("gamesPosts.json", jsonPosts);
}

export async function validation(credentials){

    const mode = credentials.mode;
    let result;

    if(mode === "signIn"){
        result = await verifyCredentials(credentials);
        console.log(result);
    }
    else{
        result = await registerValidation(credentials);
        if(!result.isCorrect){
            console.log(result.message);
        }
        else{
            result = await hashPassword(credentials);
            console.log(result);
        }
        
    }  

}

async function registerValidation(credentials){

    let message = ""
    let isCorrect = false;

    const username = credentials.username;
    const gmail = credentials.gmail;
    const password = credentials.password
    const confirmedPassword = credentials.confirmedPassword;

    console.log(credentials);

    const users = await readFileFun("users.json");
    const userExist = users.find(u => u.username === username || u.gmail === gmail);

    if(userExist){
        message = "User already exists please log in or use diffrent credentials";
        return { isCorrect, message };
    }
    else if (!gmail.includes("@")) {
        message = "Incorrect email adress."
        return { isCorrect, message };
    }
    else if (password !== confirmedPassword) {
        message = "Passwords do not match."
        return { isCorrect, message };
    }

    isCorrect = true;
    message = "Successfully registered."
    return { isCorrect, message }

}

async function hashPassword(credentials){
    try {
            const username = credentials.username;
            const gmail = credentials.gmail;
            const password = credentials.password;

            const usersFile = await readFile("users.json", "utf-8");
            const users = JSON.parse(usersFile);

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = {
                username: username,
                gmail: gmail,
                password: hashedPassword
            }

            users.push(newUser);

            await writeFile("users.json", JSON.stringify(users));

            return "Password saved"

        } 
        catch (error) {
            return error + " Password not saved."
        }
};

async function verifyCredentials(credentials){

    const username = credentials.usernameGmail;
    const gmail = credentials.usernameGmail;
    const password = credentials.password;
    let savedPassword;
    let resultMesseage;
    let status = false;

    const users = await readFileFun("users.json");

    users.forEach(user => {
        if(user.username === username || user.gmail === gmail){
            savedPassword = user.password;
        }
    });

    if(!savedPassword){
        resultMesseage = "Incorrect credentials, user does not exists";
        return {status, resultMesseage};
    }

    const passwordMatch = await bcrypt.compare(password, savedPassword);

    //TU JEST COS NIE TAK :D
    if(passwordMatch){
        resultMesseage = "Succesfully Loged in";
        status = true;
        return {status, resultMesseage};
        
    }
    else{
        return resultMesseage = "Incorrect credentials";
        return {status, resultMesseage};
    }

    // const user = users.find(
    //     u => u.username === username || u.gmail === gmail
    // );

}

async function readFileFun(file){
    const fileToRead = await readFile(file, "utf-8")
    return JSON.parse(fileToRead);
}

async function writeFileFun(file, content){
    await writeFile(file, JSON.stringify(content));
}




