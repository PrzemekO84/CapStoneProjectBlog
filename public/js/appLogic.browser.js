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

textareaWordCounter();