// Products data
const products = [
	{
		id: 1,
		title: 'Tactical IWB Holster',
		category: 'holsters',
		price: 49.99,
		rating: 4,
		reviews: 434
	},
	{
		id: 2,
		title: 'Red Dot Reflex Sight',
		category: 'scopes',
		price: 189.99,
		rating: 5,
		reviews: 567
	},
	{
		id: 3,
		title: 'Universal Cleaning Kit Pro',
		category: 'cleaning-kits',
		price: 39.99,
		rating: 5,
		reviews: 792
	},
	{
		id: 4,
		title: 'Paper Target Pack - 100pcs',
		category: 'targets',
		price: 24.99,
		rating: 4,
		reviews: 331
	},
	{
		id: 5,
		title: 'Tactical Ear Protection',
		category: 'safety-gear',
		price: 79.99,
		rating: 4,
		reviews: 778
	},
	{
		id: 6,
		title: 'OWB Paddle Holster',
		category: 'holsters',
		price: 59.99,
		rating: 5,
		reviews: 456
	},
	{
		id: 7,
		title: 'Variable Magnification Scope 3-9x40',
		category: 'scopes',
		price: 249.99,
		rating: 4,
		reviews: 352
	},
	{
		id: 8,
		title: 'Bore Snake Cleaner',
		category: 'cleaning-kits',
		price: 14.99,
		rating: 4,
		reviews: 1234
	},
	{
		id: 9,
		title: 'Steel Target Gong Set',
		category: 'targets',
		price: 149.99,
		rating: 4,
		reviews: 617
	},
	{
		id: 10,
		title: 'Ballistic Safety Glasses',
		category: 'safety-gear',
		price: 34.99,
		rating: 5,
		reviews: 567
	},
	{
		id: 11,
		title: 'Chest Holster Rig',
		category: 'holsters',
		price: 89.99,
		rating: 4,
		reviews: 458
	},
	{
		id: 12,
		title: 'Night Vision Scope',
		category: 'scopes',
		price: 599.99,
		rating: 4,
		reviews: 156
	}
];

// Filter state
let currentFilters = {
	category: 'all',
	priceMax: 600,
	minRating: 'all'
};

// DOM elements
const categoryRadios = document.querySelectorAll('input[name="category"]');
const ratingRadios = document.querySelectorAll('input[name="rating"]');
const priceSlider = document.getElementById('price-min');
const priceDisplay = document.getElementById('price-display');
const resetButton = document.getElementById('reset-filters');
const productCount = document.getElementById('product-count');

// Event listeners
categoryRadios.forEach(radio => {
	radio.addEventListener('change', (e) => {
		currentFilters.category = e.target.value;
		filterProducts();
	});
});

ratingRadios.forEach(radio => {
	radio.addEventListener('change', (e) => {
		currentFilters.minRating = e.target.value;
		filterProducts();
	});
});

priceSlider.addEventListener('input', (e) => {
	const value = parseInt(e.target.value);
	currentFilters.priceMax = value;
	priceDisplay.textContent = value;
	filterProducts();
});

resetButton.addEventListener('click', resetFilters);

function filterProducts() {
	const filtered = products.filter(product => {
		// Category filter
		if (currentFilters.category !== 'all' && product.category !== currentFilters.category) {
			return false;
		}

		// Price filter
		if (product.price > currentFilters.priceMax) {
			return false;
		}

		// Rating filter
		if (currentFilters.minRating !== 'all') {
			if (currentFilters.minRating === '4plus' && product.rating < 4) return false;
			if (currentFilters.minRating === '45plus' && product.rating < 4.5) return false;
			if (currentFilters.minRating === '48plus' && product.rating < 4.8) return false;
		}

		return true;
	});

	updateProductCount(filtered.length);
	highlightMatchingProducts(filtered);
}

function updateProductCount(count) {
	productCount.textContent = count;
}

function highlightMatchingProducts(filtered) {
	const filteredIds = filtered.map(p => p.id);
	const cards = document.querySelectorAll('.product-card');
	
	cards.forEach(card => {
		const title = card.querySelector('.product-card__title').textContent;
		const product = products.find(p => p.title === title);
		
		if (product && filteredIds.includes(product.id)) {
			card.classList.remove('hidden');
		} else {
			card.classList.add('hidden');
		}
	});
}

function resetFilters() {
	currentFilters = {
		category: 'all',
		priceMax: 600,
		minRating: 'all'
	};

	// Reset radio buttons
	const categoryAll = document.querySelector('input[name="category"][value="all"]');
	const ratingAll = document.querySelector('input[name="rating"][value="all"]');
	
	categoryAll.checked = true;
	ratingAll.checked = true;
	
	priceSlider.value = 600;
	priceDisplay.textContent = '600';

	filterProducts();
}

function applyCategoryFromUrl() {
	const params = new URLSearchParams(window.location.search);
	const category = params.get('category');

	if (!category) {
		return;
	}

	const matchingRadio = document.querySelector(`input[name="category"][value="${category}"]`);
	if (matchingRadio) {
		matchingRadio.checked = true;
		currentFilters.category = category;
	}
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
	applyCategoryFromUrl();
	filterProducts();
	initializeAddToCart();
});

// Cart management functions
function loadCart() {
	const saved = localStorage.getItem('cart');
	return saved ? JSON.parse(saved) : [];
}

function saveCart(cart) {
	localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
	let cart = loadCart();
	const existingItem = cart.find(item => item.id === product.id);
	
	if (existingItem) {
		existingItem.quantity += 1;
	} else {
		cart.push({
			...product,
			quantity: 1
		});
	}
	
	saveCart(cart);
	updateCartBadge();
	showNotification(`${product.title} added to cart!`);
}

function updateCartBadge() {
	const cart = loadCart();
	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
	const badge = document.getElementById('cart-badge');
	if (badge) {
		badge.textContent = totalItems;
		badge.style.display = totalItems > 0 ? 'flex' : 'none';
	}
}

function showNotification(message) {
	// Remove existing notification if any
	const existing = document.querySelector('.cart-notification');
	if (existing) {
		existing.remove();
	}
	
	// Create notification
	const notification = document.createElement('div');
	notification.className = 'cart-notification';
	notification.innerHTML = `
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		<span>${message}</span>
	`;
	
	document.body.appendChild(notification);
	
	// Trigger animation
	setTimeout(() => {
		notification.classList.add('cart-notification--show');
	}, 10);
	
	// Remove after 3 seconds
	setTimeout(() => {
		notification.classList.remove('cart-notification--show');
		setTimeout(() => {
			notification.remove();
		}, 300);
	}, 3000);
}

function initializeAddToCart() {
	const addButtons = document.querySelectorAll('.btn-add');
	addButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			const card = e.target.closest('.product-card');
			const productTitle = card.querySelector('.product-card__title').textContent;
			const priceText = card.querySelector('.product-card__price').textContent;
			const price = parseFloat(priceText.replace('$', ''));
			
			// Find the product from the products array
			const product = products.find(p => p.title === productTitle);
			
			if (product) {
				addToCart(product);
				
				// Visual feedback on button
				const originalText = button.textContent;
				button.textContent = '✓ Added';
				button.style.backgroundColor = '#10b981';
				
				setTimeout(() => {
					button.textContent = originalText;
					button.style.backgroundColor = '';
				}, 1500);
			}
		});
	});
}
