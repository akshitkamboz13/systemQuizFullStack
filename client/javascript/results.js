    // Retrieve the stored username from localStorage
    const storedUserName = localStorage.getItem("userName");

    // Select the navbar link for Sign In
    const signInLink = document.querySelector('.navbar-link');
    
    // Update the link text based on user's login status
    if (storedUserName) {
        signInLink.textContent = storedUserName; // Display username
        signInLink.href = "#"; // Make the link inactive since the user is already signed in
    } else {
        signInLink.textContent = "Sign In"; // Display "Sign In" when not signed in
        signInLink.href = "./html/signin.html"; // Set the link to the Sign In page
    }
    
    
    
const resultsContainer = document.getElementById('results');

// Retrieve quiz data from local storage
const quizData = JSON.parse(localStorage.getItem('quizData'));

if (quizData) {
    displayResults(quizData);
} else {
    resultsContainer.innerHTML = '<p>No quiz data found.</p>';
}

function displayResults(quizData) {
    const totalQuestions = quizData.length;
    let correctAnswers = 0;

    quizData.forEach(question => {
        if (question.isCorrect) {
            correctAnswers++;
        }
    });

    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    const scoreText = `You answered ${correctAnswers} out of ${totalQuestions} questions correctly (${scorePercentage.toFixed(2)}%).`;

    resultsContainer.innerHTML = `
        <p class="result_p">${scoreText}</p>
        <button id="start-quiz-again">Start Quiz Again</button>
    `;

    const startQuizAgainButton = document.getElementById('start-quiz-again');
    startQuizAgainButton.addEventListener('click', function() {
        localStorage.removeItem('quizData');
        window.location.href = '../index.html'; // Redirect to the quiz start page
    });
}
