// Restaurant Page JavaScript

// Sample menu data
const menuData = {
    1: { // Pizza Palace
        id: 1,
        name: "Pizza Palace",
        cuisine: "Italian",
        rating: 4.5,
        deliveryTime: 30,
        deliveryFee: 2.99,
        image: "../images/restaurants/pizza-palace.jpg",
        description: "Authentic Italian pizza with fresh ingredients",
        categories: {
            "Pizza": [
                {
                    id: 101,
                    name: "Margherita Pizza",
                    description: "Fresh tomato sauce, mozzarella, and basil",
                    price: 12.99,
                    image: "../images/menu/margherita.jpg"
                },
                {
                    id: 102,
                    name: "Pepperoni Pizza",
                    description: "Classic pepperoni with mozzarella cheese",
                    price: 14.99,
                    image: "../images/menu/pepperoni.jpg"
                },
                {
                    id: 103,
                    name: "BBQ Chicken Pizza",
                    description: "Grilled chicken with BBQ sauce and onions",
                    price: 16.99,
                    image: "../images/menu/bbq-chicken.jpg"
                }
            ],
            "Appetizers": [
                {
                    id: 201,
                    name: "Garlic Bread",
                    description: "Fresh bread with garlic butter",
                    price: 5.99,
                    image: "../images/menu/garlic-bread.jpg"
                },
                {
                    id: 202,
                    name: "Caesar Salad",
                    description: "Fresh lettuce with Caesar dressing",
                    price: 8.99,
                    image: "../images/menu/caesar-salad.jpg"
                }
            ],
            "Desserts": [
                {
                    id: 301,
                    name: "Tiramisu",
                    description: "Classic Italian dessert",
                    price: 6.99,
                    image: "../images/menu/tiramisu.jpg"
                }
            ]
        }
    },
    2: { // Burger King
        id: 2,
        name: "Burger King",
        cuisine: "American",
        rating: 4.2,
        deliveryTime: 25,
        deliveryFee: 1.99,
        image: "../images/restaurants/burger-king.jpg",
        description: "Flame-grilled burgers and crispy fries",
        categories: {
            "Burgers": [
                {
                    id: 401,
                    name: "Whopper",
                    description: "Flame-grilled beef patty with fresh vegetables",
                    price: 8.99,
                    image: "../images/menu/whopper.jpg"
                },
                {
                    id: 402,
                    name: "Chicken Sandwich",
                    description: "Crispy chicken breast with lettuce and mayo",
                    price: 7.99,
                    image: "../images/menu/chicken-sandwich.jpg"
                }
            ],
            "Sides": [
                {
                    id: 501,
                    name: "French Fries",
                    description: "Crispy golden fries",
                    price: 3.99,
                    image: "../images/menu/french-fries.jpg"
                }
            ]
        }
    }
};

let currentRestaurant = null;
let currentCategory = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    const restaurantId = localStorage.getItem('selectedRestaurant');
    
    if (!restaurantId || !menuData[restaurantId]) {
        showNotification('Restaurant not found', 'error');
        setTimeout(() => {
            window.location.href = 'restaurants.html';
        }, 2000);
        return;
    }
    
    currentRestaurant = menuData[restaurantId];
    loadRestaurantInfo();
    loadMenuCategories();
    loadMenuItems();
    updateCartDisplay();
});

// Load restaurant information
function loadRestaurantInfo() {
    const header = document.getElementById('restaurantHeader');
    
    header.innerHTML = `
        <div class="container">
            <div class="restaurant-info">
                <img src="${currentRestaurant.image}" alt="${currentRestaurant.name}" class="restaurant-logo" onerror="this.src='../images/placeholder-restaurant.jpg'">
                <div class="restaurant-details">
                    <h1>${currentRestaurant.name}</h1>
                    <p class="restaurant-cuisine">${currentRestaurant.cuisine}</p>
                    <div class="restaurant-rating">
                        <div class="rating-stars">${generateStarRating(currentRestaurant.rating)}</div>
                        <span class="rating-text">${currentRestaurant.rating}</span>
                    </div>
                    <div class="restaurant-delivery-info">
                        <div class="delivery-info-item">
                            <i class="fas fa-clock"></i>
                            <span>${formatDeliveryTime(currentRestaurant.deliveryTime)}</span>
                        </div>
                        <div class="delivery-info-item">
                            <i class="fas fa-truck"></i>
                            <span>${formatPrice(currentRestaurant.deliveryFee)} delivery</span>
                        </div>
                    </div>
                    <p class="restaurant-description">${currentRestaurant.description}</p>
                </div>
            </div>
        </div>
    `;
}

// Load menu categories
function loadMenuCategories() {
    const categoriesNav = document.getElementById('categoriesNav');
    const categories = Object.keys(currentRestaurant.categories);
    
    categoriesNav.innerHTML = categories.map(category => `
        <div class="category-nav-item" onclick="selectCategory('${category}')">
            ${category}
        </div>
    `).join('');
    
    // Select first category by default
    if (categories.length > 0) {
        selectCategory(categories[0]);
    }
}

// Select category
function selectCategory(categoryName) {
    currentCategory = categoryName;
    
    // Update active category
    document.querySelectorAll('.category-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[onclick="selectCategory('${categoryName}')"]`).classList.add('active');
    
    // Load menu items for this category
    loadMenuItems();
}

// Load menu items
function loadMenuItems() {
    const menuItems = document.getElementById('menuItems');
    
    if (!currentCategory) return;
    
    const items = currentRestaurant.categories[currentCategory];
    
    menuItems.innerHTML = `
        <div class="menu-category">
            <h2 class="category-title">${currentCategory}</h2>
            <div class="menu-items-grid">
                ${items.map(item => createMenuItemHTML(item)).join('')}
            </div>
        </div>
    `;
}

// Create menu item HTML
function createMenuItemHTML(item) {
    const cartItem = cart.find(cartItem => cartItem.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    return `
        <div class="menu-item">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image" onerror="this.src='../images/placeholder-food.jpg'">
            <div class="menu-item-info">
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="menu-item-actions">
                ${quantity > 0 ? `
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                ` : `
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                        Add to Cart
                    </button>
                `}
            </div>
        </div>
    `;
}

// Add item to cart
function addToCart(itemId) {
    const item = findMenuItemById(itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            restaurantId: currentRestaurant.id,
            restaurantName: currentRestaurant.name,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    loadMenuItems(); // Refresh to show quantity controls
    showNotification('Item added to cart!');
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        if (newQuantity <= 0) {
            cart = cart.filter(item => item.id !== itemId);
        } else {
            existingItem.quantity = newQuantity;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        loadMenuItems(); // Refresh to show updated controls
    }
}

// Find menu item by ID
function findMenuItemById(itemId) {
    for (const category in currentRestaurant.categories) {
        const item = currentRestaurant.categories[category].find(item => item.id === itemId);
        if (item) return item;
    }
    return null;
}

// Update cart display
function updateCartDisplay() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update cart count in header
    const headerCartCount = document.querySelector('.cart-count');
    if (headerCartCount) {
        headerCartCount.textContent = cartCount;
    }
    
    // Update floating cart count
    const floatingCartCount = document.getElementById('floatingCartCount');
    if (floatingCartCount) {
        floatingCartCount.textContent = cartCount;
    }
    
    // Update cart sidebar
    updateCartSidebar(cartTotal);
    
    // Show/hide floating cart
    const floatingCart = document.getElementById('floatingCart');
    if (floatingCart) {
        floatingCart.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

// Update cart sidebar
function updateCartSidebar(total) {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='../images/placeholder-food.jpg'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    if (cartTotal) {
        cartTotal.textContent = formatPrice(total);
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    loadMenuItems(); // Refresh to show add button
    showNotification('Item removed from cart!');
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Store cart data for checkout page
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}
