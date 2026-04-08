/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

		// Function to navigate between articles
		function navigateArticle(direction) {
			var sections = ['about', 'exp', 'projects', 'contact'];
			var currentHash = window.location.hash.replace('#', '');
			var currentIndex = sections.indexOf(currentHash);
	
			if (currentIndex !== -1) {
				currentIndex += direction;
				if (currentIndex >= sections.length) currentIndex = 0;
				if (currentIndex < 0) currentIndex = sections.length - 1;
	
				window.location.hash = sections[currentIndex];
			}
		}
	
		// Event handler for full window click
		$(window).on('click', function(event) {
			var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	
			if (event.clientX < width / 2) {
				// Clicked on the left side
				navigateArticle(-1); // Navigate to the previous section
			} else {
				// Clicked on the right side
				navigateArticle(1); // Navigate to the next section
			}
		});
	
		// Event handlers for existing navigation buttons
		$('.nav-right').on('click', function() {
			navigateArticle(1); // Navigate to the next article
		});
	
		$('.nav-left').on('click', function() {
			navigateArticle(-1); // Navigate to the previous article
		});
		
})(jQuery);
// Code Rain with cursor repulsion
(function() {
  const canvas = document.getElementById('code-rain');
  const ctx = canvas.getContext('2d');
  let width, height;
  let mouseX = -100, mouseY = -100;
  const columns = [];
  const fontSize = 16;
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');
  let frame = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const colCount = Math.ceil(width / fontSize);
    columns.length = 0;
    for (let i = 0; i < colCount; i++) {
      columns.push({
        x: i * fontSize,
        y: Math.random() * height,
        speed: 1 + Math.random() * 3,
        chars: []
      });
    }
  }
  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#0f0';
    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    columns.forEach(col => {
      // Cursor repulsion: if mouse is close, push column sideways
      const dx = col.x - mouseX;
      const dy = col.y - mouseY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      let offsetX = 0;
      if (dist < 120) {
        offsetX = (dx / dist) * (120 - dist) * 0.5;
      }
      const drawX = col.x + offsetX;

      // Random character
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, drawX, col.y);

      // Move down
      col.y += col.speed;
      if (col.y > height + 50) {
        col.y = -20;
        col.speed = 1 + Math.random() * 3;
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
})();
// ============================================
// CURSOR CLICK EXPLOSION (Binary Burst)
// ============================================
(function() {
    const canvas = document.getElementById('explosion-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const chars = '01'.split('');

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 12;
            this.vy = (Math.random() - 0.5) * 12;
            this.char = chars[Math.floor(Math.random() * chars.length)];
            this.life = 1.0;
            this.decay = 0.008 + Math.random() * 0.01;
            this.size = 14 + Math.floor(Math.random() * 8);
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.15; // gravity
            this.vx *= 0.99;
            this.life -= this.decay;
        }
        draw(ctx) {
            ctx.font = `${this.size}px 'JetBrains Mono', monospace`;
            ctx.fillStyle = `rgba(0, 255, 0, ${this.life})`;   
            ctx.fillText(this.char, this.x, this.y);
        }
    }

    document.addEventListener('click', (e) => {
        for (let i = 0; i < 40; i++) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
        requestAnimationFrame(animate);
    }
    animate();
})();
document.addEventListener('DOMContentLoaded', function() {

// ============================================
// INTERACTIVE FILE EXPLORER (Draggable Window)
// ============================================
(function() {
    const explorer = document.getElementById('file-explorer');
    const openBtn = document.getElementById('open-explorer-btn');
    const closeBtn = document.getElementById('explorer-close');
    const minimizeBtn = document.getElementById('explorer-minimize');
    const header = document.getElementById('explorer-header');
    const statusEl = document.getElementById('explorer-selection');
    
    if (!explorer || !openBtn) return;

    // ---- Open / Close / Minimize ----
    openBtn.addEventListener('click', () => {
        explorer.style.display = 'block';
        if (explorer.classList.contains('minimized')) {
            explorer.classList.remove('minimized');
        }
    });

    closeBtn.addEventListener('click', () => {
        explorer.style.display = 'none';
    });

    minimizeBtn.addEventListener('click', () => {
        explorer.classList.toggle('minimized');
    });

    // ---- File Item Interaction ----
    const fileItems = document.querySelectorAll('.file-item');
    let selectedItem = null;

    fileItems.forEach(item => {
        // Single click: select
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            // Remove previous selection
            if (selectedItem) {
                selectedItem.classList.remove('selected');
            }
            item.classList.add('selected');
            selectedItem = item;
            const name = item.querySelector('.file-name')?.textContent || 'Item';
            statusEl.textContent = `Selected: ${name}`;
        });

        // Double click: open
        item.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const url = item.dataset.url;
            const type = item.dataset.type;
            if (url) {
                if (type === 'download') {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } else {
                    window.open(url, '_blank');
                }
            }
        });
    });

    // Click outside to deselect? (optional)
    document.addEventListener('click', () => {
        if (selectedItem) {
            selectedItem.classList.remove('selected');
            selectedItem = null;
            statusEl.textContent = 'No item selected';
        }
    });

    // ---- Dragging Functionality ----
    let isDragging = false;
    let startX, startY, initialX, initialY;

    function onMouseDown(e) {
        // Only drag from header
        if (!header.contains(e.target)) return;
        e.preventDefault();
        isDragging = true;
        
        const rect = explorer.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialX = rect.left;
        initialY = rect.top;
        
        explorer.style.transition = 'none';
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        let newX = initialX + dx;
        let newY = initialY + dy;
        
        // Keep window within viewport bounds
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const elWidth = explorer.offsetWidth;
        const elHeight = explorer.offsetHeight;
        
        newX = Math.max(0, Math.min(newX, winWidth - elWidth));
        newY = Math.max(0, Math.min(newY, winHeight - elHeight));
        
        explorer.style.left = newX + 'px';
        explorer.style.top = newY + 'px';
        explorer.style.transform = 'none';
    }

    function onMouseUp() {
        isDragging = false;
        explorer.style.transition = '';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }

    header.addEventListener('mousedown', onMouseDown);

    // Prevent drag from interfering with buttons
    document.querySelectorAll('.explorer-btn').forEach(btn => {
        btn.addEventListener('mousedown', (e) => e.stopPropagation());
    });

    // ---- Close with Escape key ----
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && explorer.style.display === 'block') {
            explorer.style.display = 'none';
        }
    });

    // ---- Ensure window stays on top when clicked ----
    explorer.addEventListener('mousedown', () => {
        explorer.style.zIndex = '2001';
        setTimeout(() => explorer.style.zIndex = '2000', 100);
    });

})();
});