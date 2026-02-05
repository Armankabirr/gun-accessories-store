class CheckoutPage {
	constructor() {
		this.items = this.loadCart();
		this.taxRate = 0.08;
		this.validationRules = {
			firstName: { required: true, minLength: 2, message: 'Enter a valid first name' },
			lastName: { required: true, minLength: 2, message: 'Enter a valid last name' },
			email: { required: true, email: true, message: 'Enter a valid email address' },
			phone: { required: true, phone: true, message: 'Enter a valid phone number (format: (555) 123-4567)' },
			street: { required: true, minLength: 5, message: 'Enter a valid street address' },
			city: { required: true, minLength: 2, message: 'Enter a valid city name' },
			state: { required: true, minLength: 2, message: 'Enter a valid state' },
			zip: { required: true, zip: true, message: 'Enter a valid ZIP code' },
			cardNumber: { required: true, cardNumber: true, message: 'Enter a valid card number (16 digits)' },
			cardName: { required: true, minLength: 3, message: 'Enter cardholder name' },
			expiry: { required: true, expiry: true, message: 'Enter expiry date (MM/YY)' },
			cvv: { required: true, cvv: true, message: 'Enter a valid CVV (3-4 digits)' }
		};
		this.init();
	}

	init() {
		this.renderSummary();
		this.updateCartBadge();
		this.attachPlaceOrder();
		this.attachFieldValidation();
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

	attachFieldValidation() {
		const form = document.getElementById('checkout-form');
		if (!form) return;

		const inputs = form.querySelectorAll('input');
		inputs.forEach(input => {
			input.addEventListener('blur', () => this.validateField(input));
			input.addEventListener('input', () => {
				if (input.classList.contains('input-error')) {
					this.validateField(input);
				}
			});
		});
	}

	validateField(input) {
		const fieldName = input.name;
		const rules = this.validationRules[fieldName];
		if (!rules) return true;

		const value = input.value.trim();
		let errorMessage = '';

		if (rules.required && value === '') {
			errorMessage = `${this.getFieldLabel(fieldName)} is required`;
		} else if (value !== '' && rules.minLength && value.length < rules.minLength) {
			errorMessage = rules.message;
		} else if (value !== '' && rules.email && !this.isValidEmail(value)) {
			errorMessage = rules.message;
		} else if (value !== '' && rules.phone && !this.isValidPhone(value)) {
			errorMessage = rules.message;
		} else if (value !== '' && rules.zip && !this.isValidZip(value)) {
			errorMessage = rules.message;
		} else if (value !== '' && rules.cardNumber && !this.isValidCardNumber(value)) {
			errorMessage = rules.message;
		} else if (value !== '' && rules.expiry && !this.isValidExpiry(value)) {
			errorMessage = rules.message;
		} else if (value !== '' && rules.cvv && !this.isValidCVV(value)) {
			errorMessage = rules.message;
		}

		this.setFieldError(input, errorMessage);
		return errorMessage === '';
	}

	setFieldError(input, errorMessage) {
		const errorEl = document.getElementById(`error-${input.name}`);
		if (!errorEl) return;

		if (errorMessage) {
			input.classList.add('input-error');
			errorEl.textContent = errorMessage;
			errorEl.classList.add('field-error--show');
		} else {
			input.classList.remove('input-error');
			errorEl.textContent = '';
			errorEl.classList.remove('field-error--show');
		}
	}

	getFieldLabel(fieldName) {
		const labels = {
			firstName: 'First Name',
			lastName: 'Last Name',
			email: 'Email Address',
			phone: 'Phone Number',
			street: 'Street Address',
			city: 'City',
			state: 'State',
			zip: 'ZIP Code',
			cardNumber: 'Card Number',
			cardName: 'Cardholder Name',
			expiry: 'Expiry Date',
			cvv: 'CVV'
		};
		return labels[fieldName] || fieldName;
	}

	isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	isValidPhone(phone) {
		return /^[\d\s\-\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length === 10;
	}

	isValidZip(zip) {
		return /^\d{5}(-\d{4})?$/.test(zip);
	}

	isValidCardNumber(cardNumber) {
		const digits = cardNumber.replace(/\D/g, '');
		return digits.length === 16;
	}

	isValidExpiry(expiry) {
		return /^\d{2}\/\d{2}$/.test(expiry);
	}

	isValidCVV(cvv) {
		const digits = cvv.replace(/\D/g, '');
		return digits.length === 3 || digits.length === 4;
	}

	validateAllFields() {
		const form = document.getElementById('checkout-form');
		if (!form) return false;

		const inputs = form.querySelectorAll('input');
		let isValid = true;

		inputs.forEach(input => {
			if (!this.validateField(input)) {
				isValid = false;
			}
		});

		return isValid;
	}

	attachPlaceOrder() {
		const placeOrderBtn = document.getElementById('place-order');
		if (!placeOrderBtn) return;

		placeOrderBtn.addEventListener('click', (e) => {
			e.preventDefault();

			if (this.items.length === 0) {
				alert('Your cart is empty. Add items to continue.');
				return;
			}

			if (!this.validateAllFields()) {
				alert('Please fix the errors in the form and try again.');
				return;
			}

			// Get email from form
			const form = document.getElementById('checkout-form');
			const emailInput = form.querySelector('input[name="email"]');
			const email = emailInput ? emailInput.value : 'customer@email.com';

			// Generate order number
			const orderNumber = this.generateOrderNumber();

			// Show confirmation modal
			this.showConfirmation(email, orderNumber);

			// Clear cart
			localStorage.removeItem('cart');
			this.items = [];
			this.renderSummary();
			this.updateCartBadge();
		});
	}

	generateOrderNumber() {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let orderNumber = '#';
		for (let i = 0; i < 8; i++) {
			orderNumber += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return orderNumber;
	}

	showConfirmation(email, orderNumber) {
		const modal = document.getElementById('confirmation-modal');
		const emailEl = document.getElementById('confirmation-email');
		const orderIdEl = document.getElementById('confirmation-order-id');

		if (!modal || !emailEl || !orderIdEl) return;

		// Update confirmation details
		emailEl.textContent = email;
		orderIdEl.textContent = orderNumber;

		// Show modal with animation
		modal.classList.add('confirmation-modal--show');

		// Disable scrolling
		document.body.style.overflow = 'hidden';
	}

}

new CheckoutPage();
