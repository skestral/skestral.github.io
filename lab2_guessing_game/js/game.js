//Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

//Global variables
let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;

initializeGame();

function initializeGame() {
   randomNumber = Math.floor(Math.random() * 99) + 1;
   console.log("Random number:" + randomNumber);
   attempts = 0;

   //hiding the Reset button
   document.querySelector("#resetBtn").style.display = "none";

   //showing the Guess button
   document.querySelector("#guessBtn").style.display = "inline";
   //Enable the guess button in case it was disabled
   document.querySelector("#guessBtn").disabled = false;

   let playerGuess = document.querySelector("#playerGuess"); 
   playerGuess.disabled = false;
   playerGuess.focus(); //adding focus to textbox
   playerGuess.value = "";  //clearing the textbox

   let feedback = document.querySelector("#feedback");
   feedback.textContent = "Enter a number between 1 and 99 to start.";  //clearing the feedback
   feedback.style.color = "black";

   //clearing previous guesses
   document.querySelector("#guesses").textContent = "";
}

function checkGuess(){
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);
    
    // Check for error: Number entered higher than 99 or lower than 1
    if (guess > 99) {
        feedback.textContent = "Error: You entered a number higher than 99!";
        feedback.style.color = "red";
        return;
    }
    if (guess < 1 || guess === "") {   
        feedback.textContent = "Error: Enter a valid number between 1 and 99";
        feedback.style.color = "red";
        return;
    }   

    attempts++;  
    console.log("Attempts:" + attempts);
    
    if (guess == randomNumber) {
        // Congratulatory message when guessing the number within 7 attempts
        feedback.textContent = "Congratulations! You guessed it! You Won in " + attempts + " attempt(s)!";
        feedback.style.color = "darkgreen";
        document.querySelector("#guesses").textContent += guess + " ";
        wins++;
        document.querySelector("#winsCount").textContent = wins;
        gameOver();
    } else { 
        document.querySelector("#guesses").textContent += guess + " ";
        if (attempts == 7) {
            // Display a "You Lost" message in red AND the random number
            feedback.textContent = "You Lost! The random number was " + randomNumber;
            feedback.style.color = "red"; 
            losses++;
            document.querySelector("#lossesCount").textContent = losses;
            gameOver();
        } else if ( guess > randomNumber) {
            // High message
            feedback.textContent = "Your guess was too high!";
            feedback.style.color = "orange";   
        } else {
            // Low message
            feedback.textContent = "Your guess was too low!";
            feedback.style.color = "orange";   
        }
    }
    
    // Clear input field after guess
    document.querySelector("#playerGuess").value = "";
    document.querySelector("#playerGuess").focus();
}

function gameOver(){
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    
    // Hide or disable the "Guess" button and display a "Reset" button
    guessBtn.style.display = "none"; 
    guessBtn.disabled = true; 
    document.querySelector("#playerGuess").disabled = true;
    
    resetBtn.style.display = "inline"; //displays Reset button
}
