/**
 * ==============================================
 * 3D IMMERSIVE WEBSITE
 * Award-Winning Interactive Design
 * ==============================================
 */

// ========== SCENE SETUP ==========
let scene, camera, renderer, particles;

function initThreeScene() {
    const canvas = document.getElementById('canvas');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 30;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create particle system
    createParticles();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Animation loop
    animate();
}

function createParticles() {
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        color: 0x8B5CF6,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate particles
    if (particles) {
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0002;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Initialize Three.js scene when DOM is ready
document.addEventListener('DOMContentLoaded', initThreeScene);

// ========== NAVIGATION & SCROLL ==========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll function
function scrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========== SCROLL ANIMATIONS ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all section headers
document.querySelectorAll('.section-header').forEach(el => {
    observer.observe(el);
});

// ========== PARALLAX EFFECT ==========
document.addEventListener('mousemove', (e) => {
    const floatingBoxes = document.querySelectorAll('.floating-box');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    floatingBoxes.forEach((box, index) => {
        const moveX = (x - 0.5) * (index + 1) * 20;
        const moveY = (y - 0.5) * (index + 1) * 20;
        box.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// ========== FORM HANDLING ==========
const contactForm = document.querySelector('.contact-form');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: contactForm.elements[0].value,
        email: contactForm.elements[1].value,
        message: contactForm.elements[2].value
    };

    // Show success message
    const button = contactForm.querySelector('.submit-button');
    const originalText = button.textContent;
    button.textContent = '✓ Message Sent!';
    button.style.background = 'var(--accent-2)';

    // Reset form
    contactForm.reset();

    // Restore button after 3 seconds
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 3000);
});

// ========== SCROLL PROGRESS INDICATOR ==========
window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-progress', scrolled + '%');
});

// ========== INTERACTIVE CARD EFFECTS ==========
const cards = document.querySelectorAll('.showcase-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ========== DYNAMIC TEXT COLOR ON SCROLL ==========
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero');
    const scrollProgress = window.scrollY / (heroSection?.offsetHeight || 1);

    if (scrollProgress < 1) {
        const color = `rgba(139, 92, 246, ${0.3 + scrollProgress * 0.4})`;
        if (particles && particles.material) {
            particles.material.opacity = 0.3 + scrollProgress * 0.4;
        }
    }
});

// ========== PERFORMANCE OPTIMIZATION ==========
// Lazy load images and defer non-critical resources
if ('IntersectionObserver' in window) {
    const lazyLoad = (element) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        });
        return observer;
    };
}

// ========== ACCESSIBILITY ENHANCEMENTS ==========
// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu?.classList.remove('active');
    }
});

// Focus trap for mobile menu
function setupFocusTrap() {
    const focusableElements = navMenu?.querySelectorAll('a, button');
    if (focusableElements?.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        navMenu?.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    }
}

// ========== VIEWPORT DETECTION ==========
// Add viewport meta for better mobile experience
const viewport = document.querySelector('meta[name="viewport"]');
if (!viewport) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(meta);
}

// ========== SMOOTH ANIMATIONS WITH REQUESTANIMATIONFRAME ==========
let ticking = false;

function updateOnScroll() {
    const parallax = document.querySelectorAll('[data-parallax]');
    parallax.forEach(element => {
        const scrollPos = window.scrollY;
        const elementPos = element.offsetTop;
        const distance = scrollPos - elementPos;
        element.style.transform = `translateY(${distance * 0.5}px)`;
    });
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}, { passive: true });

// ========== PERFORMANCE MONITORING ==========
// Optional: Log performance metrics
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`%c⚡ Page Load Time: ${pageLoadTime}ms`, 'color: #8B5CF6; font-weight: bold;');
    });
}

// ========== TOUCH EVENTS FOR MOBILE ==========
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swiped left
        navMenu?.classList.remove('active');
    }
}

console.log('%c🎨 Welcome to the 3D Immersive Experience!', 'color: #8B5CF6; font-size: 16px; font-weight: bold;');
console.log('%cExplore, interact, and enjoy the journey.', 'color: #EC4899; font-size: 14px;');
