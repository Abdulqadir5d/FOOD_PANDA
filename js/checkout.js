// Checkout Page JavaScript

let checkoutCart = JSON.parse(localStorage.getItem('checkoutCart')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    if (checkoutCart.length === 0) {
        showNotification('No items in cart!', 'error');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 2000);
        return;
    }
    
    loadOrderItems();
    initializePaymentMethods();
    initializeFormValidation();
});

// Load order items
function loadOrderItems() {
    const orderItems = document.getElementById('orderItems');
    const summaryItems = document.getElementById('summaryItems');
    
    // Calculate totals
    const subtotal = checkoutCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;
    
    // Create order items HTML
    const itemsHTML = checkoutCart.map(item => `
        <div class="order-item">
            <div>
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="order-item-price">${formatPrice(item.price * item.quantity)}</div>
        </div>
    `).join('');
    
    orderItems.innerHTML = itemsHTML;
    
    // Create summary items HTML
    const summaryHTML = checkoutCart.map(item => `
        <div class="summary-item">
            <div>
                <div class="summary-item-name">${item.name}</div>
                <div class="summary-item-details">from ${item.restaurantName} • Qty: ${item.quantity}</div>
            </div>
            <div class="summary-item-price">${formatPrice(item.price * item.quantity)}</div>
        </div>
    `).join('');
    
    summaryItems.innerHTML = summaryHTML;
    
    // Update totals
    updateTotals(subtotal, deliveryFee, tax, total);
}

// Update totals
function updateTotals(subtotal, deliveryFee, tax, total) {
    // Main form totals
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('deliveryFee').textContent = formatPrice(deliveryFee);
    document.getElementById('tax').textContent = formatPrice(tax);
    document.getElementById('total').textContent = formatPrice(total);
    
    // Sidebar totals
    document.getElementById('summarySubtotal').textContent = formatPrice(subtotal);
    document.getElementById('summaryDeliveryFee').textContent = formatPrice(deliveryFee);
    document.getElementById('summaryTax').textContent = formatPrice(tax);
    document.getElementById('summaryTotal').textContent = formatPrice(total);
}

// Initialize payment methods
function initializePaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
                // Make card fields required
                document.getElementById('cardNumber').required = true;
                document.getElementById('expiryDate').required = true;
                document.getElementById('cvv').required = true;
                document.getElementById('cardName').required = true;
            } else {
                cardDetails.style.display = 'none';
                // Make card fields not required
                document.getElementById('cardNumber').required = false;
                document.getElementById('expiryDate').required = false;
                document.getElementById('cvv').required = false;
                document.getElementById('cardName').required = false;
            }
        });
    });
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('checkoutForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            processOrder();
        }
    });
    
    // Add input formatting
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
}

// Validate form
function validateForm() {
    const form = document.getElementById('checkoutForm');
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // Validate phone number
    const phone = document.getElementById('phone');
    if (phone && phone.value && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.value.replace(/\s/g, ''))) {
        phone.classList.add('error');
        isValid = false;
    }
    
    // Validate card details if card payment is selected
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (paymentMethod && paymentMethod.value === 'card') {
        const cardNumber = document.getElementById('cardNumber');
        const expiryDate = document.getElementById('expiryDate');
        const cvv = document.getElementById('cvv');
        
        if (cardNumber && !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardNumber.value)) {
            cardNumber.classList.add('error');
            isValid = false;
        }
        
        if (expiryDate && !/^\d{2}\/\d{2}$/.test(expiryDate.value)) {
            expiryDate.classList.add('error');
            isValid = false;
        }
        
        if (cvv && !/^\d{3,4}$/.test(cvv.value)) {
            cvv.classList.add('error');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly', 'error');
    }
    
    return isValid;
}

// Process order
function processOrder() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Create order object
        const order = {
            id: generateOrderId(),
            items: checkoutCart,
            customerInfo: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                zipCode: formData.get('zipCode'),
                deliveryInstructions: formData.get('deliveryInstructions')
            },
            paymentMethod: formData.get('paymentMethod'),
            paymentInfo: paymentMethod.value === 'card' ? {
                cardNumber: formData.get('cardNumber'),
                expiryDate: formData.get('expiryDate'),
                cvv: formData.get('cvv'),
                cardName: formData.get('cardName')
            } : null,
            totals: {
                subtotal: checkoutCart.reduce((total, item) => total + (item.price * item.quantity), 0),
                deliveryFee: 2.99,
                tax: checkoutCart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.08,
                total: checkoutCart.reduce((total, item) => total + (item.price * item.quantity), 0) + 2.99 + (checkoutCart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.08)
            },
            status: 'confirmed',
            orderTime: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
        };
        
        // Store order
        localStorage.setItem('currentOrder', JSON.stringify(order));
        
        // Clear cart
        localStorage.removeItem('cart');
        localStorage.removeItem('checkoutCart');
        
        // Redirect to order confirmation
        window.location.href = 'order-confirmation.html';
        
    }, 2000);
}

// Generate order ID
function generateOrderId() {
    return 'FP' + Date.now() + Math.floor(Math.random() * 1000);
}
