// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Global State
let currentUser = null;
let currentToken = null;
let allWords = [];
let currentQuiz = null;
let quizAnswers = [];
let startTime = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        currentToken = token;
        showMainPages();
        loadUserData();
    } else {
        showPage('auth');
    }
});

// Toggle between login and register
function toggleAuthForm() {
    document.getElementById('loginForm').classList.toggle('active');
    document.getElementById('registerForm').classList.toggle('active');
    event.preventDefault();
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            
            currentToken = data.token;
            currentUser = data;
            
            showMainPages();
            loadUserData();
            alert('Login successful!');
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, confirmPassword })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', username);
            
            currentToken = data.token;
            currentUser = data;
            
            showMainPages();
            loadUserData();
            alert('Registration successful!');
        } else {
            alert('Registration failed: ' + data.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Show Main Pages
function showMainPages() {
    document.getElementById('authPage').classList.remove('active');
    document.getElementById('navLogout').style.display = 'block';
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    currentToken = null;
    currentUser = null;
    
    document.getElementById('navLogout').style.display = 'none';
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    
    showPage('auth');
}

// Show Page
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected page
    const pageMap = {
        'home': 'homePage',
        'learn': 'learnPage',
        'quiz': 'quizPage',
        'progress': 'progressPage',
        'auth': 'authPage'
    };

    const pageElement = document.getElementById(pageMap[pageName]);
    if (pageElement) {
        pageElement.classList.add('active');
    }

    // Highlight active nav button
    const navButtonMap = {
        'home': 'navHome',
        'learn': 'navLearn',
        'quiz': 'navQuiz',
        'progress': 'navProgress'
    };

    if (navButtonMap[pageName]) {
        document.getElementById(navButtonMap[pageName]).classList.add('active');
    }

    // Load page data
    if (pageName === 'home') {
        loadHomeData();
    } else if (pageName === 'learn') {
        loadWords();
    } else if (pageName === 'progress') {
        loadProgressData();
    }
}

// Load User Data
async function loadUserData() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
            document.getElementById('welcomeMessage').textContent = `Welcome, ${data.user.username}!`;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load Home Page Data
async function loadHomeData() {
    try {
        const response = await fetch(`${API_BASE_URL}/progress/stats`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (data.success) {
            const stats = data.stats;
            document.getElementById('wordsLearned').textContent = stats.total_words_learned;
            document.getElementById('avgScore').textContent = (stats.avg_quiz_score || 0) + '%';
            document.getElementById('quizzesTaken').textContent = stats.total_quizzes;
        }
    } catch (error) {
        console.error('Error loading home data:', error);
    }
}

// Load Words
async function loadWords() {
    try {
        const response = await fetch(`${API_BASE_URL}/words`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (data.success) {
            allWords = data.words;
            displayWords(allWords);
            loadCategories();
        }
    } catch (error) {
        console.error('Error loading words:', error);
    }
}

// Display Words
function displayWords(words) {
    const wordsGrid = document.getElementById('wordsGrid');
    wordsGrid.innerHTML = '';

    if (words.length === 0) {
        wordsGrid.innerHTML = '<p>No words found. Check back later!</p>';
        return;
    }

    words.forEach(word => {
        const wordCard = document.createElement('div');
        wordCard.className = 'word-card';
        wordCard.innerHTML = `
            <h3>${word.english}</h3>
            <p>${word.chinese}</p>
            <span class="category">${word.category}</span>
            <button class="mark-btn" onclick="markWordAsLearned(${word.id})">Mark as Learned</button>
        `;
        wordsGrid.appendChild(wordCard);
    });
}

// Filter Words
function filterWords() {
    const category = document.getElementById('categoryFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;

    let filtered = allWords;

    if (category) {
        filtered = filtered.filter(w => w.category === category);
    }

    if (difficulty) {
        filtered = filtered.filter(w => w.difficulty === difficulty);
    }

    displayWords(filtered);
}

// Load Categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/words/categories/list`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (data.success) {
            const categoryFilter = document.getElementById('categoryFilter');
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Mark Word as Learned
async function markWordAsLearned(wordId) {
    try {
        const response = await fetch(`${API_BASE_URL}/progress/mark-learned`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ wordId })
        });

        const data = await response.json();
        if (data.success) {
            alert('Word marked as learned!');
            loadHomeData();
        }
    } catch (error) {
        console.error('Error marking word:', error);
    }
}

// Start Quiz
async function startQuiz() {
    const count = document.getElementById('quizCount').value;

    try {
        const response = await fetch(`${API_BASE_URL}/quiz/random?count=${count}`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (data.success) {
            currentQuiz = data.quiz;
            quizAnswers = [];
            startTime = Date.now();

            document.getElementById('quizStart').style.display = 'none';
            document.getElementById('quizContent').style.display = 'block';
            document.getElementById('quizResults').style.display = 'none';

            showQuizQuestion(0);
        }
    } catch (error) {
        alert('Error starting quiz: ' + error.message);
    }
}

// Show Quiz Question
function showQuizQuestion(index) {
    if (index >= currentQuiz.length) {
        submitQuiz();
        return;
    }

    const question = currentQuiz[index];
    const progress = ((index + 1) / currentQuiz.length) * 100;

    document.getElementById('progressFill').style.width = progress + '%';

    // Get random options
    const options = getRandomOptions(question.correctAnswer);

    const questionHTML = `
        <div class="question">
            <div class="question-number">Question ${index + 1} of ${currentQuiz.length}</div>
            <h3>What is the Chinese translation of "${question.english}"?</h3>
            <div class="options">
                ${options.map(option => `
                    <div class="option" onclick="selectAnswer(${index}, '${option}')">${option}</div>
                `).join('')}
            </div>
        </div>
        <div class="quiz-button-group">
            <button class="btn" onclick="previousQuestion(${index})" ${index === 0 ? 'disabled' : ''}>Previous</button>
            <button class="btn btn-primary" onclick="nextQuestion(${index})">Next</button>
        </div>
    `;

    document.getElementById('questionContainer').innerHTML = questionHTML;

    // Highlight previously selected answer
    if (quizAnswers[index]) {
        document.querySelectorAll('.option').forEach(opt => {
            if (opt.textContent === quizAnswers[index]) {
                opt.classList.add('selected');
            }
        });
    }
}

// Get Random Options
function getRandomOptions(correctAnswer) {
    const options = [correctAnswer];
    
    while (options.length < 4) {
        const randomWord = currentQuiz[Math.floor(Math.random() * currentQuiz.length)];
        if (!options.includes(randomWord.correctAnswer)) {
            options.push(randomWord.correctAnswer);
        }
    }

    return options.sort(() => Math.random() - 0.5);
}

// Select Answer
function selectAnswer(index, answer) {
    quizAnswers[index] = answer;
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.textContent === answer) {
            opt.classList.add('selected');
        }
    });
}

// Next Question
function nextQuestion(index) {
    showQuizQuestion(index + 1);
}

// Previous Question
function previousQuestion(index) {
    showQuizQuestion(index - 1);
}

// Submit Quiz
async function submitQuiz() {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const answers = currentQuiz.map((q, i) => ({
        wordId: q.id,
        userAnswer: quizAnswers[i] || ''
    }));

    try {
        const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({
                answers,
                totalQuestions: currentQuiz.length,
                duration
            })
        });

        const data = await response.json();
        if (data.success) {
            const result = data.result;
            document.getElementById('quizContent').style.display = 'none';
            document.getElementById('quizResults').style.display = 'block';
            document.getElementById('correctCount').textContent = result.correctAnswers;
            document.getElementById('totalCount').textContent = result.totalQuestions;
            document.getElementById('scoreDisplay').textContent = result.score;
            document.getElementById('accuracyDisplay').textContent = result.accuracy;

            loadHomeData();
        }
    } catch (error) {
        alert('Error submitting quiz: ' + error.message);
    }
}

// Reset Quiz
function resetQuiz() {
    document.getElementById('quizStart').style.display = 'block';
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizResults').style.display = 'none';
    currentQuiz = null;
    quizAnswers = [];
}

// Load Progress Data
async function loadProgressData() {
    try {
        const response = await fetch(`${API_BASE_URL}/progress/stats`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (data.success) {
            const stats = data.stats;
            document.getElementById('progressWords').textContent = stats.total_words_learned;
            document.getElementById('progressRate').textContent = stats.learning_rate + '%';
            document.getElementById('progressAvgScore').textContent = stats.avg_quiz_score + '%';
            document.getElementById('progressQuizzesCount').textContent = stats.total_quizzes;
        }

        // Load learned words
        const wordsResponse = await fetch(`${API_BASE_URL}/progress/learned-words`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const wordsData = await wordsResponse.json();
        if (wordsData.success) {
            displayLearnedWords(wordsData.words);
        }
    } catch (error) {
        console.error('Error loading progress data:', error);
    }
}

// Display Learned Words
function displayLearnedWords(words) {
    const list = document.getElementById('learnedWordsList');
    list.innerHTML = '';

    if (words.length === 0) {
        list.innerHTML = '<p>No words learned yet. Start learning!</p>';
        return;
    }

    words.forEach(word => {
        const item = document.createElement('div');
        item.className = 'learned-word-item';
        item.innerHTML = `
            <div class="english">${word.english}</div>
            <div class="chinese">${word.chinese}</div>
        `;
        list.appendChild(item);
    });
}