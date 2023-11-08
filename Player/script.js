const now_playing = document.querySelector(".now-playing");
const track_art = document.querySelector(".track-art");
const track_name = document.querySelector(".track-name");
const track_artist = document.querySelector(".track-artist");

const playing_btn = document.querySelector(".playpause-track");
const next_btn = document.querySelector(".next-track");
const prev_btn = document.querySelector(".prev-track");

const seek_slider = document.querySelector(".seek_slider");
const volume_slider = document.querySelector(".volume_slider");
const curr_time = document.querySelector(".current-time");
const total_duration = document.querySelector(".total-duration");
const wave = document.getElementById("wave");
const randomIcon = document.querySelector(".fa-random");
const playlistButton = document.getElementById("playlistBtn");
const playlist = document.querySelector(".playlist");

const curr_track = document.createElement("audio");

const canvas = document.getElementById("music-wave");
const ctx = canvas.getContext("2d");

const columnsGap = 2;
const columnCount = 64;

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let source = audioCtx.createMediaElementSource(curr_track);
let analyser = audioCtx.createAnalyser();
analyser.fftSize = columnCount;
source.connect(analyser);
analyser.connect(audioCtx.destination);
let frequenceData = new Uint8Array(analyser.frequencyBinCount);

function drawColumn(x, width, height) {
  const gradient = ctx.createLinearGradient(
    0,
    canvas.height - height / 2,
    0,
    canvas.height
  );
  gradient.addColorStop(1, "rgba(255,255,255, 1)");
  gradient.addColorStop(0.9, "rgba(255,255,255,0.6)");
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, canvas.height - height / 2, width, height);
}

function render() {
  analyser.getByteFrequencyData(frequenceData);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const columnWidth =
    canvas.width / frequenceData.length -
    columnsGap +
    columnsGap / frequenceData.length;

  const heightScale = canvas.height / 100;

  let xPos = 0;
  for (let i = 0; i < frequenceData.length; i++) {
    let columnHeight = frequenceData[i] * heightScale;
    drawColumn(xPos, columnWidth, columnHeight / 2);

    xPos += columnWidth + columnsGap;
  }

  window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
  {
    img: "images/artworks.jpg",
    name: "Sister Of Pearl",
    artist: "Baio",
    music: "audio/Sister Of Pearl.mp3",
  },
  {
    img: "images/stay.png",
    name: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    music: "audio/stay.mp3",
  },
  {
    img: "images/fallingdown.jpg",
    name: "Falling Down",
    artist: "Wid Cards",
    music: "audio/fallingdown.mp3",
  },
  {
    img: "images/faded.png",
    name: "Faded",
    artist: "Alan Walker",
    music: "audio/Faded.mp3",
  },
  {
    img: "images/ratherbe.jpg",
    name: "Rather Be",
    artist: "Clean Bandit",
    music: "audio/Rather Be.mp3",
  },
];

displayPlaylist();

function displayPlaylist() {
  const playlistElement = document.querySelector(".playlist");
  playlistElement.innerHTML = "";

  music_list.forEach((track, index) => {
    const trackElement = document.createElement("div");
    trackElement.classList.add("playlist-item");
    trackElement.innerHTML = `
      <img src="${track.img}" alt="${track.name}">
      <div class="track-info">
        <div class="track-name-small">${track.name}</div>
        <div class="track-artist-small">${track.artist}</div>
      </div>
    `;

    trackElement.addEventListener("click", () => {
      loadTrack(index);
      playTrack();
      highlightActiveTrack(index);
      track_index = index;
    });

    playlistElement.appendChild(trackElement);
  });
}

playlistButton.addEventListener("click", togglePlaylist);

function togglePlaylist() {
  playlist.classList.toggle("activePlaylist");
  playlistButton.classList.toggle("activeBtn");
}

loadTrack(track_index);

function loadTrack(track_index) {
  clearInterval(updateTimer);
  reset();

  curr_track.src = music_list[track_index].music;
  curr_track.load();

  track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
  track_name.textContent = music_list[track_index].name;
  track_artist.textContent = music_list[track_index].artist;
  now_playing.textContent =
    "Playing music " + (track_index + 1) + " of " + music_list.length;

  updateTimer = setInterval(setUpdate, 1000);

  curr_track.addEventListener("ended", nextTrack);
  random_bg_color();
  highlightActiveTrack(track_index);
}

function highlightActiveTrack(activeIndex) {
  const playlistItems = document.querySelectorAll(".playlist-item");

  playlistItems.forEach((item, index) => {
    if (index === activeIndex) {
      item.classList.add("activeTrack");
    } else {
      item.classList.remove("activeTrack");
    }
  });
}

function random_bg_color() {
  let hex = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
  ];
  let a;

  function populate(a) {
    for (let i = 0; i < 6; i++) {
      let x = Math.round(Math.random() * 14);
      let y = hex[x];
      a += y;
    }
    return a;
  }
  let Color1 = populate("#");
  let Color2 = populate("#");
  let angle = "to right";

  let gradient = "linear-gradient(" + angle + "," + Color1 + "," + Color2 + ")";
  document.body.style.background = gradient;
}

function reset() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
  isRandom = true;
  randomIcon.classList.add("randomActive");
}

function pauseRandom() {
  isRandom = false;
  randomIcon.classList.remove("randomActive");
}

function repeatTrack() {
  let current_index = track_index;
  loadTrack(current_index);
  playTrack();
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  track_art.classList.add("rotate");
  // wave.classList.add("loader");
  playing_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  track_art.classList.remove("rotate");
  // wave.classList.remove("loader");
  playing_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  if (track_index < music_list.length - 1 && isRandom === false) {
    track_index += 1;
  } else if (track_index < music_list.length - 1 && isRandom === true) {
    let random_index = Number.parseInt(Math.random() * music_list.length);
    track_index = random_index;
  } else {
    track_index = 0;
  }
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0) {
    track_index -= 1;
  } else {
    track_index = music_list.length - 1;
  }
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  let seekTo = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekTo;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function setUpdate() {
  let seekPosition = 0;
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(
      curr_track.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}
