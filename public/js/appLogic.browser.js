// Variables
const sortingWindow = document.querySelector(".sort-dropdown-container");


function textareaWordCounter(){

    const textarea = document.getElementById("description");
    const wordIndicator = document.getElementById("wordIndicator");

    const maxWordCount = 1500;

    textarea.addEventListener("input", () => {
        const currentWordCount = textarea.value.length;
        if(currentWordCount >= 750 && currentWordCount < 1499){
            wordIndicator.style.color = "#9c6905";
        }
        else if(currentWordCount == 1500){
            wordIndicator.style.color = "#ec0018ff";
        }
        wordIndicator.textContent = `${currentWordCount} / ${maxWordCount}`;
    });

};

function showReviewPost(){

    const postType = document.getElementById("postType-dropdown");
    const postTitile = document.getElementById("postTitile");
    const releaseDateContainer = document.getElementById("releaseDate-container");
    const ratingContainer = document.getElementById("rating-container");
    const gameRating = document.getElementById("gameRating");
    const releaseDate = document.getElementById("releaseDate");


    postType.addEventListener("change", () =>{
        const postTypeValue = postType.value;

        console.log(postTypeValue);

        if(postTypeValue === "Game review"){
            postTitile.placeholder = "Ex. The Witcher 3 Review";
            releaseDateContainer.style.display = "block";
            ratingContainer.style.display = "block";
            gameRating.setAttribute("required", "");
            releaseDate.setAttribute("required", "")
        }
        else{
            postTitile.placeholder = "Ex. Top 10 secret locations in Witcher 3";
            releaseDateContainer.style.display = "none";
            ratingContainer.style.display = "none";
            gameRating.removeAttribute("required", "");
            releaseDate.removeAttribute("required", "");
        }
    });
};

async function showToast(message, type){

    const main = document.getElementsByTagName("main")[0];
    const toastDiv = document.createElement("div");
    const toastMessage = document.createElement("p");
    toastMessage.textContent = message;
    toastDiv.classList.add("toast-notif");
    toastDiv.append(toastMessage);
    main.appendChild(toastDiv);


    if(type === "error"){
        toastMessage.style.color = "red";
    }
    else{
        toastMessage.style.color = "white";
    }

    await new Promise(resolve => {
        setTimeout(() =>{
            toastDiv.style.display = "none";
            resolve();
        }, 10000)
    });
}

function showSortByWindow(){
    const sortByContainer = document.getElementById("sortBy");
    const dropdownMenu = document.querySelector(".sort-dropdown-container");

    document.addEventListener("click", (event) => {
        const currentTarget = event.target.getAttribute("id");
        if(currentTarget === "sortButton"){
            dropdownMenu.classList.toggle("show");
        } 
        else if(dropdownMenu.classList.contains("show")){
            dropdownMenu.classList.toggle("show");
        }  
    })
}

async function sortingPosts(sortType){

    const posts = await getPosts();
    const sortedPost = [];

    // element => push to the array
    // nastepnie porwnaj nastepny z poprzednim
    // jesli jest wiecej to musi porownas ze wszystkimi elementami
    

    switch(sortType){
        // trzeba to cale poprawic xd
        case "Most popular":
            for(let i = 0; i < posts.length; i++){
                sortedPost.push(posts[i]);
                if(sortedPost.length === 1){
                        console.log(sortedPost.length);
                }
                else{
                    for (let j = 0; j < sortedPost.length; j++) {
                        console.log("?");
                        if(sortedPost[i].viewCounter > sortedPost[j].viewCounter){
                            sortedPost.unshift(sortedPost[i]);
                        }
                    }
                }
            }
            console.log(sortedPost);
            break;
        case "Game reviews":
            console.log("Game reviews");
            break;
        case "Game posts":
            console.log("Game posts");
            break;
        case "Newest":
            console.log("Newest");
            break;
        case "Oldest":
            console.log("Oldest");
            break;
        default:
            console.log("No sorting");
    }

}

async function getPosts(){

    try {
        const response = await fetch("/gamePosts", {
            method: "GET"
        });
        if(!response.ok){
            throw new Error("Response status" + response.status);
        }    

        const result = await response.json();
        return result;
    }
     catch (error) {
        console.log(error);
    }
}



document.addEventListener("DOMContentLoaded", () => {
    if(window.toastData){
        showToast(window.toastData.message, window.toastData.type);
    }
})



sortingWindow.addEventListener("click", (event) => {
    sortType = event.target.innerHTML
    sortingPosts(sortType);
});

function test(){
}


showSortByWindow();
test();
textareaWordCounter();
showReviewPost();