// Game State
let currentState = {
    formulaType: 'oddiy',
    digitCount: 1,
    speed: 1.0,
    problemCount: 5,
    numbers: [],
    correctAnswer: 0,
    currentIndex: 0,
    streak: parseInt(localStorage.getItem('streak')) || 0,
    xp: parseInt(localStorage.getItem('xp')) || 0
};

// Elements
const screens = {
    setup: document.getElementById('setup-screen'),
    game: document.getElementById('game-screen'),
    input: document.getElementById('input-screen'),
    result: document.getElementById('result-screen')
};

const display = {
    countdown: document.getElementById('countdown'),
    numberDisplay: document.getElementById('number-display'),
    sign: document.getElementById('sign'),
    number: document.getElementById('number'),
    progress: document.querySelector('.progress-fill'),
    streak: document.getElementById('current-streak'),
    xp: document.getElementById('total-xp')
};

const inputs = {
    digitCount: document.getElementById('digit-count'),
    speed: document.getElementById('speed'),
    problemCount: document.getElementById('problem-count'),
    answer: document.getElementById('answer-input')
};

// Formula Selection Logic
document.querySelectorAll('.option-card').forEach(card => {
    card.onclick = () => {
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currentState.formulaType = card.dataset.value;
        if ('vibrate' in navigator) navigator.vibrate(10);
    };
});

// Initialize
display.streak.textContent = currentState.streak;
display.xp.textContent = currentState.xp;

// Rules & Formulas (Full version from original project)
const KATTA_DOST_ADD = {
    1: [9], 2: [8], 3: [7], 4: [6], 5: [5], 6: [4, 9], 7: [5, 6, 7], 8: [5, 6], 9: [5]
};
const KATTA_DOST_SUB = {
    1: [0], 2: [0, 1], 3: [0, 1, 2], 4: [0, 1, 2, 3], 5: [0, 1, 2, 3, 4], 6: [0, 5], 7: [2, 3, 4], 8: [3, 4], 9: [4]
};
const RULES_BASIC = {
    0: { add: [1,2,3,4,5,6,7,8,9], sub: [] },
    1: { add: [1,2,3,5,6,7,8], sub: [1] },
    2: { add: [1,2,5,6,7], sub: [1,2] },
    3: { add: [1,5,6], sub: [1,2,3] },
    4: { add: [5], sub: [1,2,3,4] },
    5: { add: [1,2,3,4], sub: [5] },
    6: { add: [1,2,3], sub: [1,5,6] },
    7: { add: [1,2], sub: [1,2,5,7] },
    8: { add: [1], sub: [1,2,3,5,8] },
    9: { add: [], sub: [1,2,3,4,5,6,7,8,9] }
};

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
}

// Problem Generator
function generateProblem() {
    let current = 0;
    const result = [];
    const type = currentState.formulaType;
    const digits = parseInt(inputs.digitCount.value);
    const count = parseInt(inputs.problemCount.value);

    for (let i = 0; i < count; i++) {
        let nextNum;
        let isAddition = true;

        if (i === 0) {
            nextNum = Math.floor(Math.random() * (Math.pow(10, digits) - 1)) + 1;
            current = nextNum;
        } else {
            const lastDigit = current % 10;
            const hasTens = current >= 10;
            let possible = [];

            if (type === 'oddiy') {
                const rules = RULES_BASIC[lastDigit];
                rules.add.forEach(n => possible.push({v: n, add: true}));
                rules.sub.forEach(n => { if (current >= n) possible.push({v: n, add: false}); });
            } else if (type === 'formula5') {
                if (lastDigit < 5) [4,3,2,1].filter(n => lastDigit + n >= 5).forEach(n => possible.push({v: n, add: true}));
                if (lastDigit >= 5) [1,2,3,4].filter(n => lastDigit - n < 5).forEach(n => possible.push({v: n, add: false}));
            } else if (type === 'formula10') {
                for(let d=1; d<=9; d++) {
                    if (KATTA_DOST_ADD[d]?.includes(lastDigit)) possible.push({v: d, add: true});
                    if (hasTens && KATTA_DOST_SUB[d]?.includes(lastDigit)) possible.push({v: d, add: false});
                }
            } else { // Mix
                possible.push({v: Math.floor(Math.random()*9)+1, add: Math.random() > 0.4});
            }

            if (possible.length === 0) {
                nextNum = Math.floor(Math.random() * 5) + 1;
                isAddition = current < 5;
            } else {
                const choice = possible[Math.floor(Math.random() * possible.length)];
                nextNum = choice.v;
                isAddition = choice.add;
            }
            
            if (digits > 1 && Math.random() > 0.5) {
                nextNum = nextNum * Math.pow(10, Math.floor(Math.random() * digits));
            }
        }

        if (i > 0) {
            if (isAddition) current += nextNum;
            else current -= nextNum;
        }

        result.push({
            value: nextNum,
            isAddition: isAddition,
            isFirst: i === 0
        });
    }

    return { numbers: result, answer: current };
}

// Game Logic
async function startGame() {
    const problem = generateProblem();
    currentState.numbers = problem.numbers;
    currentState.correctAnswer = problem.answer;
    currentState.currentIndex = 0;
    currentState.speed = parseFloat(inputs.speed.value);

    showScreen('game');
    
    // Countdown
    for (let i = 3; i > 0; i--) {
        display.countdown.textContent = i;
        display.countdown.classList.add('pulse');
        await new Promise(r => setTimeout(r, 800));
        display.countdown.classList.remove('pulse');
    }
    display.countdown.textContent = '';

    // Show Numbers
    display.numberDisplay.style.opacity = '1';
    for (let i = 0; i < currentState.numbers.length; i++) {
        const item = currentState.numbers[i];
        
        display.sign.textContent = item.isFirst ? '' : (item.isAddition ? '+' : '−');
        display.number.textContent = item.value;
        display.numberDisplay.classList.add('show');
        
        display.progress.style.width = `${((i + 1) / currentState.numbers.length) * 100}%`;

        speak(item.isFirst ? `${item.value}` : `${item.isAddition ? "qo'sh" : "ayir"} ${item.value}`);

        await new Promise(r => setTimeout(r, currentState.speed * 1000));
        display.numberDisplay.classList.remove('show');
        await new Promise(r => setTimeout(r, 100)); 
    }

    showScreen('input');
    inputs.answer.focus();
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'uz-UZ';
        utterance.rate = 1.5;
        window.speechSynthesis.speak(utterance);
    }
}

function checkAnswer() {
    const userVal = parseInt(inputs.answer.value);
    const isCorrect = userVal === currentState.correctAnswer;

    document.getElementById('correct-answer').textContent = currentState.correctAnswer;
    document.getElementById('user-answer').textContent = userVal || 0;
    
    const iconContainer = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');

    if (isCorrect) {
        iconContainer.innerHTML = '<i data-lucide="check-circle-2" class="success-icon"></i>';
        resultText.textContent = "Barakalla! To'g'ri!";
        resultText.style.color = 'var(--success)';
        
        currentState.streak++;
        currentState.xp += 10;
        
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#818cf8', '#c084fc', '#ffffff']
        });
    } else {
        iconContainer.innerHTML = '<i data-lucide="x-circle" class="error-icon"></i>';
        resultText.textContent = "Xato! Keyingi safar urinib ko'ring.";
        resultText.style.color = 'var(--error)';
        currentState.streak = 0;
    }

    lucide.createIcons();
    
    localStorage.setItem('streak', currentState.streak);
    localStorage.setItem('xp', currentState.xp);
    display.streak.textContent = currentState.streak;
    display.xp.textContent = currentState.xp;

    showScreen('result');
    inputs.answer.value = '';
}

// Event Listeners
document.getElementById('start-btn').onclick = startGame;
document.getElementById('submit-btn').onclick = checkAnswer;
document.getElementById('restart-btn').onclick = startGame;
document.getElementById('home-btn').onclick = () => showScreen('setup');

// Number pad logic
document.querySelectorAll('.numpad button').forEach(btn => {
    btn.onclick = () => {
        const val = btn.textContent;
        if (val === 'C') inputs.answer.value = '';
        else if (val === '←') inputs.answer.value = inputs.answer.value.slice(0, -1);
        else inputs.answer.value += val;
        
        if ('vibrate' in navigator) navigator.vibrate(10);
    };
});

// Settings buttons
document.querySelectorAll('.minus').forEach(btn => {
    btn.onclick = () => {
        const input = btn.nextElementSibling;
        if (input.value > input.min) {
            input.value = parseInt(input.value) - 1;
            input.dispatchEvent(new Event('change'));
        }
    };
});

document.querySelectorAll('.plus').forEach(btn => {
    btn.onclick = () => {
        const input = btn.previousElementSibling;
        if (input.value < input.max) {
            input.value = parseInt(input.value) + 1;
            input.dispatchEvent(new Event('change'));
        }
    };
});

inputs.speed.oninput = (e) => {
    document.querySelector('.slider-value').textContent = `${parseFloat(e.target.value).toFixed(1)}s`;
};

inputs.answer.onkeyup = (e) => {
    if (e.key === 'Enter') checkAnswer();
};
