let playlist = [];
let current = 0;
let lastPlaylist = "";

const img = document.getElementById("imageViewer");
const video = document.getElementById("videoViewer");

// Cargar playlist inicial
loadPlaylist(true);

// Revisar cambios cada 15 segundos
setInterval(checkPlaylist, 15000);

async function loadPlaylist(firstLoad = false) {

    try {

        const response = await fetch("playlist.json?t=" + Date.now());

        const text = await response.text();

        if (text === lastPlaylist) return;

        lastPlaylist = text;

        playlist = JSON.parse(text);

        console.log("Playlist actualizada");

        if (firstLoad) {
            current = 0;
            playItem();
        }

    } catch (e) {

        console.error("Error cargando playlist:", e);

    }

}

async function checkPlaylist() {

    try {

        const response = await fetch("playlist.json?t=" + Date.now());

        const text = await response.text();

        if (text !== lastPlaylist) {

            console.log("Se detectó una nueva playlist");

            lastPlaylist = text;

            playlist = JSON.parse(text);

        }

    } catch (e) {

        console.log(e);

    }

}

function playItem() {

    if (playlist.length === 0) return;

    if (current >= playlist.length) {
        current = 0;
    }

    const item = playlist[current];

    img.style.display = "none";
    video.style.display = "none";

    video.pause();
    video.removeAttribute("src");
    video.load();

    // ---------------- IMAGEN ----------------

    if (item.type === "image") {

        img.src = item.file;
        img.style.display = "block";

        img.onload = () => {

            setTimeout(next, (item.duration || 10) * 1000);

        };

        img.onerror = () => {

            console.log("Error imagen:", item.file);

            next();

        };

    }

    // ---------------- VIDEO ----------------

    else if (item.type === "video") {

        video.style.display = "block";

        video.src = item.file;

        video.autoplay = true;
        video.controls = false;
        video.loop = false;
        video.playsInline = true;
        video.preload = "auto";

        video.muted = false;
        video.defaultMuted = false;
        video.volume = 1;

        video.load();

        video.oncanplay = () => {

            video.play().catch(err => {

                console.log("Error play:", err);

                next();

            });

        };

        video.onended = () => {

            next();

        };

        video.onerror = () => {

            console.log("Error video:", item.file);

            next();

        };

    }

}

function next() {

    current++;

    if (current >= playlist.length) {
        current = 0;
    }

    playItem();

}
