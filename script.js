const audioPlayer = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause-btn');
const songTitle = document.querySelector('.song-title');
const diaryForm = document.getElementById('diary-form');
const diaryEntryInput = document.getElementById('diary-entry');
const entriesDiv = document.getElementById('entries');
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const diarySection = document.getElementById('diary-section');

let isPlaying = false;

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseButton.innerHTML = '&#9658;'; // Play simgesi
    } else {
        audioPlayer.play();
        playPauseButton.innerHTML = '&#10074;&#10074;'; // Pause simgesi
    }
    isPlaying = !isPlaying;
}

playPauseButton.addEventListener('click', togglePlayPause);

audioPlayer.addEventListener('play', function() {
    isPlaying = true;
    playPauseButton.innerHTML = '&#10074;&#10074;'; // Pause simgesi
});

audioPlayer.addEventListener('pause', function() {
    isPlaying = false;
    playPauseButton.innerHTML = '&#9658;'; // Play simgesi
});

audioPlayer.addEventListener('ended', function() {
    isPlaying = false;
    playPauseButton.innerHTML = '&#9658;'; // Play simgesi
});

audioPlayer.addEventListener('loadedmetadata', function() {
    songTitle.textContent = audioPlayer.getAttribute('src').replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.');
});

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'admin' && password === 'admin') {
        loginSection.style.display = 'none';
        diarySection.style.display = 'block';
        loadEntries();
    } else {
        alert('Hatalı kullanıcı adı veya şifre.');
    }
});

diaryForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const entryText = diaryEntryInput.value.trim();
    if (entryText !== '') {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        entryDiv.textContent = entryText;
        entriesDiv.appendChild(entryDiv);
        saveEntry(entryText);
        diaryEntryInput.value = '';
    }
});

function saveEntry(entryText) {
    fetch('/save-entry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry: entryText }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

function loadEntries() {
    fetch('/get-entries')
    .then(response => response.json())
    .then(data => {
        data.entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('entry');
            entryDiv.textContent = entry;
            entriesDiv.appendChild(entryDiv);
        });
    })
    .catch(error => console.error('Error:', error));
}
