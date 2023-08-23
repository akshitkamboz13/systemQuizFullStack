// Retrieve the stored username from localStorage
let storedUserName = localStorage.getItem('userName');

// Select the navbar link for Sign In
const signInLink = document.querySelector('.navbar-link');

// Update the link text based on user's login status
if (storedUserName) {
  signInLink.textContent = storedUserName; // Display username
  signInLink.removeAttribute('href'); // Remove the link since the user is already signed in
} else {
  signInLink.textContent = 'Sign In'; // Display "Sign In" when not signed in
  signInLink.href = './html/signin.html'; // Set the link to the Sign In page
}

const quizContainer = document.querySelector('.quiz-container');
const startButton = document.getElementById('start-quiz');
const quizForm = document.getElementById('quiz-form');
const questionsContainer = document.getElementById('questions');
const amountInput = document.getElementById('amount');
const difficultyInput = document.getElementById('difficulty');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');

let quizData = [];
let timerInterval;
let currentQuestionIndex = 0;

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchQuizData(amount, difficulty, category, type) {
  try {
    const validatedAmount = Math.min(amount, 50); // Ensure amount is less than or equal to 50
    const response = await fetch(`https://opentdb.com/api.php?amount=${validatedAmount}&category=${category}&difficulty=${difficulty}&type=${type}`);
    const data = await response.json();
    quizData = data.results.map(question => ({
      ...question,
      answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
    }));

    currentQuestionIndex = 0;
    clearInterval(timerInterval);
    const timeLimit = validatedAmount * 15 * 1000;

    // Start the timer
    startTimer(timeLimit);

    displayQuestions(quizData);
  } catch (error) {
    console.error('Error fetching quiz data:', error);
  }
}

function startTimer(timeLimit) {
  let timeRemaining = timeLimit;

  timerInterval = setInterval(() => {
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
    }

    document.getElementById('timer-display').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    timeRemaining -= 1000;
  }, 1000);
}

function displayQuestions(quizData) {
  quizForm.style.display = 'block';
  startButton.style.display = 'none';

  quizData.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = `
      <p>${index + 1}. ${question.question}</p>
      <ul>
        ${question.answers.map(answer => `
          <li>
            <label>
              <input type="radio" name="question-${index}" value="${answer}">
              ${answer}
            </label>
          </li>
        `).join('')}
      </ul>
    `;
    questionsContainer.appendChild(questionElement);
  });
}

startButton.addEventListener('click', function () {
  const amount = amountInput.value;
  const difficulty = difficultyInput.value;
  const category = categoryInput.value;
  const type = typeInput.value;

  if (amount > 50) {
    alert('Maximum questions allowed is 50.');
    return;
  }

  fetchQuizData(amount, difficulty, category, type);
});

quizForm.addEventListener('submit', function (event) {
  event.preventDefault();
  submitQuiz();
});

function submitQuiz() {
  clearInterval(timerInterval);

  if (!quizData.length) {
    console.error('Quiz data is not available.');
    return;
  }

  const submittedAnswers = document.querySelectorAll('.question input:checked');
  const quizResults = [];

  submittedAnswers.forEach((answer, index) => {
    const question = quizData[index];
    const userAnswer = answer.value;
    const isCorrect = userAnswer === question.correct_answer;
    quizResults.push({
      question: question.question,
      correct_answer: question.correct_answer,
      userAnswer: userAnswer,
      isCorrect: isCorrect
    });
  });

  localStorage.setItem('quizData', JSON.stringify(quizResults));
  window.location.href = './html/results.html';
}
