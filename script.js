'use strict';

// Initialize variables
let currentSurahIndex = 0;
let isPlaying = false;
let audioPlayer = new Audio(); // Initialize a new Audio object
let progressBar = document.getElementById("progress-bar");
let currentTimeDisplay = document.getElementById("current-time");
let totalTimeDisplay = document.getElementById("total-time");
let musicData = []; // Initialize musicData globally

// Single image for all Surahs (no dynamic image change anymore)
const defaultImage = "https://static.vecteezy.com/system/resources/previews/037/993/568/non_2x/ai-generated-islamic-holy-al-quran-with-arabic-calligraphy-and-tasbih-beads-photo.jpg";

// Fetch Surah data from the API
const surahApiUrl = 'https://api.alquran.cloud/v1/surah';

fetch(surahApiUrl)
  .then(response => response.json())
  .then(data => {
    const surahs = data.data;

    // Populate musicData array
    musicData = surahs.map((surah, i) => ({
      title: surah.name,
      surahNumber: String(i + 1).padStart(3, '0'),
      titleEnglish: surah.englishName,
      meaning: surah.englishNameTranslation,
      revelationPlace: surah.revelationType, // Place of Revelation (Mecca or Medina)
    }));

    populatePlaylist(musicData);
    changePlayerInfo(musicData[0]); // Load the first Surah by default (but not play)
  })
  .catch(error => console.error('Error fetching Surah data:', error));

// Populate the playlist with Surah names and links
function populatePlaylist(musicData) {
  const surahListContainer = document.querySelector("#surah-list");

  musicData.forEach((music, index) => {
    const listItem = document.createElement('li');

    // Surah number and name
    const surahNumber = document.createElement('span');
    surahNumber.classList.add('surah-number');
    surahNumber.textContent = ` ${music.surahNumber}`;

    const surahName = document.createElement('span');
    surahName.classList.add('surah-name');
    surahName.textContent = music.title;

    const button = document.createElement('button');
    button.classList.add("surah-item");
    button.dataset.playlistItem = index;
    button.innerHTML = '';
    
    // Add the Surah number and name to the button
    button.appendChild(surahNumber);
    button.appendChild(surahName);

    button.addEventListener('click', () => selectSurah(music, index));
    
    listItem.appendChild(button);
    surahListContainer.appendChild(listItem);
  });
}

// Get the "Jump Back 10%" button
const jumpBack10Button = document.querySelector("#jump-back-10-btn");

jumpBack10Button.addEventListener('click', () => {
  const duration = audioPlayer.duration;
  const jumpBackTime = duration * 0.1; 
  audioPlayer.currentTime = Math.max(audioPlayer.currentTime - jumpBackTime, 0);
  updateProgressBar();
});

// Jump 10% forward functionality
const jump10Button = document.querySelector("#jump-10-btn");

jump10Button.addEventListener('click', () => {
  const duration = audioPlayer.duration;
  const jumpTime = duration * 0.1; 
  audioPlayer.currentTime = Math.min(audioPlayer.currentTime + jumpTime, duration);
  updateProgressBar();
});

// Function to update the progress bar
function updateProgressBar() {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration;
  const progress = (currentTime / duration) * 100;

  progressBar.value = progress;
  currentTimeDisplay.textContent = formatTime(currentTime);
  totalTimeDisplay.textContent = formatTime(duration);
}

// Helper function to format time (mm:ss)
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
}

// Toggle playlist visibility
const togglePlaylistBtn = document.querySelector("#menu-toggle");
const sidebar = document.querySelector("#sidebar");
const closeBtn = document.querySelector("#close-btn");

togglePlaylistBtn.addEventListener("click", () => {
  if (window.innerWidth >= 1024) {
    sidebar.style.left = sidebar.style.left === '0px' ? '-250px' : '0px';
  } else {
    sidebar.style.left = sidebar.style.left === '0px' ? '-250px' : '0px';
  }
});

closeBtn.addEventListener("click", closeSidebar);

function closeSidebar() {
  sidebar.style.left = '-250px';
}

// Mute/Unmute functionality
const muteButton = document.querySelector("#mute-btn");

muteButton.addEventListener('click', () => {
  audioPlayer.muted = !audioPlayer.muted;
  muteButton.textContent = audioPlayer.muted ? '🔇' : '🔊';
});

// Next/Previous functionality
const nextButton = document.querySelector("#next-btn");
const prevButton = document.querySelector("#prev-btn");

nextButton.addEventListener('click', () => {
  currentSurahIndex = (currentSurahIndex + 1) % musicData.length;
  changePlayerInfo(musicData[currentSurahIndex]);
  audioPlayer.play();
  playStopButton.textContent = "⏸️";
  isPlaying = true;
});

prevButton.addEventListener('click', () => {
  currentSurahIndex = (currentSurahIndex - 1 + musicData.length) % musicData.length;
  changePlayerInfo(musicData[currentSurahIndex]);
  audioPlayer.play();
  playStopButton.textContent = "⏸️";
  isPlaying = true;
});

// Handle progress bar update
audioPlayer.ontimeupdate = function() {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration;
  const progress = (currentTime / duration) * 100;

  progressBar.value = progress;
  currentTimeDisplay.textContent = formatTime(currentTime);
  totalTimeDisplay.textContent = formatTime(duration);
};

progressBar.addEventListener('input', function() {
  const seekTime = (progressBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
});

const playStopButton = document.querySelector("#play-stop-btn");

playStopButton.addEventListener('click', () => {
  if (isPlaying) {
    audioPlayer.pause();
    playStopButton.textContent = '▶️';
  } else {
    audioPlayer.play();
    playStopButton.textContent = '⏸️';
  }
  isPlaying = !isPlaying;
});

// Auto Play Button
let autoPlayEnabled = false;
const autoPlayButton = document.querySelector("#auto-play-btn");

autoPlayButton.addEventListener('click', () => {
  autoPlayEnabled = !autoPlayEnabled;
  autoPlayButton.textContent = autoPlayEnabled ? "🔀:⏺️" : "🔀:⏹️";
});

// Repeat Button
let repeatEnabled = false;
const repeatButton = document.querySelector("#repeat-btn");

repeatButton.addEventListener('click', () => {
  repeatEnabled = !repeatEnabled;
  repeatButton.textContent = repeatEnabled ? "🔁:⏺️" : "🔁:⏹️";
});

audioPlayer.onended = function() {
  if (repeatEnabled) {
    audioPlayer.play();
  } else if (autoPlayEnabled) {
    nextButton.click();
  }
};
