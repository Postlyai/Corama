// script.js
console.log("Script.js está cargado correctamente");
    ;

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
            } else {
                carousel.innerHTML = "<p>No se encontraron imágenes.</p>";
            }
        })
        .catch(error => console.error("Error al obtener el feed de Instagram:", error));
    
    // Función para mover el carrusel
    function updateCarousel() {
        let translateX = -index * 310; // Mover 310px (300px imagen + 10px gap)
        carousel.style.transform = `translateX(${translateX}px)`;
    }
    
    // Evento para la flecha derecha
    nextBtn.addEventListener("click", () => {
        if (index < totalImages - 3) {
            index++;
            updateCarousel();
        }
    });
    
    // Evento para la flecha izquierda
    prevBtn.addEventListener("click", () => {
        if (index > 0) {
            index--;
            updateCarousel();
        }
    });
    