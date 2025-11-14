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

// Initialize products on page load
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
            const sectionHeight = section.clientHeight;
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
});

// Scroll-based rotation for about model
function setupAboutModelScroll() {
    const aboutModel = document.getElementById('about-model');
    const aboutSection = document.getElementById('about');
    
    if (!aboutModel || !aboutSection) return;
    
    // Wait for model to load
    aboutModel.addEventListener('load', () => {
        function updateModelRotation() {
            const rect = aboutSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const navHeight = document.querySelector('.sticky-nav')?.offsetHeight || 0;
            
            // Calculate scroll progress (0 to 1) when section is in viewport
            let scrollProgress = 0;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                // Section is in viewport
                const sectionStart = aboutSection.offsetTop - navHeight;
                const sectionHeight = rect.height;
                const scrollPosition = window.pageYOffset + (windowHeight / 2);
                
                // Calculate progress based on scroll position within section
                scrollProgress = Math.max(0, Math.min(1, (scrollPosition - sectionStart) / sectionHeight));
            }
            
            // Rotate model based on scroll (360 degrees total rotation)
            const rotationY = scrollProgress * 360;
            
            // Update model rotation using camera-orbit attribute
            aboutModel.setAttribute('camera-orbit', `${rotationY}deg 60deg 105%`);
        }
        
        // Update on scroll
        window.addEventListener('scroll', updateModelRotation, { passive: true });
        // Initial update
        updateModelRotation();
    });
}

// Handle 3D model loading errors gracefully
document.addEventListener('DOMContentLoaded', () => {
    const modelViewers = document.querySelectorAll('model-viewer');
    modelViewers.forEach(viewer => {
        viewer.addEventListener('error', (e) => {
            console.warn('3D model failed to load:', viewer.src);
            // You can add a placeholder image or message here
            viewer.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'width: 100%; height: 100%; background: #000000; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; font-family: "SF Mono", "Consolas", "Menlo", "Courier New", monospace; letter-spacing: 1px;';
            placeholder.textContent = '3D Model Preview';
            viewer.parentElement.appendChild(placeholder);
        });
    });
    
    // Setup scroll-based rotation for about model
    setupAboutModelScroll();
});

