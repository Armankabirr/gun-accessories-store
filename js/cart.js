// Cart functionality
class ShoppingCart {
	constructor() {
		this.items = this.loadCart();
		this.init();
	}

	init() {
		this.renderCart();
		this.updateCartBadge();
	}

	loadCart() {
		const saved = localStorage.getItem('cart');
		return saved ? JSON.parse(saved) : [];
	}

	saveCart() {
		localStorage.setItem('cart', JSON.stringify(this.items));
	}

	addItem(product, quantity = 1) {
		const existingItem = this.items.find(item => item.id === product.id);
		
		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			this.items.push({
				...product,
				quantity: quantity
			});
		}
		
		this.saveCart();
		this.renderCart();
		this.updateCartBadge();
	}

	removeItem(productId) {
		this.items = this.items.filter(item => item.id !== productId);
		this.saveCart();
		this.renderCart();
		this.updateCartBadge();
	}

	updateQuantity(productId, quantity) {
		const item = this.items.find(item => item.id === productId);
		if (item) {
			item.quantity = Math.max(1, quantity);
			this.saveCart();
			this.renderCart();
			this.updateCartBadge();
		}
	}

	getTotal() {
		return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
	}

	getTax() {
		return this.getTotal() * 0.08;
	}

	getGrandTotal() {
		return this.getTotal() + this.getTax();
	}

	updateCartBadge() {
		const badge = document.getElementById('cart-badge');
		const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
		if (badge) {
			badge.textContent = totalItems;
			badge.style.display = totalItems > 0 ? 'flex' : 'none';
		}
	}

	renderCart() {
		const emptyCart = document.getElementById('empty-cart');
		const cartContent = document.getElementById('cart-content');
		const cartItems = document.getElementById('cart-items');
		const cartCount = document.getElementById('cart-count');

		if (this.items.length === 0) {
			emptyCart.style.display = 'flex';
			cartContent.style.display = 'none';
			return;
		}

		emptyCart.style.display = 'none';
		cartContent.style.display = 'block';

		// Update cart count
		const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
		cartCount.textContent = totalItems;

		// Render cart items
		cartItems.innerHTML = this.items.map(item => this.createCartItemHTML(item)).join('');

		// Update totals
		this.updateTotals();

		// Add event listeners
		this.attachEventListeners();
	}

	createCartItemHTML(item) {
		const imageName = item.title.replace(/\s+/g, ' ');
		const imageUrl = `images/${imageName}.jfif`;
		
		return `
			<div class="cart-item" data-id="${item.id}">
				<img src="${imageUrl}" alt="${item.title}" class="cart-item__image">
				<div class="cart-item__info">
					<h3 class="cart-item__title">${item.title}</h3>
					<p class="cart-item__category">${this.formatCategory(item.category)}</p>
				</div>
				<div class="cart-item__controls">
					<div class="cart-item__quantity">
						<button class="cart-item__quantity-btn" data-action="decrease" aria-label="Decrease quantity">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
							</svg>
						</button>
						<input type="number" class="cart-item__quantity-input" value="${item.quantity}" min="1" aria-label="Quantity">
						<button class="cart-item__quantity-btn" data-action="increase" aria-label="Increase quantity">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
							</svg>
						</button>
					</div>
				</div>
				<div class="cart-item__price-section">
					<div class="cart-item__price">$${item.price.toFixed(2)}</div>
					<div class="cart-item__price-label">$${item.price.toFixed(2)} each</div>
				</div>
				<button class="cart-item__remove" aria-label="Remove item">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		`;
	}

	formatCategory(category) {
		const categoryMap = {
			'holsters': 'Holsters',
			'scopes': 'Scopes & Sights',
			'cleaning-kits': 'Cleaning Kits',
			'targets': 'Targets',
			'safety-gear': 'Safety Gear'
		};
		return categoryMap[category] || category;
	}

	updateTotals() {
		const subtotal = this.getTotal();
		const tax = this.getTax();
		const total = this.getGrandTotal();

		document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
		document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
		document.getElementById('total').textContent = `$${total.toFixed(2)}`;
	}

	attachEventListeners() {
		// Quantity buttons
		document.querySelectorAll('.cart-item__quantity-btn').forEach(btn => {
			btn.addEventListener('click', (e) => {
				const cartItem = e.target.closest('.cart-item');
				const productId = parseInt(cartItem.dataset.id);
				const action = btn.dataset.action;
				const input = cartItem.querySelector('.cart-item__quantity-input');
				let quantity = parseInt(input.value);

				if (action === 'increase') {
					quantity++;
				} else if (action === 'decrease' && quantity > 1) {
					quantity--;
				}

				this.updateQuantity(productId, quantity);
			});
		});

		// Quantity input
		document.querySelectorAll('.cart-item__quantity-input').forEach(input => {
			input.addEventListener('change', (e) => {
				const cartItem = e.target.closest('.cart-item');
				const productId = parseInt(cartItem.dataset.id);
				const quantity = Math.max(1, parseInt(e.target.value) || 1);
				this.updateQuantity(productId, quantity);
			});
		});

		// Remove buttons
		document.querySelectorAll('.cart-item__remove').forEach(btn => {
			btn.addEventListener('click', (e) => {
				const cartItem = e.target.closest('.cart-item');
				const productId = parseInt(cartItem.dataset.id);
				this.removeItem(productId);
			});
		});
	}
}

// Initialize cart
const cart = new ShoppingCart();

// For demo purposes, add some initial items if cart is empty
if (cart.items.length === 0) {
	// Add demo items
	const demoProducts = [
		{
			id: 1,
			title: 'Tactical IWB Holster',
			category: 'holsters',
			price: 49.99
		},
		{
			id: 5,
			title: 'Tactical Ear Protection',
			category: 'safety-gear',
			price: 79.99
		},
		{
			id: 10,
			title: 'Chest Holster Rig',
			category: 'holsters',
			price: 89.99
		}
	];

	demoProducts.forEach(product => {
		cart.addItem(product, 1);
	});
}
