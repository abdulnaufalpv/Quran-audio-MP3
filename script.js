'use strict';

let currentSurahIndex = 0;
let isPlaying = false;
let audioPlayer = new Audio();
let progressBar = document.getElementById("progress-bar");
let currentTimeDisplay = document.getElementById("current-time");
let totalTimeDisplay = document.getElementById("total-time");
let musicData = [];
const defaultImage = "https://static.vecteezy.com/system/resources/previews/037/993/568/non_2x/ai-generated-islamic-holy-al-quran-with-arabic-calligraphy-and-tasbih-beads-photo.jpg";
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
    changePlayerInfo(musicData[0]);
  })
  .catch(error => console.error('Error fetching Surah data:', error));

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

function selectSurah(music, index) {
  currentSurahIndex = index;
  changePlayerInfo(music);
}

document.getElementById('play-stop-btn').addEventListener('click', () => {
  isPlaying ? audioPlayer.pause() : audioPlayer.play();
  isPlaying = !isPlaying;
  document.getElementById('play-stop-btn').textContent = isPlaying ? '⏸️' : '▶️';
});

audioPlayer.addEventListener('timeupdate', () => {
  const currentTime = Math.floor(audioPlayer.currentTime);
  const totalTime = Math.floor(audioPlayer.duration);
  progressBar.value = (currentTime / totalTime) * 100;
  currentTimeDisplay.textContent = formatTime(currentTime);
  totalTimeDisplay.textContent = formatTime(totalTime);
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

document.getElementById('menu-toggle').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.left = sidebar.style.left === '0px' ? '-300px' : '0px';
});
