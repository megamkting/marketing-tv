let playlist = [];
let current = 0;

const viewer = document.getElementById("viewer");

fetch("playlist.json")
    .then(response => response.json())
    .then(data => {
        playlist = data;

        if (playlist.length > 0) {
            playItem();
        }
    })
    .catch(error => {
        console.error("Error cargando playlist:", error);
    });

function playItem() {

    viewer.innerHTML = "";

    const item = playlist[current];

    if (!item) return;

    // ---------------- IMAGEN ----------------

    if (item.type === "image") {

        const img = document.createElement("img");

        img.src = item.file;

        img.onload = () => {
            setTimeout(next, (item.duration || 10) * 1000);
        };

        img.onerror = () => {
            console.log("No se pudo cargar:", item.file);
            next();
        };

        viewer.appendChild(img);

    }

    // ---------------- VIDEO ----------------

    else if (item.type === "video") {

    const video = document.createElement("video");

    video.src = item.file;
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.controls = false;
    video.loop = false;
    video.playsInline = true;

    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "contain";

    viewer.appendChild(video);

    video.play().then(() => {
        console.log("Video reproduciéndose");
    }).catch(err => {
        console.log("Autoplay bloqueado", err);
    });

    video.onended = () => {
        next();
    };

}

function next() {

    current++;

    if (current >= playlist.length) {
        current = 0;
    }

    playItem();

}
