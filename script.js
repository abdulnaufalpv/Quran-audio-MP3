// Define the state variables
let isPlaying = false;
let audioPlayer = new Audio();
let currentSurahIndex = 0;
let progressBar = document.getElementById('progress-bar');
let currentTimeDisplay = document.getElementById('current-time');
let totalTimeDisplay = document.getElementById('total-time');
let surahData = [];

const surahApiUrl = 'https://api.alquran.cloud/v1/surah';

// Fetch Surah data and populate the playlist
fetch(surahApiUrl)
  .then(response => response.json())
  .then(data => {
    surahData = data.data;
    populateSurahList(surahData);
    updatePlayerInfo(surahData[currentSurahIndex]);
  })
  .catch(error => console.error('Error fetching Surah data:', error));

// Populate Surah list in the sidebar
function populateSurahList(data) {
  const surahList = document.getElementById('surah-list');
  data.forEach((surah, index) => {
    const listItem = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = `${surah.number} - ${surah.name}`;
    button.addEventListener('click', () => selectSurah(index));
    listItem.appendChild(button);
    surahList.appendChild(listItem);
  });
}

// Update the player with Surah details
function updatePlayerInfo(surah) {
  document.getElementById('player-title').textContent = surah.name;
  document.getElementById('surah-details').textContent = `${surah.revelationType} | ${surah.englishName}`;
  audioPlayer.src = surah.audio;
  audioPlayer.load();
  audioPlayer.onloadedmetadata = () => {
    totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
  };
}

// Format time to MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Play or pause the audio
document.getElementById('play-btn').addEventListener('click', () => {
  if (isPlaying) {
    audioPlayer.pause();
  } else {
    audioPlayer.play();
  }
  isPlaying = !isPlaying;
  document.getElementById('play-btn').textContent = isPlaying ? '⏸️' : '▶️';
});

// Skip to the next Surah
document.getElementById('next-btn').addEventListener('click', () => {
  if (currentSurahIndex < surahData.length - 1) {
    currentSurahIndex++;
    updatePlayerInfo(surahData[currentSurahIndex]);
    if (isPlaying) {
      audioPlayer.play();
    }
  }
});

// Go back to the previous Surah
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentSurahIndex > 0) {
    currentSurahIndex--;
    updatePlayerInfo(surahData[currentSurahIndex]);
    if (isPlaying) {
      audioPlayer.play();
    }
  }
});

// Handle audio progress update
audioPlayer.addEventListener('timeupdate', () => {
  const currentTime = audioPlayer.currentTime;
  progressBar.value = (currentTime / audioPlayer.duration) * 100;
  currentTimeDisplay.textContent = formatTime(currentTime);
});

// Handle menu toggle
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').style.left = '0';
});

// Handle sidebar close button
document.getElementById('close-btn').addEventListener('click', () => {
  document.getElementById('sidebar').style.left = '-250px';
});

// Select Surah from the sidebar
function selectSurah(index) {
  currentSurahIndex = index;
  updatePlayerInfo(surahData[currentSurahIndex]);
  document.getElementById('sidebar').style.left = '-250px';
}
