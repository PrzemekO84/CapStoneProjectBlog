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

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentDay = date.getDate();
    const currentMonth = date.getMonth() + 1;
    const currentHour = date.getHours();
    const currentMinutes = date.getMinutes();
    const currentSeconds = date.getSeconds();



    const currentDate = `Date: ${currentYear}/${currentMonth}/${currentDay}: ${currentHour}`


    const newPost = {
        id: postNumber + 1,
        type: body.postTypeDropdown,
        gameName: body.gameTitle,
        gameRelease: body.releaseDate,
        title: body.postTitle,
        image: `styles/images/${req.file.filename}`,
        description: body.description,
        rating: body.gameRating,
        postDate: currentDate
    }

    if (body.postTypeDropdown === "Game post") {
        newPost.gameRelease = "Not applicable";
        newPost.rating = "Not applicable";
    }

    posts.push(newPost);
    const jsonPosts = JSON.stringify(posts);
    await writeFile("gamesPosts.json", jsonPosts);
}



