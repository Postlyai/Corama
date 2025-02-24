// script.js
console.log("Script.js está cargado correctamente");
    ;

const accessToken = "IGAAN1dXSVkHNBZAE14WUxTcy1iR1ktWHNVMzJUNkVGU1JLb2tXRWMwVjF3VVBPUnpSUG9acGdrYm1JZAmtMMUhhTWJIUll0MzBtTzRvRWY2MEtYc1hhaWEzbDltUmlDdmtSWHFvNFhBT0ZAsLVFzbEg3RU1R"; 
const userID = "9302226749870866";  

const instagramFeedURL = `https://graph.instagram.com/${userID}/media?fields=id,media_type,media_url,permalink&access_token=${accessToken}`;

document.addEventListener("DOMContentLoaded", function () {
    fetch(instagramFeedURL)
        .then(response => response.json())
        .then(data => {
            let moodboardContainer = document.querySelector(".insta-feed");

            if (data.data) {
                data.data.forEach(post => {
                    if (post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM") {
                        let img = document.createElement("img");
                        img.src = post.media_url;
                        img.alt = "Instagram Post";
                        img.classList.add("moodboard-img");
                        img.onclick = () => window.open(post.permalink, "_blank");
                        moodboardContainer.appendChild(img);
                    }
                });
            } else {
                moodboardContainer.innerHTML = "<p>No se encontraron imágenes.</p>";
            }
        })
        .catch(error => console.error("Error al obtener el feed de Instagram:", error));
});

