// Homepage Specific JavaScript

// Sample restaurant data
const restaurants = [
    {
        id: 1,
        name: "Pizza Palace",
        cuisine: "Italian",
        rating: 4.5,
        deliveryTime: "25-35 min",
        deliveryFee: "$2.99",
        image: "images/restaurants/pizza-palace.jpg",
        category: "pizza"
    },
    {
        id: 2,
        name: "Burger King",
        cuisine: "American",
        rating: 4.2,
        deliveryTime: "20-30 min",
        deliveryFee: "$1.99",
        image: "images/restaurants/burger-king.jpg",
        category: "burger"
    },
    {
        id: 3,
        name: "Sushi Master",
        cuisine: "Japanese",
        rating: 4.8,
        deliveryTime: "30-40 min",
        deliveryFee: "$3.99",
        image: "images/restaurants/sushi-master.jpg",
        category: "asian"
    },
    {
        id: 4,
        name: "Sweet Dreams",
        cuisine: "Desserts",
        rating: 4.3,
        deliveryTime: "15-25 min",
        deliveryFee: "$1.49",
        image: "images/restaurants/sweet-dreams.jpg",
        category: "dessert"
    },
    {
        id: 5,
        name: "McDonald's",
        cuisine: "Fast Food",
        rating: 4.0,
        deliveryTime: "15-25 min",
        deliveryFee: "$1.99",
        image: "images/restaurants/mcdonalds.jpg",
        category: "fast-food"
    },
    {
        id: 6,
        name: "Green Bowl",
        cuisine: "Healthy",
        rating: 4.6,
        deliveryTime: "20-30 min",
        deliveryFee: "$2.49",
        image: "images/restaurants/green-bowl.jpg",
        category: "healthy"
    }
];

// Load restaurants on page load
document.addEventListener('DOMContentLoaded', function() {
    loadRestaurants();
    initializeSearch();
});

// Load and display restaurants
function loadRestaurants(filteredRestaurants = restaurants) {
    const restaurantsGrid = document.getElementById('restaurantsGrid');
    
    if (!restaurantsGrid) return;
    
    restaurantsGrid.innerHTML = '';
    
    filteredRestaurants.forEach(restaurant => {
        const restaurantCard = createRestaurantCard(restaurant);
        restaurantsGrid.appendChild(restaurantCard);
    });
}

// Create restaurant card element
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.onclick = () => viewRestaurant(restaurant.id);
    
    card.innerHTML = `
        <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image" onerror="this.src='images/placeholder-restaurant.jpg'">
        <div class="restaurant-info">
            <h3 class="restaurant-name">${restaurant.name}</h3>
            <p class="restaurant-cuisine">${restaurant.cuisine}</p>
            <div class="restaurant-rating">
                <div class="rating-stars">${generateStarRating(restaurant.rating)}</div>
                <span class="rating-text">${restaurant.rating}</span>
            </div>
            <div class="restaurant-delivery">
                <div class="delivery-time">
                    <i class="fas fa-clock"></i>
                    ${restaurant.deliveryTime}
                </div>
                <div class="delivery-fee">${restaurant.deliveryFee}</div>
            </div>
        </div>
    `;
    
    return card;
}

// Filter restaurants by category
function filterByCategory(category) {
    const filteredRestaurants = restaurants.filter(restaurant => 
        restaurant.category === category
    );
    loadRestaurants(filteredRestaurants);
    
    // Update active category
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    event.target.closest('.category-card').classList.add('active');
}

// Search restaurants
function searchRestaurants() {
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value.trim();
    
    if (!location) {
        showNotification('Please enter your delivery address', 'error');
        return;
    }
    
    // Simulate search with loading
    const restaurantsGrid = document.getElementById('restaurantsGrid');
    showLoading(restaurantsGrid);
    
    // Simulate API call
    simulateAPI(() => {
        // Filter restaurants based on search (in real app, this would be API call)
        const filteredRestaurants = restaurants.filter(restaurant => 
            restaurant.name.toLowerCase().includes(location.toLowerCase()) ||
            restaurant.cuisine.toLowerCase().includes(location.toLowerCase())
        );
        
        if (filteredRestaurants.length === 0) {
            restaurantsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>No restaurants found</h3>
                    <p>Try searching with a different location or cuisine type</p>
                </div>
            `;
        } else {
            loadRestaurants(filteredRestaurants);
        }
        
        showNotification(`Found ${filteredRestaurants.length} restaurants near you!`);
    }, 1500);
}

// Initialize search functionality
function initializeSearch() {
    const locationInput = document.getElementById('locationInput');
    
    if (locationInput) {
        // Add autocomplete suggestions
        locationInput.addEventListener('input', debounce(handleLocationInput, 300));
        
        // Handle enter key
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRestaurants();
            }
        });
    }
}

// Handle location input with suggestions
function handleLocationInput(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length < 2) return;
    
    // Sample location suggestions
    const suggestions = [
        'Downtown Karachi',
        'Gulshan-e-Iqbal',
        'Clifton Karachi',
        'North Nazimabad',
        'Defence Karachi',
        'PECHS Karachi',
        'Malir Karachi',
        'Korangi Karachi'
    ];
    
    const filteredSuggestions = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query)
    );
    
    showLocationSuggestions(filteredSuggestions);
}

// Show location suggestions
function showLocationSuggestions(suggestions) {
    // Remove existing suggestions
    const existingSuggestions = document.querySelector('.location-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
    
    if (suggestions.length === 0) return;
    
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'location-suggestions';
    suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    `;
    
    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = suggestion;
        suggestionItem.style.cssText = `
            padding: 0.75rem;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            transition: background 0.2s;
        `;
        
        suggestionItem.addEventListener('mouseenter', function() {
            this.style.background = '#f8f9fa';
        });
        
        suggestionItem.addEventListener('mouseleave', function() {
            this.style.background = 'white';
        });
        
        suggestionItem.addEventListener('click', function() {
            document.getElementById('locationInput').value = suggestion;
            suggestionsContainer.remove();
        });
        
        suggestionsContainer.appendChild(suggestionItem);
    });
    
    // Add to location input container
    const locationContainer = document.querySelector('.location-input');
    locationContainer.style.position = 'relative';
    locationContainer.appendChild(suggestionsContainer);
    
    // Remove suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!locationContainer.contains(e.target)) {
            suggestionsContainer.remove();
        }
    });
}

// View restaurant details
function viewRestaurant(restaurantId) {
    // Store restaurant ID for the restaurant page
    localStorage.setItem('selectedRestaurant', restaurantId);
    // Navigate to restaurant page
    window.location.href = 'pages/restaurant.html';
}

// Add category active state styles
const categoryStyles = document.createElement('style');
categoryStyles.textContent = `
    .category-card.active {
        background: #ff6b35;
        color: white;
        transform: translateY(-5px);
    }
    
    .category-card.active .category-icon {
        color: white;
    }
    
    .category-card.active h3 {
        color: white;
    }
    
    .no-results {
        text-align: center;
        padding: 3rem;
        color: #666;
    }
    
    .no-results h3 {
        margin-bottom: 1rem;
        color: #333;
    }
`;
document.head.appendChild(categoryStyles);
