const productCards = document.querySelectorAll('.product-card[data-category]');

productCards.forEach(card => {
	card.addEventListener('click', (event) => {
		if (event.target.closest('button, a')) {
			return;
		}

		const category = card.getAttribute('data-category');
		if (category) {
			window.location.href = `products.html?category=${encodeURIComponent(category)}`;
		}
	});
});

const preloader = document.querySelector('.preloader');

if (preloader) {
	window.addEventListener('load', () => {
		preloader.classList.add('preloader--hidden');
		setTimeout(() => {
			preloader.remove();
		}, 400);
	});
}
