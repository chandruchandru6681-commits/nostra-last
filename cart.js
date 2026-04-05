// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // DOM elements
    const cartCount = document.querySelector('.cart-count');
    const itemsList = document.querySelector('.items-list');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const promoInput = document.getElementById('promo-code');
    const applyPromoBtn = document.getElementById('apply-promo');
    const checkoutBtn = document.getElementById('checkout-btn');

    let discount = 0;

    // Update cart count
    function updateCartCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    }

    // Calculate totals
    function calculateTotals() {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : (cartItems.length > 0 ? 99 : 0);
        const tax = Math.round(subtotal * 0.1);
        const total = subtotal + shipping + tax - discount;

        subtotalEl.textContent = cartItems.length > 0 ? `₹${subtotal.toLocaleString()}` : '₹0';
        shippingEl.textContent = shipping === 0 ? (cartItems.length > 0 ? 'Free' : '₹0') : `₹${shipping}`;
        taxEl.textContent = cartItems.length > 0 ? `₹${tax.toLocaleString()}` : '₹0';
        totalEl.textContent = cartItems.length > 0 ? `₹${total.toLocaleString()}` : '₹0';
    }

    // Render cart items
    function renderCartItems() {
        itemsList.innerHTML = '';

        if (cartItems.length === 0) {
            itemsList.innerHTML = `
                <div style="text-align: center; padding: 50px; color: var(--text-mid);">
                    <h3 style="color: var(--text-dark); margin-bottom: 16px;">Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                    <a href="index.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: var(--accent); color: white; text-decoration: none; border-radius: 5px;">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cartItems.forEach((item, index) => {
            const itemHTML = `
                <div class="cart-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}"/>
                    </div>
                    <div class="item-info">
                        <span class="item-tag">${getCategory(item.name)}</span>
                        <div class="item-name">${item.name}</div>
                        <div class="item-meta">${getMeta(item.name)}</div>
                        <div class="item-qty">
                            <button class="qty-btn" data-action="decrease" data-index="${index}">−</button>
                            <span class="qty-num">${item.quantity}</span>
                            <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div class="item-right">
                        <span class="item-price">₹${(item.price * item.quantity).toLocaleString()}</span>
                        <button class="remove-btn" data-action="remove" data-index="${index}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                            Remove
                        </button>
                    </div>
                </div>
            `;
            itemsList.insertAdjacentHTML('beforeend', itemHTML);
        });
    }

    // Get category based on item name
    function getCategory(name) {
        if (name.includes('Leather Bag')) return 'Accessories';
        if (name.includes('Shirt') || name.includes('Polo') || name.includes('Blazer')) return 'Clothing';
        if (name.includes('Boots')) return 'Footwear';
        if (name.includes('Glass') || name.includes('Watch')) return 'Electronics';
        return 'General';
    }

    // Get meta info based on item name
    function getMeta(name) {
        if (name.includes('Leather Bag')) return 'Premium Quality &nbsp;·&nbsp; Free Shipping';
        if (name.includes('Shirt') || name.includes('Polo')) return 'Cotton Material &nbsp;·&nbsp; Machine Washable';
        if (name.includes('Boots')) return 'Water Resistant &nbsp;·&nbsp; 1 Year Warranty';
        if (name.includes('Glass')) return 'Smart Display &nbsp;·&nbsp; Voice Control';
        if (name.includes('Watch')) return 'Fitness Tracking &nbsp;·&nbsp; Heart Rate Monitor';
        if (name.includes('Blazer')) return 'Formal Wear &nbsp;·&nbsp; Dry Clean Only';
        return 'High Quality Product';
    }

    // Handle quantity changes
    function handleQuantityChange(action, index) {
        if (action === 'increase') {
            cartItems[index].quantity++;
        } else if (action === 'decrease' && cartItems[index].quantity > 1) {
            cartItems[index].quantity--;
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderCartItems();
        updateCartCount();
        calculateTotals();
    }

    // Handle remove item
    function handleRemoveItem(index) {
        cartItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderCartItems();
        updateCartCount();
        calculateTotals();
    }

    // Handle promo code
    function handleApplyPromo() {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'SAVE10') {
            discount = Math.round(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1);
            alert('Promo code applied! 10% discount added.');
        } else if (code === 'FREESHIP') {
            discount = 99;
            alert('Free shipping applied!');
        } else {
            discount = 0;
            alert('Invalid promo code.');
        }
        calculateTotals();
    }

    // Handle checkout
    function handleCheckout() {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Proceeding to checkout... (This is a demo)');
    }

    // Event listeners
    itemsList.addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const index = parseInt(target.dataset.index);

        if (action === 'increase' || action === 'decrease') {
            handleQuantityChange(action, index);
        } else if (action === 'remove') {
            handleRemoveItem(index);
        }
    });

    applyPromoBtn.addEventListener('click', handleApplyPromo);
    checkoutBtn.addEventListener('click', handleCheckout);

    // Initial render
    renderCartItems();
    updateCartCount();
    calculateTotals();
});