class CheckoutPage {
	constructor() {
		this.items = this.loadCart();
		this.taxRate = 0.08;
		this.init();
	}

	init() {
		this.renderSummary();
		this.updateCartBadge();
		this.attachPlaceOrder();
	}

	loadCart() {
		const saved = localStorage.getItem('cart');
		return saved ? JSON.parse(saved) : [];
	}

	formatCurrency(value) {
		return `$${value.toFixed(2)}`;
	}

	getSubtotal() {
		return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}

	getTax() {
		return this.getSubtotal() * this.taxRate;
	}

	getTotal() {
		return this.getSubtotal() + this.getTax();
	}

	updateCartBadge() {
		const badge = document.getElementById('cart-badge');
		if (!badge) return;
		const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
		badge.textContent = totalItems;
		badge.style.display = totalItems > 0 ? 'flex' : 'none';
	}

	buildImageUrl(title) {
		const imageName = title.replace(/\s+/g, ' ');
		return `images/${imageName}.jfif`;
	}

	renderSummary() {
		const itemsContainer = document.getElementById('checkout-items');
		const subtotalEl = document.getElementById('checkout-subtotal');
		const taxEl = document.getElementById('checkout-tax');
		const totalEl = document.getElementById('checkout-total');
		const placeOrderBtn = document.getElementById('place-order');

		if (!itemsContainer || !subtotalEl || !taxEl || !totalEl) return;

		if (this.items.length === 0) {
			itemsContainer.innerHTML = '<div class="checkout-summary__empty">Your cart is empty. Add items to continue.</div>';
			subtotalEl.textContent = this.formatCurrency(0);
			taxEl.textContent = this.formatCurrency(0);
			totalEl.textContent = this.formatCurrency(0);
			if (placeOrderBtn) {
				placeOrderBtn.disabled = true;
			}
			return;
		}

		itemsContainer.innerHTML = this.items.map(item => {
			const imageUrl = this.buildImageUrl(item.title);
			return `
				<div class="checkout-summary__item">
					<img src="${imageUrl}" alt="${item.title}">
					<div>
						<p class="checkout-summary__name">${item.title}</p>
						<p class="checkout-summary__meta">Qty: ${item.quantity}</p>
					</div>
					<div class="checkout-summary__price">${this.formatCurrency(item.price * item.quantity)}</div>
				</div>
			`;
		}).join('');

		subtotalEl.textContent = this.formatCurrency(this.getSubtotal());
		taxEl.textContent = this.formatCurrency(this.getTax());
		totalEl.textContent = this.formatCurrency(this.getTotal());

		if (placeOrderBtn) {
			placeOrderBtn.disabled = false;
		}
	}

	attachPlaceOrder() {
		const placeOrderBtn = document.getElementById('place-order');
		if (!placeOrderBtn) return;

		placeOrderBtn.addEventListener('click', () => {
			if (this.items.length === 0) return;
			localStorage.removeItem('cart');
			this.items = [];
			this.renderSummary();
			this.updateCartBadge();
			alert('Order placed! This is a demo checkout with no actual charges.');
		});
	}
}

new CheckoutPage();
