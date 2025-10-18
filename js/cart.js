// Cart Page JavaScript

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartCount();
});

// Load cart items
function loadCartItems() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        emptyCart.style.display = 'block';
        updateOrderSummary(0, 0);
        return;
    }
    
    cartItems.style.display = 'block';
    emptyCart.style.display = 'none';
    
    cartItems.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = calculateDeliveryFee();
    const tax = calculateTax(subtotal);
    const total = subtotal + deliveryFee + tax;
    
    updateOrderSummary(subtotal, deliveryFee, tax, total);
}

// Create cart item HTML
function createCartItemHTML(item) {
    return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='../images/placeholder-food.jpg'">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-restaurant">from ${item.restaurantName}</p>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                    Remove
                </button>
            </div>
        </div>
    `;
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartItems();
            updateCartCount();
        }
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
    showNotification('Item removed from cart!');
}

// Clear entire cart
function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty!', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
        showNotification('Cart cleared!');
    }
}

// Calculate delivery fee
function calculateDeliveryFee() {
    // Simple delivery fee calculation
    // In a real app, this would be more complex
    return 2.99;
}

// Calculate tax
function calculateTax(subtotal) {
    // Simple tax calculation (8% tax rate)
    return subtotal * 0.08;
}

// Update order summary
function updateOrderSummary(subtotal, deliveryFee, tax, total) {
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('deliveryFee').textContent = formatPrice(deliveryFee);
    document.getElementById('tax').textContent = formatPrice(tax);
    document.getElementById('total').textContent = formatPrice(total);
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

// Update cart count in header
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}
