
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

document.addEventListener("DOMContentLoaded", () => {
    if(window.toastData){
        showToast(window.toastData.message, window.toastData.type);
    }
})

function getPostId(){

    const postTile = document.querySelectorAll(".post");

    postTile.forEach(post => {
        post.addEventListener("click", async () =>{
            const postId = post.dataset.id;
            console.log(postId);

            try {
                const response = await fetch("/post", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ postId: postId })
                });

                const data = await response.json();
                console.log(data);
            }
            catch (error) {
                console.log(error);
            }
        }); 
    });  
}

function test(){

    
}

getPostId();
test();
textareaWordCounter();
showReviewPost();