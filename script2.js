let timerInterval;
let elapsedTime = 0;
let isRunning = false;
let lapCounter = 0;
let history = JSON.parse(localStorage.getItem('stopwatchHistory')) || [];

const timeDisplay = document.getElementById('time-display');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const historyBtn = document.getElementById('historyBtn');
const lapTimesContainer = document.getElementById('lap-times');
const historyContainer = document.getElementById('history');

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
}

function updateTime() {
    elapsedTime += 10;
    timeDisplay.textContent = formatTime(elapsedTime);
}

function playSound(type) {
    const audio = new Audio(`sounds/${type}.mp3`);
    audio.play();
}

function showNotification(message) {
    alert(message);
}

startStopBtn.addEventListener('click', function() {
    if (!isRunning) {
        playSound('start');
        timerInterval = setInterval(updateTime, 10);
        startStopBtn.textContent = 'Stop';
        lapBtn.disabled = false;
    } else {
        playSound('stop');
        clearInterval(timerInterval);
        startStopBtn.textContent = 'Start';
    }
    isRunning = !isRunning;
});

resetBtn.addEventListener('click', function() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    timeDisplay.textContent = '00:00:00';
    startStopBtn.textContent = 'Start';
    isRunning = false;
    lapBtn.disabled = true;
    lapCounter = 0;
    lapTimesContainer.innerHTML = '';
    playSound('reset');
});

lapBtn.addEventListener('click', function() {
    lapCounter++;
    const lapTime = formatTime(elapsedTime);
    const lapDiv = document.createElement('div');
    lapDiv.innerHTML = `<span>Lap ${lapCounter}</span><span>${lapTime}</span>`;
    lapTimesContainer.appendChild(lapDiv);
    
    // Add to history
    history.push({ lap: lapCounter, time: lapTime });
    localStorage.setItem('stopwatchHistory', JSON.stringify(history));
});

historyBtn.addEventListener('click', function() {
    historyContainer.innerHTML = '<h3>Lap History</h3>';
    if (history.length === 0) {
        historyContainer.innerHTML += '<p>No history available.</p>';
    } else {
        history.forEach(item => {
            const historyDiv = document.createElement('div');
            historyDiv.innerHTML = `<span>Lap ${item.lap}</span><span>${item.time}</span>`;
            historyContainer.appendChild(historyDiv);
        });
    }
});
