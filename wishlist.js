// Wishlist page functionality
document.addEventListener('DOMContentLoaded', function() {
    const wishlistContent = document.getElementById('wishlist-content');
    const wishlistCount = document.getElementById('wishlist-count');

    // Sample product data (in a real app, this would come from a database)
    const productData = {
        'Varsi Leather Bag': {
            price: 485,
            image: './assets/images/product-1.jpg',
            category: 'Accessories'
        },
        'Fit Twill Shirt for Woman': {
            price: 620,
            image: './assets/images/product-2.jpg',
            category: 'Women'
        },
        'Grand Atlantic Chukka Boots': {
            price: 320,
            image: './assets/images/product-3.jpg',
            category: 'Footwear'
        },
        "Women's Faux-Trim Shirt": {
            price: 840,
            image: './assets/images/product-4.jpg',
            category: 'Women'
        },
        'Soft Touch Interlock Polo': {
            price: 450,
            image: './assets/images/product-5.jpg',
            category: 'Men'
        },
        'Casmart Smart Watch': {
            price: 300,
            image: './assets/images/product-6.jpg',
            category: 'Electronics'
        },
        'Casmart Smart Glass': {
            price: 250,
            image: './assets/images/product-7.jpg',
            category: 'Electronics'
        },
        'Cotton Shirt for Men': {
            price: 850,
            image: './assets/images/product-8.jpg',
            category: 'Men'
        },
        'Double-breasted Blazer': {
            price: 999,
            image: './assets/images/product-9.jpg',
            category: 'Men'
        },
        'Ribbed Cotton Bodysuits': {
            price: 1199,
            image: './assets/images/product-10.jpg',
            category: 'Women'
        }
    };

    // Load wishlist from localStorage
    function loadWishlist() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        // Ensure all names are trimmed
        return wishlist.map(name => name.trim());
    }

    // Save wishlist to localStorage
    function saveWishlist(wishlist) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    // Update wishlist count
    function updateWishlistCount() {
        const wishlist = loadWishlist();
        wishlistCount.textContent = `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''}`;
    }

    // Render wishlist items
    function renderWishlist() {
        const wishlist = loadWishlist();

        if (wishlist.length === 0) {
            wishlistContent.innerHTML = `
                <div class="empty-wishlist">
                    <h2>Your wishlist is empty</h2>
                    <p>Add items you love to your wishlist and they'll appear here.</p>
                    <a href="index.html" class="btn">Continue Shopping</a>
                </div>
            `;
            return;
        }

        const wishlistHTML = `
            <div class="wishlist-grid">
                ${wishlist.map(productName => {
                    const trimmedName = productName.trim();
                    const product = productData[trimmedName];
                    if (!product) return '';

                    return `
                        <div class="wishlist-item" data-product="${trimmedName}">
                            <div class="item-image">
                                <img src="${product.image}" alt="${trimmedName}" loading="lazy">
                                <button class="remove-btn" data-action="remove" data-product="${trimmedName}">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <div class="item-content">
                                <span class="item-category">${product.category}</span>
                                <h3 class="item-name">${trimmedName}</h3>
                                <div class="item-price">₹${product.price}</div>
                                <div class="item-actions">
                                    <button class="btn btn-primary" data-action="add-to-cart" data-product="${trimmedName}">
                                        Add to Cart
                                    </button>
                                    <a href="index.html" class="btn btn-secondary">View Details</a>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        wishlistContent.innerHTML = wishlistHTML;
    }

    // Remove item from wishlist
    function removeFromWishlist(productName) {
        const wishlist = loadWishlist();
        const trimmedName = productName.trim();
        const index = wishlist.indexOf(trimmedName);
        if (index > -1) {
            wishlist.splice(index, 1);
            saveWishlist(wishlist);
            renderWishlist();
            updateWishlistCount();
            showToast(`${trimmedName} removed from wishlist`);
        }
    }

    // Add item to cart
    function addToCart(productName) {
        const trimmedName = productName.trim();
        const product = productData[trimmedName];
        if (!product) return;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.name === trimmedName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: trimmedName,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        showToast(`${trimmedName} added to cart!`);
    }

    // Show toast notification
    function showToast(message) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1a1209;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Add CSS animations for toast
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Event delegation for wishlist actions
    wishlistContent.addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const productName = target.dataset.product;

        if (action === 'remove') {
            removeFromWishlist(productName);
        } else if (action === 'add-to-cart') {
            addToCart(productName);
        }
    });

    // Initialize
    renderWishlist();
    updateWishlistCount();
});