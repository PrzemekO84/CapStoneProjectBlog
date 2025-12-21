

// Variables
const sortingWindow = document.querySelector(".sort-dropdown-container");


function textareaWordCounter(){

    const textarea = document.getElementById("description");
    const wordIndicator = document.getElementById("wordIndicator");

    const maxWordCount = 5000;

    textarea.addEventListener("input", () => {
        const currentWordCount = textarea.value.length;
        if(currentWordCount < 2000){
            wordIndicator.style.color = "black";
        }
        else if(currentWordCount >= 2000 && currentWordCount < 3000){
            wordIndicator.style.color = "#9c6905";
        }
        else if(currentWordCount >= 3000 && currentWordCount <= 4999){
            wordIndicator.style.color = "#ffaa00ff";
        }
        else if(currentWordCount == 5000){
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
    const gameTitle = document.getElementById("gameTitle");
    const gameNameAsterisk = document.getElementById("gameNameAsterisk");


    postType.addEventListener("change", () =>{
        const postTypeValue = postType.value;

        console.log(postTypeValue);

        if(postTypeValue === "Game review"){
            postTitile.placeholder = "Ex. The Witcher 3 Review";
            releaseDateContainer.style.display = "block";
            ratingContainer.style.display = "block";
            gameRating.setAttribute("required", "");
            releaseDate.setAttribute("required", "");
            gameTitle.textContent = "Game name"
            gameNameAsterisk.textContent = "This field is required."
        }
        else{
            postTitile.placeholder = "Ex. Top 10 secret locations in Witcher 3";
            releaseDateContainer.style.display = "none";
            ratingContainer.style.display = "none";
            gameRating.removeAttribute("required", "");
            releaseDate.removeAttribute("required", "");
            gameTitle.textContent = "Game name/s"
            gameNameAsterisk.textContent = "This field is required. Can be more than one."
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
    let sortedPosts = [];
    const postsLength = posts.length;
    const tempPosts = [...posts];
    console.log(typeof posts);
    const sortButton = document.getElementById("sortButton");
    sortButton.textContent = sortType + "▼";

    switch(sortType){
        case "Most popular":
            //my way to sort
            for(let i = 0; i < postsLength; i++){
                let currentPost = tempPosts[0];
                for(let j = 0; j < tempPosts.length; j++){
                    if(currentPost.viewCounter < tempPosts[j].viewCounter){
                        currentPost = tempPosts[j]
                    }
                }
                sortedPosts.push(currentPost);
                const removeIndex = tempPosts.indexOf(currentPost); 
                tempPosts.splice(removeIndex, 1);
            }
            break;
        case "Least popular":
            //sort method
            sortedPosts = tempPosts.sort((a, b) => a.viewCounter - b.viewCounter);
            break;
        case "Game reviews":
            tempPosts.forEach(post => {
                if(post.type === "Game review"){
                    sortedPosts.push(post);
                }
            });
            break;
        case "Game posts":
            tempPosts.forEach(post => {
                if(post.type === "Game post"){
                    sortedPosts.push(post);
                }
            });
            break;
        case "Newest":
            // Insertion sort
            for (let i = 1; i < tempPosts.length; i++) {
                let currentPost = tempPosts[i];
                let j = i - 1;
                while(j >= 0 && tempPosts[j].id < currentPost.id){
                    tempPosts[j + 1] = tempPosts[j];
                    j--
                }
                tempPosts[j + 1] = currentPost;
            }
            sortedPosts = tempPosts;
            break;
        case "Oldest":
            //bubble sorting
            for (let i = 0; i < tempPosts.length - 1; i++) {
                for (let j = 0; j < tempPosts.length - 1 - i; j++) {
                    let temp = tempPosts[j + 1];
                    if(tempPosts[j].id > tempPosts[j + 1].id){
                        tempPosts[j] = tempPosts[j]
                        tempPosts[j] = temp;
                    }
                }
            }
            sortedPosts = tempPosts;
            break;
        default:
            console.log("No sorting");
    }

    
    return sortedPosts;
}

async function renderPosts(sortedPosts) {

    //!!!!!!!!!!!!!!!!!!
    //Bedzie trzeba tu dodac jeszcze src do atag
    //!!!!!!!!!!!!!!!!!!
    
    const showPostContainer = document.querySelector(".showPost-container");
    showPostContainer.innerHTML = "";

    sortedPosts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        for (let i = 0; i < 3; i++) {
            const a = document.createElement("a");
            if(i === 0){
                const img = document.createElement("img");
                img.setAttribute("src", post.image);
                a.appendChild(img);
            }
            else if(i === 1){
                const h2 = document.createElement("h2");
                const span = document.createElement("span");
                h2.textContent = post.title;
                h2.appendChild(span);
                a.appendChild(h2);
            }
            else{
                const button = document.createElement("button");
                button.textContent = "Show post";
                a.appendChild(button);
            }
            postDiv.appendChild(a);
        }
        showPostContainer.appendChild(postDiv);
    });
}

function searchBar(){

    const searchBar = document.querySelector(".searchBar");
    let postNames = [];
    const posts = document.querySelectorAll(".post");


    //lista postow
    // z kazdego posta zgarnij imie
    // jesli imie sie zgadza wyswielt
    // jesli nie dodaj klase

    searchBar.addEventListener("input", (event) => {

        const input = event.target.value.toLowerCase();
        console.log(input);

        posts.forEach(post => {
            console.log(post);
            const postName = post.querySelector("h2").textContent.toLowerCase();
            if(!postName.includes(input)){
                console.log(postName);
                post.classList.add("hidePost");
            }
            else{
                post.classList.remove("hidePost");
            }
        })

        
    })
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
        renderPosts(sortedPosts);
    }
})


sortingWindow.addEventListener("click", async (event) => {
    if(event.target.classList.contains("sort-element")){
        sortType = event.target.innerHTML
        const sortedPosts = await sortingPosts(sortType);
        renderPosts(sortedPosts);
    }
});

async function test(){
}

test();
showSortByWindow();
textareaWordCounter();
showReviewPost();
searchBar();

