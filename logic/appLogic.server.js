import { readFile, writeFile } from 'node:fs/promises';

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

export async function validateCredentials(credentials){

    const mode = credentials.mode;
    let message = ""
    let isCorrect = false;

    if(mode === "signIn"){
        const username = credentials.usernameGmail;
        const password = credentials.password;

        console.log(username);
        console.log(password);

        isCorrect = true;
        message = "Successfully loged in."
        return {isCorrect, message}
    }
    else{

        const username = credentials.username;
        const gmail = credentials.gmail;
        const password = credentials.password
        const confirmedPassword = credentials.confirmedPassword;

        if(!gmail.includes("@")){
            errorMessage = "Incorrect email adress."
            return { isCorrect, message };
        }
        else if(password !== confirmedPassword){
            errorMessage = "Passwords do not match."
            return { isCorrect, message };
        }

        try {
            const usersFile = await readFile("users.json", "utf-8");
            const users = JSON.parse(usersFile);

            const newUser = {
                username: username,
                gmail: gmail,
                password: password,
            }

            users.push(newUser);

            await writeFile("users.json", JSON.stringify(users));
            isCorrect = true;
            message = "Successfully registered."
            return {isCorrect, message}
        } 
        catch (error) {
            console.log(error);
        }
    
    }
 
}




