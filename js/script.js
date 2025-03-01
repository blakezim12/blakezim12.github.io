document.addEventListener('DOMContentLoaded', function () {
  window.checkPassword = function() {

    const correctPassword = "Dreamstate"; // Set your password here
    let userInput;

    while (true) {
      userInput = prompt("Enter the password:");

      if (userInput === correctPassword) {
        document.querySelector(".container").style.display = "flex"; // Redirect on success
        break;
      } else if (userInput === null) {
        alert("Access denied! Closing page.");
        window.close(); // Close the page if the user cancels
        break;
      } else {
        alert("Incorrect password. Try again.");
      }
    }
  }

  // Audio Player Logic
  let currentAudio = null; // Track currently playing audio
  let isPlaying = false;
  let currentTrackIndex = 0; // Track the current track index

  const tracks = [
    { id: "audio1", title: "PolyFuck", version: "Full Track" },
    { id: "audio2", title: "PolyFuck", version: "Vocals" },
    { id: "audio3", title: "PolyFuck", version: "Instrumental" },
    { id: "audio4", title: "Hey You", version: "Full Track" },
    { id: "audio5", title: "Hey You", version: "Vocals" },
    { id: "audio6", title: "Hey You", version: "Instrumental" },
    { id: "audio7", title: "Hello, comment vas-tu?", version: "Full Track" },
    { id: "audio8", title: "Hello, comment vas-tu?", version: "Vocals" },
    { id: "audio9", title: "Hello, comment vas-tu?", version: "Instrumental" },
  ];

  // Update the playAudio function
  function playAudio(audioId) {
    const newAudio = document.getElementById(audioId);
    const trackInfo = tracks.find((track) => track.id === audioId);

    if (!newAudio || !trackInfo) {
      console.error('Audio or track info not found');
      return;
    }

    if (currentAudio && currentAudio !== newAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    currentAudio = newAudio;
    isPlaying = true;
    newAudio.play();

    // Update play button icon
    const playPauseIcon = document.querySelector("#playPauseBtn i");
    if (playPauseIcon) {
      playPauseIcon.classList.remove("fa-play");
      playPauseIcon.classList.add("fa-pause");
    }

    // Show audio controls with fade in
    const audioControls = document.querySelector(".audio-controls");
    if (audioControls) {
      audioControls.style.display = "block";
      setTimeout(() => {
        audioControls.style.opacity = "1";
      }, 10);
    }

    // Remove text update code and keep only progress update
    newAudio.addEventListener("timeupdate", updateProgress);
    newAudio.addEventListener("ended", handleTrackEnd);
  }

  // Update the updateProgress function
  function updateProgress() {
    if (currentAudio && !currentAudio.paused) {
      const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
      const progressCircle = document.querySelector('.progress-circle');
      if (progressCircle) {
        progressCircle.style.setProperty('--progress', `${progress}%`);
      }
      requestAnimationFrame(updateProgress);
    }
  }

  // Toggle play/pause
  function togglePlayPause() {
    if (currentAudio) {
      const playPauseIcon = document.querySelector("#playPauseBtn i");
      if (isPlaying) {
        currentAudio.pause();
        playPauseIcon.classList.remove("fa-pause");
        playPauseIcon.classList.add("fa-play");
      } else {
        currentAudio.play();
        playPauseIcon.classList.remove("fa-play");
        playPauseIcon.classList.add("fa-pause");
      }
      isPlaying = !isPlaying;
    }
  }

  // Seek to a specific position in the track
  function seekAudio(event) {
    if (currentAudio) {
      const progressContainer = document.querySelector(".progress-container");
      const rect = progressContainer.getBoundingClientRect();
      const clickPosition = (event.clientX - rect.left) / rect.width;
      currentAudio.currentTime = currentAudio.duration * clickPosition;
    }
  }

  // Attach event listeners to audio controls
  document.querySelectorAll(".listitem").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior
      const audioId = link.getAttribute("data-audio-id");
      playAudio(audioId);
    });
  });

  document.querySelectorAll(".listitem").forEach((link) => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const audioId = this.dataset.audioId;
      currentTrackIndex = tracks.findIndex(track => track.id === audioId);
      playAudio(audioId);
    });
  });

  document
    .querySelector("#playPauseBtn")
    .addEventListener("click", togglePlayPause);

  // Add close button handler after your existing event listeners
  document.querySelector('.close-btn').addEventListener('click', function() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      // Remove event listeners to prevent memory leaks
      currentAudio.removeEventListener("timeupdate", updateProgress);
      currentAudio.removeEventListener("ended", handleTrackEnd);
      currentAudio = null;
      isPlaying = false;
      
      // Reset play button icon
      const playPauseIcon = document.querySelector("#playPauseBtn i");
      playPauseIcon.classList.remove("fa-pause");
      playPauseIcon.classList.add("fa-play");
    }
    
    // Fade out and hide audio controls
    const audioControls = document.querySelector('.audio-controls');
    audioControls.style.opacity = '0';
    setTimeout(() => {
      audioControls.style.display = 'none';
    }, 300);
  });

  // Add ended event handler
  function handleTrackEnd() {
    isPlaying = false;
    document.querySelector("#playPauseBtn i").classList.remove("fa-pause");
    document.querySelector("#playPauseBtn i").classList.add("fa-play");
    
    // Hide audio controls when track ends
    const audioControls = document.querySelector('.audio-controls');
    audioControls.style.opacity = '0';
    setTimeout(() => {
      audioControls.style.display = 'none';
    }, 300);
  }

});