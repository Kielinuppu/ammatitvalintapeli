const questions = [
    { audio: 'aani1.mp3', correctImage: '1.png', options: ['1.png', '10.png', '2.png'] },
    { audio: 'aani2.mp3', correctImage: '2.png', options: ['12.png', '2.png', '7.png'] },
    { audio: 'aani3.mp3', correctImage: '3.png', options: ['11.png', '3.png', '4.png'] },
    { audio: 'aani4.mp3', correctImage: '4.png', options: ['4.png', '5.png', '8.png'] },
    { audio: 'aani5.mp3', correctImage: '5.png', options: ['9.png', '6.png', '5.png'] },
    { audio: 'aani6.mp3', correctImage: '6.png', options: ['6.png', '3.png', '2.png'] },
    { audio: 'aani7.mp3', correctImage: '7.png', options: ['8.png', '7.png', '5.png'] },
    { audio: 'aani8.mp3', correctImage: '8.png', options: ['1.png', '3.png', '8.png'] },
    { audio: 'aani9.mp3', correctImage: '9.png', options: ['9.png', '7.png', '1.png'] },
    { audio: 'aani10.mp3', correctImage: '10.png', options: ['10.png', '11.png', '6.png'] },
    { audio: 'aani11.mp3', correctImage: '11.png', options: ['12.png', '10.png', '11.png'] },
    { audio: 'aani12.mp3', correctImage: '12.png', options: ['12.png', '9.png', '4.png'] }
];

let currentQuestions = [];
let currentQuestion = 0;
let selectedOption = 0;
let correctAnswers = 0;
let checkButtonClicked = false;
let currentAudio = null;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('stars-container').style.display = 'block';
    document.querySelector('#question-container h2').style.display = 'block';
    currentQuestions = getRandomQuestions(5); // Muutettu 5 kysymykseen
    loadQuestion();
    playAudio('valitse.mp3', () => { // Vaihdettu kuka.mp3 -> valitse.mp3
        playAudio(currentQuestions[currentQuestion].audio);
    });
}

function getRandomQuestions(count) {
    return [...questions].sort(() => 0.5 - Math.random()).slice(0, count);
}


function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function loadQuestion() {
    const question = currentQuestions[currentQuestion];
    
    // Shuffle options and track correct answer's new position
    const shuffledOptions = shuffleArray(question.options);
    
    // Display shuffled options
    document.getElementById('option1').src = shuffledOptions[0];
    document.getElementById('option2').src = shuffledOptions[1];
    document.getElementById('option3').src = shuffledOptions[2];
    
    // Store the shuffled options for reference during checking
    question.shuffledOptions = shuffledOptions;
    
    document.getElementById('check-button').style.display = 'block';
    document.getElementById('next-arrow').style.display = 'none';
    checkButtonClicked = false;
    selectedOption = 0;
    
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    updateCheckButtonState();
}

function selectOption(option) {
    if (checkButtonClicked) return;
    
    selectedOption = option;
    const options = document.querySelectorAll('.option');
    options.forEach(optionElement => {
        optionElement.classList.remove('selected');
    });
    document.getElementById(`option${option}`).classList.add('selected');
    updateCheckButtonState();
}

function updateCheckButtonState() {
    const checkButton = document.getElementById('check-button');
    checkButton.disabled = selectedOption === 0;
    checkButton.classList.toggle('disabled', selectedOption === 0);
}

function checkAnswer() {
    if (checkButtonClicked || selectedOption === 0) return;
    
    checkButtonClicked = true;
    const question = currentQuestions[currentQuestion];
    
    const selectedElement = document.getElementById(`option${selectedOption}`);
    const selectedImage = question.shuffledOptions[selectedOption - 1];
    
    if (selectedImage === question.correctImage) {
        selectedElement.classList.add('correct');
        correctAnswers++;
        updateStars();
        playAudio('oikein.mp3');
    } else {
        selectedElement.classList.add('incorrect');
        // Find and highlight the correct option
        const correctOptionIndex = question.shuffledOptions.indexOf(question.correctImage) + 1;
        document.getElementById(`option${correctOptionIndex}`).classList.add('correct');
        playAudio('vaarin.mp3');
    }
    
    document.getElementById('check-button').style.display = 'none';
    document.getElementById('next-arrow').style.display = 'block';
}

function updateStars() {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = '<img src="tahti.png" alt="Star" class="star-icon">'.repeat(correctAnswers);
}

function nextQuestion() {
    stopAllAudio();
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('correct', 'incorrect', 'selected');
    });
    currentQuestion++;
    if (currentQuestion >= currentQuestions.length) {
        showResult();
    } else {
        loadQuestion();
        // Soitetaan vain kysymyksen audio, ei valitse.mp3:a
        playAudio(currentQuestions[currentQuestion].audio);
    }
}

function showResult() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h1>AMMATIT</h1>
        <p id="result">SAIT ${correctAnswers} / 5 OIKEIN</p>
        <div id="final-stars-container">${'<img src="tahti.png" alt="Star" class="star-icon">'.repeat(correctAnswers)}</div>
        <button onclick="restartGame()">PELAA UUDELLEEN</button>
    `;
    document.getElementById('stars-container').style.display = 'none';
}

function restartGame() {
    stopAllAudio();
    currentQuestion = 0;
    selectedOption = 0;
    correctAnswers = 0;
    checkButtonClicked = false;
    currentQuestions = getRandomQuestions(5); // Muutettu 5 kysymykseen
    
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h2>VALITSE OIKEA KUVA:</h2>
        <div class="options">
            <img id="option1" class="option" onclick="selectOption(1)">
            <img id="option2" class="option" onclick="selectOption(2)">
            <img id="option3" class="option" onclick="selectOption(3)">
        </div>
        <div id="game-controls">
            <button id="check-button" onclick="checkAnswer()">TARKISTA</button>
            <img id="next-arrow" src="nuoli.png" onclick="nextQuestion()">
        </div>
    `;
    
    document.getElementById('stars-container').innerHTML = '';
    document.getElementById('stars-container').style.display = 'block';
    
    loadQuestion();
    playAudio('valitse.mp3', () => { // Vaihdettu kuka.mp3 -> valitse.mp3
        playAudio(currentQuestions[currentQuestion].audio);
    });
}

function stopAllAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function playAudio(src, callback) {
    stopAllAudio();
    currentAudio = new Audio(src);
    currentAudio.play().catch(error => console.error('Error playing audio:', error));
    if (callback) {
        currentAudio.onended = callback;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startGame);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' && document.getElementById('next-arrow').style.display !== 'none') {
            nextQuestion();
        }
    });
});