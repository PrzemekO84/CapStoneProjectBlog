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
    const sortedPosts = [];
    const postsLength = posts.length;
    const tempPosts = [...posts];

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
            console.log(sortedPosts);
            break;
        case "Least popular":
            //sort method
            const leastPopularPosts = tempPosts.sort((a, b) => a.viewCounter - b.viewCounter);
            console.log(leastPopularPosts);
            break;
        case "Game reviews":
            tempPosts.forEach(post => {
                if(post.type === "Game review"){
                    sortedPosts.push(post);
                }
            });
            console.log(sortedPosts);
            break;
        case "Game posts":
            tempPosts.forEach(post => {
                if(post.type === "Game post"){
                    sortedPosts.push(post);
                }
            });
            console.log(sortedPosts);
            break;
        case "Newest":
            // Insertion sort
            for (let i = 1; i < tempPosts.length; i++) {
                let currentPost = tempPosts[i];
                let j = i - 1;
                while(j >= 0 && tempPosts[j].id > currentPost.id){
                    tempPosts[j + 1] = tempPosts[j];
                    j--
                }
                tempPosts[j + 1] = currentPost;
            }
            console.log(tempPosts);
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
            console.log(tempPosts);
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

async function test(){
    const testArraty = [5, 4, 1, 2, 1];

    for (let i = 1; i < testArraty.length; i++) {
        let current = testArraty[i];
        let j = i - 1;
        while (j >= 0 && testArraty[j] > current) {
            testArraty[j + 1] = testArraty[j];
            j--;
        }
        testArraty[j + 1] = current;
        console.log(testArraty);
    }
    console.log(testArraty);
}

test();
showSortByWindow();
textareaWordCounter();
showReviewPost();

