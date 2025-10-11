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

textareaWordCounter();
showReviewPost();