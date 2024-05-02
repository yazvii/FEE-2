const accessKey = 'mkJQzmgYL2zHgdrXILvewx4G-anZzqDSib_U3yZ06Ro';
        const apiUrl = 'https://api.unsplash.com/';
        const perPage = 12;

        const searchContainer = document.getElementById('searchContainer');
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const searchResults = document.getElementById('searchResults');
        const trendingTopics = document.getElementById('trendingTopics');
        const trendingTopicsList = document.getElementById('trendingTopicsList');
        const randomImagesContainer = document.getElementById('randomImagesContainer');
        const randomImages = document.getElementById('randomImages');
        const previewModal = document.getElementById('imagePreviewModal');
        const previewImage = document.getElementById('previewImage');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const backButton = document.getElementById('backButton');

        searchButton.addEventListener('click', () => {
            searchImages();
        });

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                searchImages();
            }
        });

        fetchTrendingTopics();
        fetchRandomImages();

        async function fetchRandomImages() {
            try {
                const response = await fetch(`${apiUrl}photos/random?count=${perPage}&client_id=${accessKey}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch random images');
                }
                const data = await response.json();

                if (data.length > 0) {
                    randomImagesContainer.classList.remove('hidden');
                }

                randomImages.innerHTML = '';

                data.forEach(result => {
                    const imageCard = `
                    <div class="image-card bg-white rounded-lg shadow-md overflow-hidden">
                        <img src="${result.urls.regular}" alt="${result.alt_description || 'Unsplash Image'}"
                            class="w-full h-48 object-cover cursor-pointer">
                        <div class="p-4">
                            <h2 class="text-lg font-semibold mb-2">${result.alt_description || 'Image'}</h2>
                            <p class="text-gray-600">Photo by ${result.user.name}</p>
                            <a href="${result.links.download}" target="_blank"
                                class="mt-4 block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Download</a>
                        </div>
                    </div>
                `;
                    randomImages.insertAdjacentHTML('beforeend', imageCard);
                });

                // Add event listeners for image click and close modal button
                document.querySelectorAll('.image-card img').forEach(img => {
                    img.addEventListener('click', () => openPreviewModal(img.src));
                });
                closeModalBtn.addEventListener('click', closePreviewModal);

            } catch (error) {
                console.error('Error fetching random images:', error.message);
            }
        }

        async function fetchTrendingTopics() {
            try {
                const response = await fetch(`${apiUrl}topics?client_id=${accessKey}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch trending topics');
                }
                const data = await response.json();

                trendingTopicsList.innerHTML = '';

                data.forEach(topic => {
                    const topicItem = document.createElement('li');
                    topicItem.classList.add('mb-2');
                    topicItem.innerHTML = `
                        <button class="trending-topic-btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">${topic.title}</button>
                    `;
                    topicItem.querySelector('button').addEventListener('click', () => {
                        searchInput.value = topic.title;
                        searchImages();
                    });
                    trendingTopicsList.appendChild(topicItem);
                });

            } catch (error) {
                console.error('Error fetching trending topics:', error.message);
            }
        }

        async function searchImages() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm === '') {
                // If there's no search term, show the trending topics and random images
                trendingTopics.style.display = 'block';
                randomImagesContainer.style.display = 'block';
                backButton.style.display = 'none'; // Hide back button
                fetchTrendingTopics();
                fetchRandomImages();
                return;
            }

            // Hide the trending topics and random images when there's a search term
            trendingTopics.style.display = 'none';
            randomImagesContainer.style.display = 'none';
            backButton.style.display = 'block'; // Show back button

            try {
                const response = await fetch(`${apiUrl}search/photos?query=${searchTerm}&per_page=${perPage}&client_id=${accessKey}`);
                if (!response.ok) {
                    throw new Error('Failed to search images');
                }
                const data = await response.json();

                searchResults.innerHTML = '';
                data.results.forEach(result => {
                    const imageCard = `
                        <div class="image-card bg-white rounded-lg shadow-md overflow-hidden">
                            <img src="${result.urls.regular}" alt="${result.alt_description || 'Unsplash Image'}"
                                class="w-full h-48 object-cover cursor-pointer">
                            <div class="p-4">
                                <h2 class="text-lg font-semibold mb-2">${result.alt_description || 'Image'}</h2>
                                <p class="text-gray-600">Photo by ${result.user.name}</p>
                                <a href="${result.links.download}" target="_blank"
                                    class="mt-4 block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Download</a>
                            </div>
                        </div>
                    `;
                    searchResults.insertAdjacentHTML('beforeend', imageCard);
                });

                document.querySelectorAll('.image-card img').forEach(img => {
                    img.addEventListener('click', () => openPreviewModal(img.src));
                });
                closeModalBtn.addEventListener('click', closePreviewModal);

            } catch (error) {
                console.error('Error searching images:', error.message);
            }
        }

        function openPreviewModal(imageUrl) {
            previewModal.classList.remove('hidden');
        
            previewImage.style.width = 'auto';
            previewImage.style.height = 'auto';
        
            previewImage.src = imageUrl;
        
            previewImage.onload = function() {
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;
                const imageWidth = previewImage.width;
                const imageHeight = previewImage.height;
                const aspectRatio = imageWidth / imageHeight;
        
                const maxHeight = viewportHeight * 0.8; 
                const maxWidth = viewportWidth * 0.8; 
        
                if (aspectRatio > 1) {
                    // Landscape or square image
                    if (imageWidth > maxWidth) {
                        previewImage.style.width = `${maxWidth}px`;
                        previewImage.style.height = 'auto'; 
                    }
                } else {
                    // Portrait image
                    if (imageHeight > maxHeight) {
                        previewImage.style.height = `${maxHeight}px`;
                        previewImage.style.width = 'auto'; 
                    }
                }
            };
        }
        
        
        
        
        
        

        function closePreviewModal() {
            previewModal.classList.add('hidden');
        }

        // Add event listener to the back button
        backButton.addEventListener('click', () => {
            // Show the trending topics and random images
            trendingTopics.style.display = 'block';
            randomImagesContainer.style.display = 'block';
            // Hide the search results section
            searchResults.innerHTML = '';
            // Hide the back button
            backButton.style.display = 'none';
            // Clear the search input
            searchInput.value = '';
            // Fetch trending topics
            fetchTrendingTopics();
            // Fetch random images
            fetchRandomImages();
        });