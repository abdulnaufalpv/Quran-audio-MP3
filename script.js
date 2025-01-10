'use strict';

// Initialize variables
let currentSurahIndex = 0;
let isPlaying = false;
let audioPlayer = new Audio();
let progressBar = document.getElementById("progress-bar");
let currentTimeDisplay = document.getElementById("current-time");
let totalTimeDisplay = document.getElementById("total-time");
let musicData = [];

// Default image for all Surahs
const defaultImage = "https://static.vecteezy.com/system/resources/previews/037/993/568/non_2x/ai-generated-islamic-holy-al-quran-with-arabic-calligraphy-and-tasbih-beads-photo.jpg";

// Fetch Surah data from the API
const surahApiUrl = 'https://api.alquran.cloud/v1/surah';
fetch(surahApiUrl)
    .then(response => response.json())
    .then(data => {
        const surahs = data.data;
        musicData = surahs.map((surah, i) => ({
            title: surah.name,
            surahNumber: String(i + 1).padStart(3, '0'),
            titleEnglish: surah.englishName,
            meaning: surah.englishNameTranslation,
            revelationPlace: surah.revelationType,
        }));
        populatePlaylist(musicData);
        changePlayerInfo(musicData[0]); // Load first Surah
    })
    .catch(error => console.error('Error fetching Surah data:', error));

// Populate the playlist
function populatePlaylist(musicData) {
    const surahListContainer = document.querySelector("#surah-list");
    musicData.forEach((music, index) => {
        const listItem = document.createElement('li');
        const surahNumber = document.createElement('span');
        surahNumber.classList.add('surah-number');
        surahNumber.textContent = ` ${music.surahNumber}`;
        const surahName = document.createElement('span');
        surahName.classList.add('surah-name');
        surahName.textContent = music.title;
        const button = document.createElement('button');
        button.classList.add("surah-item");
        button.dataset.playlistItem = index;
        button.appendChild(surahNumber);
        button.appendChild(surahName);
        button.addEventListener('click', () => selectSurah(music, index));
        listItem.appendChild(button);
        surahListContainer.appendChild(listItem);
    });
}

// Select Surah and change player info
function selectSurah(music, index) {
    currentSurahIndex = index;
    changePlayerInfo(music);
    closeSidebar();
    audioPlayer.play().then(() => {
        playStopButton.textContent = "⏹️";
        isPlaying = true;
    }).catch(error => {
        console.error("Error playing the audio:", error);
    });
}

// Update player with Surah data dynamically
function changePlayerInfo(music) {
    const playerBanner = document.querySelector("#player-banner");
    const playerTitle = document.querySelector("#player-title");
    const playerNumber = document.querySelector("#player-number");
    const playerTitleEnglish = document.querySelector("#player-title-english");
    const playerTitleMeaning = document.querySelector("#player-title-meaning");
    const playerRevelation = document.querySelector("#place-of-revelation");

    playerBanner.src = defaultImage;
    playerTitle.textContent = `${music.title}`;
    playerNumber.textContent = ` ${music.surahNumber}`;
    playerTitleEnglish.textContent = ` ${music.titleEnglish || 'N/A'}`;
    playerTitleMeaning.textContent = ` ${music.meaning || 'N/A'}`;
    playerRevelation.textContent = ` Revelation : ${music.revelationPlace || 'Unknown'}`;

    const audioPath = `https://ia802903.us.archive.org/34/items/lifeways11_gmail_001_20180201_0110/${music.surahNumber}.mp3`;
    audioPlayer.src = audioPath;
    audioPlayer.load();
    progressBar.value = 0;
    currentTimeDisplay.textContent = "00:00";
    totalTimeDisplay.textContent = "00:00";

    // Listen for audio time updates
    audioPlayer.ontimeupdate = updateProgress;
    audioPlayer.onloadedmetadata = () => {
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    };
    audioPlayer.onended = () => {
        isPlaying = false;
        playStopButton.textContent = "▶️";
    };
}

// Format time function
function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update progress bar
function updateProgress() {
    if (audioPlayer.duration) {
        progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    }
}

// Toggle play and stop
const playStopButton = document.getElementById("play-stop-btn");
playStopButton.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        playStopButton.textContent = "▶️";
    } else {
        audioPlayer.play();
        playStopButton.textContent = "⏹️";
    }
    isPlaying = !isPlaying;
});

// Toggle sidebar visibility
const menuToggleButton = document.getElementById("menu-toggle");
menuToggleButton.addEventListener('click', toggleSidebar);

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.left = (sidebar.style.left === "0px") ? "-300px" : "0px";
}

const closeBtn = document.getElementById("close-btn");
closeBtn.addEventListener('click', closeSidebar);

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.left = "-300px";
}
