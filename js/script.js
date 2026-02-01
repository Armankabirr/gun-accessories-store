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

const scrollTopButton = document.querySelector('.scroll-top');

if (scrollTopButton) {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const toggleScrollTopButton = () => {
		if (window.scrollY > 400) {
			scrollTopButton.classList.add('scroll-top--visible');
		} else {
			scrollTopButton.classList.remove('scroll-top--visible');
		}
	};

	window.addEventListener('scroll', toggleScrollTopButton, { passive: true });
	window.addEventListener('load', toggleScrollTopButton);

	scrollTopButton.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: prefersReducedMotion ? 'auto' : 'smooth'
		});
	});
}
