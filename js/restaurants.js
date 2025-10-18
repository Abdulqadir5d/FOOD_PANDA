// Restaurants Page JavaScript

// Extended restaurant data
const allRestaurants = [
    {
        id: 1,
        name: "Pizza Palace",
        cuisine: "Italian",
        rating: 4.5,
        deliveryTime: 30,
        deliveryFee: 2.99,
        image: "../images/restaurants/pizza-palace.jpg",
        category: "pizza",
        description: "Authentic Italian pizza with fresh ingredients"
    },
    {
        id: 2,
        name: "Burger King",
        cuisine: "American",
        rating: 4.2,
        deliveryTime: 25,
        deliveryFee: 1.99,
        image: "../images/restaurants/burger-king.jpg",
        category: "burger",
        description: "Flame-grilled burgers and crispy fries"
    },
    {
        id: 3,
        name: "Sushi Master",
        cuisine: "Japanese",
        rating: 4.8,
        deliveryTime: 35,
        deliveryFee: 3.99,
        image: "../images/restaurants/sushi-master.jpg",
        category: "asian",
        description: "Fresh sushi and traditional Japanese cuisine"
    },
    {
        id: 4,
        name: "Sweet Dreams",
        cuisine: "Desserts",
        rating: 4.3,
        deliveryTime: 20,
        deliveryFee: 1.49,
        image: "../images/restaurants/sweet-dreams.jpg",
        category: "dessert",
        description: "Delicious cakes, ice cream, and sweet treats"
    },
    {
        id: 5,
        name: "McDonald's",
        cuisine: "Fast Food",
        rating: 4.0,
        deliveryTime: 20,
        deliveryFee: 1.99,
        image: "../images/restaurants/mcdonalds.jpg",
        category: "fast-food",
        description: "Classic fast food favorites"
    },
    {
        id: 6,
        name: "Green Bowl",
        cuisine: "Healthy",
        rating: 4.6,
        deliveryTime: 25,
        deliveryFee: 2.49,
        image: "../images/restaurants/green-bowl.jpg",
        category: "healthy",
        description: "Fresh salads, smoothies, and healthy meals"
    },
    {
        id: 7,
        name: "Taco Bell",
        cuisine: "Mexican",
        rating: 4.1,
        deliveryTime: 22,
        deliveryFee: 1.99,
        image: "../images/restaurants/taco-bell.jpg",
        category: "fast-food",
        description: "Mexican-inspired fast food"
    },
    {
        id: 8,
        name: "KFC",
        cuisine: "American",
        rating: 4.0,
        deliveryTime: 28,
        deliveryFee: 2.49,
        image: "../images/restaurants/kfc.jpg",
        category: "fast-food",
        description: "Finger lickin' good fried chicken"
    },
    {
        id: 9,
        name: "Subway",
        cuisine: "Sandwiches",
        rating: 4.2,
        deliveryTime: 18,
        deliveryFee: 1.49,
        image: "../images/restaurants/subway.jpg",
        category: "healthy",
        description: "Fresh subs and sandwiches"
    },
    {
        id: 10,
        name: "Domino's Pizza",
        cuisine: "Italian",
        rating: 4.3,
        deliveryTime: 25,
        deliveryFee: 2.99,
        image: "../images/restaurants/dominos.jpg",
        category: "pizza",
        description: "Hot, fresh pizza delivered fast"
    }
];

let currentRestaurants = [...allRestaurants];
let currentFilter = 'all';
let currentSort = 'rating';
let currentView = 'grid';
let displayedCount = 6;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeSearch();
    initializeSort();
    initializeViewToggle();
    loadRestaurants();
});

// Initialize filter buttons
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            currentFilter = this.getAttribute('data-filter');
            
            // Filter restaurants
            filterRestaurants();
        });
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('restaurantSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

// Initialize sort functionality
function initializeSort() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortRestaurants();
        });
    }
}

// Initialize view toggle
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get view type
            currentView = this.getAttribute('data-view');
            
            // Update view
            updateView();
        });
    });
}

// Handle search
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query === '') {
        currentRestaurants = [...allRestaurants];
    } else {
        currentRestaurants = allRestaurants.filter(restaurant => 
            restaurant.name.toLowerCase().includes(query) ||
            restaurant.cuisine.toLowerCase().includes(query) ||
            restaurant.description.toLowerCase().includes(query)
        );
    }
    
    filterRestaurants();
}

// Filter restaurants
function filterRestaurants() {
    let filtered = [...currentRestaurants];
    
    if (currentFilter !== 'all') {
        filtered = filtered.filter(restaurant => restaurant.category === currentFilter);
    }
    
    currentRestaurants = filtered;
    sortRestaurants();
}

// Sort restaurants
function sortRestaurants() {
    switch (currentSort) {
        case 'rating':
            currentRestaurants.sort((a, b) => b.rating - a.rating);
            break;
        case 'delivery-time':
            currentRestaurants.sort((a, b) => a.deliveryTime - b.deliveryTime);
            break;
        case 'delivery-fee':
            currentRestaurants.sort((a, b) => a.deliveryFee - b.deliveryFee);
            break;
        case 'name':
            currentRestaurants.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    loadRestaurants();
}

// Load restaurants
function loadRestaurants() {
    const container = document.getElementById('restaurantsContainer');
    const countElement = document.getElementById('restaurantsCount');
    
    if (!container) return;
    
    // Update count
    if (countElement) {
        const count = currentRestaurants.length;
        countElement.textContent = `${count} Restaurant${count !== 1 ? 's' : ''} Found`;
    }
    
    // Show loading
    showLoading(container);
    
    // Simulate loading delay
    setTimeout(() => {
        displayRestaurants();
    }, 500);
}

// Display restaurants
function displayRestaurants() {
    const container = document.getElementById('restaurantsContainer');
    const restaurantsToShow = currentRestaurants.slice(0, displayedCount);
    
    if (restaurantsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No restaurants found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    // Create restaurants HTML
    const restaurantsHTML = restaurantsToShow.map(restaurant => 
        createRestaurantCard(restaurant)
    ).join('');
    
    // Update container
    container.innerHTML = `
        <div class="restaurants-${currentView}">
            ${restaurantsHTML}
        </div>
    `;
    
    // Update load more button
    updateLoadMoreButton();
}

// Create restaurant card HTML
function createRestaurantCard(restaurant) {
    const deliveryTimeText = formatDeliveryTime(restaurant.deliveryTime);
    const deliveryFeeText = formatPrice(restaurant.deliveryFee);
    
    return `
        <div class="restaurant-card" onclick="viewRestaurant(${restaurant.id})">
            <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image" onerror="this.src='../images/placeholder-restaurant.jpg'">
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
                        ${deliveryTimeText}
                    </div>
                    <div class="delivery-fee">${deliveryFeeText}</div>
                </div>
            </div>
        </div>
    `;
}

// Update view (grid/list)
function updateView() {
    const container = document.getElementById('restaurantsContainer');
    const restaurantsDiv = container.querySelector('.restaurants-grid, .restaurants-list');
    
    if (restaurantsDiv) {
        const newClass = `restaurants-${currentView}`;
        restaurantsDiv.className = newClass;
    } else {
        displayRestaurants();
    }
}

// Update load more button
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        if (displayedCount >= currentRestaurants.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

// Load more restaurants
function loadMoreRestaurants() {
    displayedCount += 6;
    displayRestaurants();
}

// View restaurant details
function viewRestaurant(restaurantId) {
    localStorage.setItem('selectedRestaurant', restaurantId);
    window.location.href = 'restaurant.html';
}

// Initialize load more button
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreRestaurants);
    }
});
