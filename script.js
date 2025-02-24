console.log("Script.js está cargado correctamente");

const accessToken = "IGAAN1dXSVkHNBZAE14WUxTcy1iR1ktWHNVMzJUNkVGU1JLb2tXRWMwVjF3VVBPUnpSUG9acGdrYm1JZAmtMMUhhTWJIUll0MzBtTzRvRWY2MEtYc1hhaWEzbDltUmlDdmtSWHFvNFhBT0ZAsLVFzbEg3RU1R"; 
const userID = "9302226749870866";  
const instagramFeedURL = `https://graph.instagram.com/${userID}/media?fields=id,media_type,media_url,permalink&access_token=${accessToken}`;

const carousel = document.querySelector(".carousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let index = 0;
let totalImages = 0;

fetch(instagramFeedURL)
    .then(response => response.json())
    .then(data => {
        if (data.data) {
            totalImages = data.data.length;
            data.data.forEach(post => {
                if (post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM") {
                    let img = document.createElement("img");
                    img.src = post.media_url;
                    img.alt = "Instagram Post";
                    img.classList.add("moodboard-img");
                    img.onclick = () => window.open(post.permalink, "_blank");
                    carousel.appendChild(img);
                }
            });

            // Activar el carrusel una vez que las imágenes están en el DOM
            setTimeout(() => {
                activateCarousel();
            }, 500);
        } else {
            carousel.innerHTML = "<p>No se encontraron imágenes.</p>";
        }
    })
    .catch(error => console.error("Error al obtener el feed de Instagram:", error));

// 💡 Función para activar el carrusel con LOOP
function activateCarousel() {
    const images = document.querySelectorAll(".carousel img"); // Obtener todas las imágenes
    totalImages = images.length;

    function updateCarousel() {
        let translateX = -index * 310; // Mover 310px (300px imagen + 10px gap)
        carousel.style.transition = "transform 0.5s ease-in-out"; // Agregar una animación suave
        carousel.style.transform = `translateX(${translateX}px)`;
    }

    nextBtn.addEventListener("click", () => {
        index++;
        if (index >= totalImages - 2) { // Cuando llega al final, vuelve al inicio
            index = 0;
            setTimeout(() => {
                carousel.style.transition = "none"; // Desactiva la animación para el salto
                carousel.style.transform = `translateX(0px)`;
            }, 500);
        }
        updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
        index--;
        if (index < 0) { // Cuando llega al inicio, vuelve al final
            index = totalImages - 3;
            setTimeout(() => {
                carousel.style.transition = "none"; // Desactiva la animación para el salto
                let translateX = -index * 310;
                carousel.style.transform = `translateX(${translateX}px)`;
            }, 500);
        }
        updateCarousel();
    });
}
