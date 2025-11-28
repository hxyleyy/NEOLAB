// Typewriter Animation
function typeWriter(element, text, speed = 100, callback) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Animation complete, show waitlist button
            if (callback) {
                setTimeout(callback, 500); // Small delay before showing button
            }
        }
    }
    
    type();
}

// Initialize typewriter when home section is visible
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const typewriterElement = document.getElementById('typewriter');
            const waitlistBtn = document.getElementById('waitlist-btn');
            
            // Show button after typewriter completes
            const showButton = () => {
                if (waitlistBtn) {
                    waitlistBtn.classList.add('visible');
                }
            };
            
            typeWriter(typewriterElement, 'COMING SOON…', 150, showButton);
            entry.target.dataset.animated = 'true';
        }
    });
}, observerOptions);

// Smooth Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.sticky-nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Product Data
const products = [
    {
        id: 1,
        name: 'CYCLE',
        category: 'earcuff',
        model: 'assets/CYCLE.glb',
    },
    {
        id: 2,
        name: 'TRISECTOR',
        category: 'necklace',
        model: 'assets/TRISECTOR.glb',
    },
    {
        id: 3,
        name: 'AMORIS',
        category: 'ring',
        model: 'assets/AMORIS.glb',
    },
    {
        id: 4,
        name: 'PERCEPTION',
        category: 'ring',
        model: 'assets/PERCEPTION.glb',
    },
    {
        id: 5,
        name: 'TERRESTRAIL',
        category: 'earcuff',
        model: 'assets/TERRESTRAIL.glb',
    },
    {
        id: 6,
        name: 'TRIBE',
        category: 'ring',
        model: 'assets/TRIBE.glb',
    },
    {
        id: 7,
        name: 'CRYSTALLINE',
        category: 'others',
        model: 'assets/CRYSTALLINE.glb',
    },
    {
        id: 8,
        name: 'METAVERSE',
        category: 'bracelet',
        model: 'assets/METAVERSE.glb',
    },
    {
        id: 9,
        name: 'DYSTOPIAN',
        category: 'others',
        model: 'assets/DYSTOPIAN.glb',
    }
];

// Generate Product Cards
function generateProductCards(productsToShow) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-3d">
                <model-viewer 
                    src="${product.model}" 
                    alt="${product.name}"
                    camera-controls
                    interaction-policy="allow-when-focused"
                    auto-rotate
                    style="width: 100%; height: 100%; background-color: #000000;">
                </model-viewer>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Category Filtering
let currentCategory = 'all';

function filterProducts(category) {
    currentCategory = category;
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    generateProductCards(filteredProducts);
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

// Initialize filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filterProducts(btn.dataset.category);
    });
});

// Initialize behaviors on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typewriter observer
    const homeSection = document.getElementById('home');
    if (homeSection) {
        typewriterObserver.observe(homeSection);
    }
    
    // Initialize products
    generateProductCards(products);
    
    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', formData);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Set active nav link on scroll
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function setActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const navHeight = document.querySelector('.sticky-nav').offsetHeight;
            
            if (window.pageYOffset >= sectionTop - navHeight - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    setActiveNavLink();

    // ABOUT canvas sword sequence
    const aboutCanvas = document.getElementById('about-sequence-canvas');
    if (aboutCanvas) {
        const ctx = aboutCanvas.getContext('2d');
        const config = {
            frameCount: 132,
            startIndex: 60,
            basePath: 'assets/sequence/',
            prefix: 'Sword_',
            extension: '.png'
        };

        const images = new Array(config.frameCount);
        let loadedImages = 0;
        let currentFrame = 0;
        let scheduledRender = false;
        let hasRenderedInitialFrame = false;
        let imageAspect = 16 / 9; // will be updated once first image loads

        const getFramePath = (frameNumber) => {
            const absoluteFrame = config.startIndex + frameNumber;
            return `${config.basePath}${config.prefix}${String(absoluteFrame).padStart(5, '0')}${config.extension}`;
        };

        const requestRender = () => {
            if (scheduledRender) return;
            scheduledRender = true;
            requestAnimationFrame(() => {
                scheduledRender = false;
                renderFrame(currentFrame);
            });
        };

        const resizeCanvas = () => {
            const rect = aboutCanvas.getBoundingClientRect();
            const clientWidth = rect.width || aboutCanvas.parentElement?.clientWidth || 0;
            const clientHeight = clientWidth > 0 ? (clientWidth / imageAspect) : 0;
            const pixelRatio = window.devicePixelRatio || 1;

            aboutCanvas.width = clientWidth * pixelRatio;
            aboutCanvas.height = clientHeight * pixelRatio;

            // Ensure the canvas element itself uses the same height in CSS pixels
            if (clientHeight > 0) {
                aboutCanvas.style.height = `${clientHeight}px`;
            }

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(pixelRatio, pixelRatio);
            requestRender();
        };

        const renderFrame = (frameIndex) => {
            const image = images[frameIndex];
            if (!image || !image.complete) return;

            const rect = aboutCanvas.getBoundingClientRect();
            const canvasWidth = rect.width || aboutCanvas.width;
            const canvasHeight = rect.height || aboutCanvas.height;

            // Preserve original image aspect ratio, letterboxed inside canvas
            const imgAspect = image.naturalWidth / image.naturalHeight || imageAspect;
            const canvasAspect = canvasWidth / canvasHeight;

            let drawWidth, drawHeight;
            if (canvasAspect > imgAspect) {
                // Canvas is wider than image: fit height, center horizontally
                drawHeight = canvasHeight;
                drawWidth = drawHeight * imgAspect;
            } else {
                // Canvas is taller than image: fit width, center vertically
                drawWidth = canvasWidth;
                drawHeight = drawWidth / imgAspect;
            }

            const offsetX = (canvasWidth - drawWidth) / 2;
            const offsetY = (canvasHeight - drawHeight) / 2;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        };

        const updateFrameFromScroll = () => {
            const aboutSection = document.getElementById('about');
            if (!aboutSection) return;

            const rect = aboutSection.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            // When section is not in view at all, clamp to first/last frame
            if (rect.bottom <= 0) {
                // Scrolled past above the section
                if (currentFrame !== 0) {
                    currentFrame = 0;
                    requestRender();
                }
                return;
            }

            if (rect.top >= windowHeight) {
                // Section is completely below viewport
                if (currentFrame !== config.frameCount - 1) {
                    currentFrame = config.frameCount - 1;
                    requestRender();
                }
                return;
            }

            // Map scroll progress while ABOUT is intersecting the viewport
            // Progress 0 when top of ABOUT hits bottom of viewport
            // Progress 1 when bottom of ABOUT hits top of viewport
            const totalDistance = rect.height + windowHeight;
            const distanceTravelled = windowHeight - rect.top; 
            let scrollProgress = distanceTravelled / totalDistance;
            scrollProgress = Math.max(0, Math.min(1, scrollProgress));

            const targetFrame = Math.min(
                config.frameCount - 1,
                Math.floor(scrollProgress * (config.frameCount - 1))
            );

            if (targetFrame !== currentFrame) {
                currentFrame = targetFrame;
                requestRender();
            }
        };

        const handleImageLoad = () => {
            loadedImages += 1;

            // When the very first frame finishes loading, capture its true aspect ratio
            if (!hasRenderedInitialFrame && images[0]?.complete) {
                if (images[0].naturalWidth && images[0].naturalHeight) {
                    imageAspect = images[0].naturalWidth / images[0].naturalHeight;
                }
                hasRenderedInitialFrame = true;
                resizeCanvas();
                renderFrame(0);
            }

            if (loadedImages === config.frameCount) {
                resizeCanvas();
                renderFrame(currentFrame);
                window.addEventListener('scroll', updateFrameFromScroll, { passive: true });
                window.addEventListener('resize', resizeCanvas);
                updateFrameFromScroll();
            }
        };

        resizeCanvas();

        for (let i = 0; i < config.frameCount; i++) {
            const img = new Image();
            img.decoding = 'async';
            img.src = getFramePath(i);
            img.onload = handleImageLoad;
            img.onerror = handleImageLoad;
            images[i] = img;
        }
    }
});

