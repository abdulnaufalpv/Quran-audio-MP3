// Initialize audio elements and controls
document.addEventListener('DOMContentLoaded', function() {
    const audioElement = new Audio('surah.mp3');
    const playStopButton = document.getElementById('play-stop-btn');
    const muteButton = document.getElementById('mute-btn');
    const repeatButton = document.getElementById('repeat-btn');
    const jump10Button = document.getElementById('jump-10-btn');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const jumpBack10Button = document.getElementById('jump-back-10-btn');
    const autoPlayButton = document.getElementById('auto-play-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeElement = document.getElementById('current-time');
    const totalTimeElement = document.getElementById('total-time');

    // Toggle play/pause of the audio
    playStopButton.addEventListener('click', function() {
        if (audioElement.paused) {
            audioElement.play();
            playStopButton.innerHTML = '⏸️';  // Change to pause icon
        } else {
            audioElement.pause();
            playStopButton.innerHTML = '▶️';  // Change to play icon
        }
    });

    // Mute/unmute audio
    muteButton.addEventListener('click', function() {
        audioElement.muted = !audioElement.muted;
        muteButton.innerHTML = audioElement.muted ? '🔊' : '🔕';
    });

    // Update progress bar and time
    audioElement.addEventListener('timeupdate', function() {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        progressBar.value = progress;
        currentTimeElement.textContent = formatTime(audioElement.currentTime);
        totalTimeElement.textContent = formatTime(audioElement.duration);
    });

    // Utility function to format time (MM:SS)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
});
