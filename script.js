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






// YouTube API Configuration
const YOUTUBE_API_KEY = 'AIzaSyBz2dW7CwsT0GQ5FYKI9USjh9Ei189tjLI'; // Replace with your actual API key
const CHANNEL_ID = 'UCX22pOM_XqEFHB-07gzzIxQ'; // Replace with your actual channel ID
const MAX_RESULTS = 6; // Number of videos to load initially
let nextPageToken = '';

// DOM Elements
const featuredVideo = document.getElementById('featuredVideo');
const featuredTitle = document.getElementById('featuredTitle');
const featuredDate = document.getElementById('featuredDate');
const featuredDescription = document.getElementById('featuredDescription');
const featuredLink = document.getElementById('featuredLink');
const videosGrid = document.getElementById('videosGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const communityGallery = document.getElementById('communityGallery');

// Initialize YouTube Data
document.addEventListener('DOMContentLoaded', () => {
  // Load YouTube scripts
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Load featured and latest videos
  loadYouTubeData();

  // Setup category filters
  setupCategoryFilters();

  // Load fake Instagram data (replace with real Instagram API integration)
  loadCommunityContent();
});

// Load YouTube Channel Data
function loadYouTubeData() {
  // Fetch channel videos
  fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`)
    .then(response => response.json())
    .then(data => {
      // Save next page token for pagination
      nextPageToken = data.nextPageToken || '';
      
      // Handle empty results
      if (!data.items || data.items.length === 0) {
        videosGrid.innerHTML = '<p class="placeholder-text">No se encontraron videos. ¡Vuelve pronto!</p>';
        return;
      }
      
      // Set featured video (most recent)
      const featuredVideoData = data.items[0];
      setFeaturedVideo(featuredVideoData);
      
      // Load video grid
      videosGrid.innerHTML = ''; // Clear loading spinner
      data.items.forEach(video => {
        addVideoToGrid(video);
      });
      
      // Hide load more button if no more results
      if (!nextPageToken) {
        loadMoreBtn.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error fetching YouTube data:', error);
      videosGrid.innerHTML = '<p class="placeholder-text">Error al cargar videos. Por favor, inténtalo de nuevo más tarde.</p>';
    });
    
  // Setup load more button
  loadMoreBtn.addEventListener('click', loadMoreVideos);
}

// Set Featured Video
function setFeaturedVideo(videoData) {
  const videoId = videoData.id.videoId;
  
  // Set iframe for video
  featuredVideo.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/${videoId}" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;
  
  // Get detailed video info including duration and view count
  fetch(`https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=snippet,contentDetails,statistics`)
    .then(response => response.json())
    .then(data => {
      const videoDetails = data.items[0];
      const snippet = videoDetails.snippet;
      
      // Format date
      const publishedDate = new Date(snippet.publishedAt);
      const formattedDate = publishedDate.toLocaleDateString('es-ES', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      });
      
      // Set video details
      featuredTitle.textContent = snippet.title;
      featuredDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate}`;
      featuredDescription.textContent = snippet.description.split('\n')[0]; // First paragraph only
      featuredLink.href = `https://www.youtube.com/watch?v=${videoId}`;
    })
    .catch(error => {
      console.error('Error fetching video details:', error);
    });
}

// Add Video to Grid
function addVideoToGrid(videoData) {
  const videoId = videoData.id.videoId;
  const snippet = videoData.snippet;
  
  // Format date
  const publishedDate = new Date(snippet.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString('es-ES', {
    day: 'numeric', 
    month: 'short', 
    year: 'numeric'
  });
  
  // Create video card
  const videoCard = document.createElement('div');
  videoCard.className = 'video-card';
  videoCard.setAttribute('data-video-id', videoId);
  
  // Add category as a data attribute if available in snippet
  if (snippet.categoryId) {
    videoCard.setAttribute('data-category', snippet.categoryId);
  } else {
    // Default category or extract from title/description
    const categories = ['tutorial', 'review', 'gameplay', 'news'];
    const lowerTitle = snippet.title.toLowerCase();
    
    let detectedCategory = 'all';
    for (const category of categories) {
      if (lowerTitle.includes(category)) {
        detectedCategory = category;
        break;
      }
    }
    
    videoCard.setAttribute('data-category', detectedCategory);
  }
  
  videoCard.innerHTML = `
    <div class="video-thumbnail">
      <img src="${snippet.thumbnails.high.url}" alt="${snippet.title}">
      <div class="play-button">
        <i class="fas fa-play"></i>
      </div>
    </div>
    <div class="video-info">
      <h3>${snippet.title}</h3>
      <div class="video-meta">
        <span class="video-date-small"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
        <span class="video-views"><i class="far fa-eye"></i> Cargando...</span>
      </div>
      <a href="https://www.youtube.com/watch?v=${videoId}" class="btn btn-outline" target="_blank">Ver Tutorial</a>
    </div>
  `;
  
  videosGrid.appendChild(videoCard);
  
  // Add click event to thumbnail for embedded playback
  const thumbnail = videoCard.querySelector('.video-thumbnail');
  thumbnail.addEventListener('click', () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  });
  
  // Get view count and set it
  fetch(`https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=statistics`)
    .then(response => response.json())
    .then(data => {
      const statistics = data.items[0].statistics;
      const viewCount = parseInt(statistics.viewCount);
      const formattedViews = formatViewCount(viewCount);
      
      const viewsElement = videoCard.querySelector('.video-views');
      viewsElement.innerHTML = `<i class="far fa-eye"></i> ${formattedViews}`;
    })
    .catch(error => {
      console.error('Error fetching video statistics:', error);
    });
}

// Load More Videos
function loadMoreVideos() {
  if (!nextPageToken) return;
  
  // Show loading state on button
  loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
  loadMoreBtn.disabled = true;
  
  // Fetch next page of videos
  fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}&pageToken=${nextPageToken}`)
    .then(response => response.json())
    .then(data => {
      // Save next page token
      nextPageToken = data.nextPageToken || '';
      
      // Add videos to grid
      data.items.forEach(video => {
        addVideoToGrid(video);
      });
      
      // Reset button state
      loadMoreBtn.innerHTML = 'Cargar Más';
      loadMoreBtn.disabled = false;
      
      // Hide button if no more results
      if (!nextPageToken) {
        loadMoreBtn.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error fetching more videos:', error);
      loadMoreBtn.innerHTML = 'Intentar de nuevo';
      loadMoreBtn.disabled = false;
    });
}

// Format View Count
function formatViewCount(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  } else {
    return views.toString();
  }
}

// Setup Category Filters
function setupCategoryFilters() {
  const categoryButtons = document.querySelectorAll('.btn[data-category]');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const category = button.getAttribute('data-category');
      
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Show/hide videos based on category
      filterVideosByCategory(category);
    });
  });
}

// Filter Videos by Category
function filterVideosByCategory(category) {
  const videoCards = document.querySelectorAll('.video-card');
  
  // Handle 'all' category
  if (category === 'all') {
    videoCards.forEach(card => {
      card.style.display = 'block';
    });
    return;
  }
  
  // Filter by specific category
  videoCards.forEach(card => {
    const videoCategory = card.getAttribute('data-category');
    
    if (videoCategory === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
  
  // Hide "Load More" if no videos are visible
  const visibleVideos = document.querySelectorAll('.video-card[style="display: block"]');
  if (visibleVideos.length === 0) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

// Load Community Content (Instagram-like gallery)
function loadCommunityContent() {
  // This is a placeholder for Instagram API integration
  // For now, using fake data
  const communityPosts = [
    {
      id: 'post1',
      imageUrl: 'images/community/community-1.jpg',
      username: 'user1',
      likes: 124,
      comments: 12,
      caption: '¡Increíble experiencia aprendiendo con estos tutoriales!',
      date: '2 días'
    },
    {
      id: 'post2',
      imageUrl: 'images/community/community-2.jpg',
      username: 'user2',
      likes: 89,
      comments: 5,
      caption: 'Mi proyecto terminado gracias a los videos del canal',
      date: '3 días'
    },
    {
      id: 'post3',
      imageUrl: 'images/community/community-3.jpg',
      username: 'user3',
      likes: 210,
      comments: 18,
      caption: 'Aprendiendo nuevas técnicas cada día',
      date: '1 semana'
    },
    {
      id: 'post4',
      imageUrl: 'images/community/community-4.jpg',
      username: 'user4',
      likes: 56,
      comments: 3,
      caption: 'Compartiendo mi progreso',
      date: '2 semanas'
    }
  ];
  
  // Clear gallery
  communityGallery.innerHTML = '';
  
  // Add posts to gallery
  communityPosts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'community-post';
    
    postElement.innerHTML = `
      <div class="community-post-img">
        <img src="${post.imageUrl}" alt="Community post by ${post.username}">
      </div>
      <div class="community-post-info">
        <div class="community-post-header">
          <span class="community-username">@${post.username}</span>
          <span class="community-date">${post.date}</span>
        </div>
        <div class="community-post-caption">${post.caption}</div>
        <div class="community-post-stats">
          <span><i class="fas fa-heart"></i> ${post.likes}</span>
          <span><i class="fas fa-comment"></i> ${post.comments}</span>
        </div>
      </div>
    `;
    
    communityGallery.appendChild(postElement);
    
    // Add click event to open Instagram post in new tab
    postElement.addEventListener('click', () => {
      // In real implementation, this would link to the actual Instagram post
      alert('Esta función conectará con Instagram en la implementación final');
    });
  });
}

// Helper function to dynamically load YouTube search results by query
function searchYouTubeChannel(query) {
  // Clear current videos
  videosGrid.innerHTML = '<p class="placeholder-text"><i class="fas fa-spinner fa-spin"></i> Buscando videos...</p>';
  
  // Build search URL
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=relevance&maxResults=${MAX_RESULTS}&q=${encodeURIComponent(query)}`;
  
  // Execute search
  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      // Save next page token for pagination
      nextPageToken = data.nextPageToken || '';
      
      // Handle empty results
      if (!data.items || data.items.length === 0) {
        videosGrid.innerHTML = '<p class="placeholder-text">No se encontraron resultados para tu búsqueda.</p>';
        loadMoreBtn.style.display = 'none';
        return;
      }
      
      // Load video grid
      videosGrid.innerHTML = ''; // Clear loading spinner
      data.items.forEach(video => {
        addVideoToGrid(video);
      });
      
      // Show/hide load more button
      if (!nextPageToken) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error searching YouTube:', error);
      videosGrid.innerHTML = '<p class="placeholder-text">Error al buscar videos. Por favor, inténtalo de nuevo.</p>';
    });
}

// Initialize search functionality
function initializeSearch() {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      
      if (query) {
        searchYouTubeChannel(query);
      }
    });
  }
}

// Call initializeSearch on DOM load
document.addEventListener('DOMContentLoaded', initializeSearch);