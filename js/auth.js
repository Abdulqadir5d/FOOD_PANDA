// Authentication JavaScript

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// Initialize authentication functionality
function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Initialize social login buttons
    initializeSocialLogin();
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate form
    if (!validateLoginForm(email, password)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;
    
    // Simulate login API call
    setTimeout(() => {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Login successful
            const userSession = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                loginTime: new Date().toISOString()
            };
            
            if (remember) {
                localStorage.setItem('userSession', JSON.stringify(userSession));
            } else {
                sessionStorage.setItem('userSession', JSON.stringify(userSession));
            }
            
            showNotification('Login successful! Welcome back!');
            
            // Redirect to homepage or previous page
            const returnUrl = new URLSearchParams(window.location.search).get('return');
            setTimeout(() => {
                window.location.href = returnUrl || '../index.html';
            }, 1500);
            
        } else {
            // Login failed
            showNotification('Invalid email or password', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // Validate form
    if (!validateSignupForm(firstName, lastName, email, phone, password, confirmPassword, terms)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate signup API call
    setTimeout(() => {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            showNotification('An account with this email already exists', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Create new user
        const newUser = {
            id: generateUserId(),
            firstName,
            lastName,
            email,
            phone,
            password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto-login after signup
        const userSession = {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            loginTime: new Date().toISOString()
        };
        
        sessionStorage.setItem('userSession', JSON.stringify(userSession));
        
        showNotification('Account created successfully! Welcome to Foodpanda!');
        
        // Redirect to homepage
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        
    }, 2000);
}

// Validate login form
function validateLoginForm(email, password) {
    let isValid = true;
    
    if (!email || !isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password || password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    return isValid;
}

// Validate signup form
function validateSignupForm(firstName, lastName, email, phone, password, confirmPassword, terms) {
    let isValid = true;
    
    if (!firstName || firstName.length < 2) {
        showFieldError('firstName', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    if (!lastName || lastName.length < 2) {
        showFieldError('lastName', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    if (!email || !isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!phone || !isValidPhone(phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (!password || password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    if (!terms) {
        showFieldError('terms', 'Please accept the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #f44336; font-size: 0.8rem; margin-top: 0.25rem;';
        
        field.parentNode.appendChild(errorDiv);
        
        // Remove error on input
        field.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    }
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Generate user ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

// Initialize social login
function initializeSocialLogin() {
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showNotification('Google login coming soon!', 'error');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            showNotification('Facebook login coming soon!', 'error');
        });
    }
}

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
}

// Get current user
function getCurrentUser() {
    const session = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    localStorage.removeItem('cart');
    showNotification('You have been logged out');
    window.location.href = '../index.html';
}
