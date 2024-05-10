const modalContent = document.querySelector(".modal-content");
const modalOverlay = document.querySelector(".modal-overlay");

if (!modalOverlay) {
  console.error("Modal overlay not found.");
} else {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// Function to update songs list in the modal
const updateSongsList = (songs, modalContent) => {
  const songsList = document.createElement("ul");
  songs.forEach((song) => {
    const songItem = document.createElement("li");
    songItem.innerHTML = `
            <img src="${song.cover_art}" alt="${song.title} Cover" class="song-cover">
            <div class="song-info">
                <span class="song-title">${song.title}</span>
                <span class="song-artist">${song.artist}</span>
                <span class="song-album">${song.album}</span>
                <span class="song-duration">${song.duration}</span>
            </div>
        `;
    songsList.appendChild(songItem);
  });

  const existingSongsList = modalContent.querySelector(".modal-body ul");
  if (existingSongsList) {
    modalContent
      .querySelector(".modal-body")
      .replaceChild(songsList, existingSongsList);
  } else {
    modalContent.querySelector(".modal-body").appendChild(songsList);
  }
};

// Function to display a random playlist on the Featured page
const displayRandomPlaylist = () => {
  const randomIndex = Math.floor(Math.random() * data.playlists.length);
  const playlist = data.playlists[randomIndex];

  const imageContainer = document.querySelector(".playlist-image");
  const nameContainer = document.querySelector(".playlist-name");

  if (!imageContainer || !nameContainer) {
    console.error("Required DOM elements are missing.");
    return; // Stop execution if elements are not found
  }

  imageContainer.innerHTML = `<img src="${playlist.playlist_art}" alt="Playlist Cover">`;
  nameContainer.textContent = playlist.playlist_name;

  const songList = document.querySelector(".song-list");
  songList.innerHTML = "";
  playlist.songs.forEach((song) => {
    const songItem = document.createElement("li");
    songItem.classList.add("song-item");
    songItem.innerHTML = `
          <img src="${song.cover_art}" alt="${song.title} Cover" class="song-cover">
          <div class="song-info">
              <span class="song-title">${song.title}</span>
              <span class="song-artist">${song.artist}</span>
              <span class="song-album">${song.album}</span>
              <span class="song-duration">${song.duration}</span>
          </div>
      `;
    songList.appendChild(songItem);
  });
};

// Event listener for clicks on the modal overlay to close the modal
// modalOverlay.addEventListener("click", (e) => {
//   if (e.target === modalOverlay) {
//     modalOverlay.classList.remove("active");
//     document.body.style.overflow = "";
//   }
// });

// Function to populate modal content with playlist details
const populateModalContent = (playlist) => {
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  modalHeader.innerHTML = `
        <img src="${playlist.playlist_art}" alt="Playlist Cover" class="playlist-cover">
        <div class="playlist-info">
            <h3 class="playlist-title">${playlist.playlist_name}</h3>
            <p class="creator-name">Created by ${playlist.playlist_creator}</p>
        </div>
    `;
  const shuffleButton = document.createElement("button");
  shuffleButton.innerText = "Shuffle";
  shuffleButton.addEventListener("click", () => {
    shuffleArray(playlist.songs);
    updateSongsList(playlist.songs, modalContent);
  });
  modalHeader.appendChild(shuffleButton);
  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  modalContent.innerHTML = "";
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  updateSongsList(playlist.songs, modalContent);
};

// Event listeners for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  displayRandomPlaylist();
  const playlistCardsContainer = document.querySelector(".playlist-cards");
  if (typeof data === "undefined") {
    console.error("Data is not defined.");
    return;
  }
  data.playlists.forEach((playlist) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-playlist-id", playlist.playlistID.toString());
    card.innerHTML = `
            <img src="${playlist.playlist_art}" alt="Playlist Cover" class="playlist-cover">
            <div class="card-content">
                <h3 class="playlist-title">${playlist.playlist_name}</h3>
                <p class="creator-name">Created by ${playlist.playlist_creator}</p>
                <div class="card-stats">
                    <input type="checkbox" id="like-${playlist.playlistID}" class="like-checkbox" aria-label="Like this playlist" />
                    <label for="like-${playlist.playlistID}" class="heart-icon">♡</label>
                    <span class="like-count">${playlist.likeCount}</span>
                </div>
            </div>
        `;
    playlistCardsContainer.appendChild(card);
  });
  attachLikeEventListeners();
  attachCardClickEventListeners();
});

// Function to attach event listeners for card clicks
const attachCardClickEventListeners = () => {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const playlistId = parseInt(card.getAttribute("data-playlist-id"));
      const playlist = data.playlists.find((p) => p.playlistID === playlistId);
      if (!playlist) return;
      populateModalContent(playlist);
      modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });
};

// Function to attach event listeners for like functionality
const attachLikeEventListeners = () => {
  document.querySelectorAll(".heart-icon").forEach((icon) => {
    icon.addEventListener("click", (event) => event.stopPropagation());
  });
  document.querySelectorAll(".like-checkbox").forEach((checkbox) => {
    const likeCountElement = checkbox.nextElementSibling.nextElementSibling;
    checkbox.addEventListener("change", () => {
      let likeCount = parseInt(likeCountElement.textContent);
      likeCount = checkbox.checked ? likeCount + 1 : Math.max(likeCount - 1, 0);
      likeCountElement.textContent = likeCount;
    });
  });
};
