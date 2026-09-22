(function () {
	'use strict';

	document.body.classList.remove('is-loading');
	var year = document.getElementById('year');
	if (year) year.textContent = new Date().getFullYear();

	var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ---------- Nav scroll state ---------- */
	var nav = document.getElementById('site-nav');
	var onScroll = function () {
		if (window.scrollY > 20) nav.classList.add('is-scrolled');
		else nav.classList.remove('is-scrolled');
	};
	document.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	/* ---------- Mobile menu ---------- */
	var toggle = document.getElementById('nav-toggle');
	var menu = document.getElementById('mobile-menu');
	toggle.addEventListener('click', function () {
		var open = toggle.classList.toggle('is-open');
		menu.classList.toggle('is-open', open);
		toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
	});
	menu.querySelectorAll('a').forEach(function (link) {
		link.addEventListener('click', function () {
			toggle.classList.remove('is-open');
			menu.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
		});
	});

	/* ---------- Scrollspy ---------- */
	var navLinks = document.querySelectorAll('a[data-nav]');
	var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
	var spy = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (!entry.isIntersecting) return;
			navLinks.forEach(function (link) {
				var match = link.getAttribute('href') === '#' + entry.target.id;
				link.classList.toggle('is-active', match);
			});
		});
	}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
	sections.forEach(function (s) { spy.observe(s); });

	/* ---------- Reveal on scroll ---------- */
	var revealEls = document.querySelectorAll('.reveal');
	if (prefersReducedMotion) {
		revealEls.forEach(function (el) { el.classList.add('in-view'); });
	} else {
		var revealObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry, i) {
				if (entry.isIntersecting) {
					var el = entry.target;
					setTimeout(function () { el.classList.add('in-view'); }, (i % 4) * 70);
					revealObserver.unobserve(el);
				}
			});
		}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
		revealEls.forEach(function (el) { revealObserver.observe(el); });
	}

	/* ---------- Typing effect ---------- */
	var typeTarget = document.getElementById('type-target');
	var phrases = ['Full-Stack Developer', 'Systems Enthusiast', 'EECS @ UC Berkeley'];

	if (prefersReducedMotion) {
		typeTarget.textContent = phrases[0];
	} else {
		(function type() {
			var phraseIndex = 0, charIndex = 0, deleting = false;

			function tick() {
				var current = phrases[phraseIndex];
				if (!deleting) {
					charIndex++;
					typeTarget.textContent = current.slice(0, charIndex);
					if (charIndex === current.length) {
						deleting = true;
						return setTimeout(tick, 1800);
					}
				} else {
					charIndex--;
					typeTarget.textContent = current.slice(0, charIndex);
					if (charIndex === 0) {
						deleting = false;
						phraseIndex = (phraseIndex + 1) % phrases.length;
					}
				}
				setTimeout(tick, deleting ? 35 : 65);
			}
			tick();
		})();
	}

	/* ---------- Particle network backdrop ---------- */
	var canvas = document.getElementById('net');
	if (canvas && !prefersReducedMotion) {
		var ctx = canvas.getContext('2d');
		var particles = [];
		var width, height, dpr = Math.min(window.devicePixelRatio || 1, 2);

		function resize() {
			width = canvas.width = window.innerWidth * dpr;
			height = canvas.height = window.innerHeight * dpr;
			canvas.style.width = window.innerWidth + 'px';
			canvas.style.height = window.innerHeight + 'px';
			var count = Math.round((window.innerWidth * window.innerHeight) / 26000);
			particles = [];
			for (var i = 0; i < count; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * 0.25 * dpr,
					vy: (Math.random() - 0.5) * 0.25 * dpr
				});
			}
		}

		function step() {
			ctx.clearRect(0, 0, width, height);
			var maxDist = 140 * dpr;

			for (var i = 0; i < particles.length; i++) {
				var p = particles[i];
				p.x += p.vx; p.y += p.vy;
				if (p.x < 0 || p.x > width) p.vx *= -1;
				if (p.y < 0 || p.y > height) p.vy *= -1;

				for (var j = i + 1; j < particles.length; j++) {
					var q = particles[j];
					var dx = p.x - q.x, dy = p.y - q.y;
					var dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < maxDist) {
						ctx.strokeStyle = 'rgba(139,124,255,' + (0.16 * (1 - dist / maxDist)) + ')';
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(q.x, q.y);
						ctx.stroke();
					}
				}

				ctx.fillStyle = 'rgba(69,224,200,0.45)';
				ctx.beginPath();
				ctx.arc(p.x, p.y, 1.4 * dpr, 0, Math.PI * 2);
				ctx.fill();
			}
			requestAnimationFrame(step);
		}

		var resizeTimer;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(resize, 150);
		});

		resize();
		requestAnimationFrame(step);
	}
})();
