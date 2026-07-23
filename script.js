// Navigation functionality
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavQuery = window.matchMedia('(max-width: 768px)');

function syncMobileMenuAccessibility() {
    const isClosedMobileMenu = mobileNavQuery.matches && !navMenu.classList.contains('active');
    navMenu.inert = isClosedMobileMenu;
    navMenu.setAttribute('aria-hidden', String(isClosedMobileMenu));
}

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    syncMobileMenuAccessibility();
}

navToggle.addEventListener('click', () => {
    const isOpening = !navMenu.classList.contains('active');
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpening));
    navToggle.setAttribute('aria-label', isOpening ? 'Close navigation menu' : 'Open navigation menu');
    syncMobileMenuAccessibility();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
        navToggle.focus();
    }
});

mobileNavQuery.addEventListener('change', () => {
    closeMobileMenu();
});

syncMobileMenuAccessibility();

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) {
            return;
        }

        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and project cards
const sections = document.querySelectorAll('section');
const projectCards = document.querySelectorAll('.project-card');
const skillItems = document.querySelectorAll('.skill-item');

[...sections, ...projectCards, ...skillItems].forEach(el => {
    el.classList.add('fade-in');
    el.classList.add('visible');
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const gridOverlay = document.querySelector('.grid-overlay');
    
    if (hero && !hero.classList.contains('home-hero') && scrolled < window.innerHeight) {
        const parallaxSpeed = scrolled * 0.5;
        if (heroContent) {
            heroContent.style.transform = `translateY(${parallaxSpeed}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
        if (gridOverlay) {
            gridOverlay.style.transform = `translate(${scrolled * 0.1}px, ${scrolled * 0.1}px)`;
        }
    }
});

// Project card interactions and expandable portal controls
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

projectCards.forEach(card => {
    const isPortal = card.classList.contains('project-portal');
    const portalToggle = card.querySelector('.portal-toggle');
    const portalVisual = card.querySelector('.portal-visual');
    const portalDepth = card.querySelector('.portal-depth');

    if (!isPortal) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    if (portalToggle) {
        portalToggle.addEventListener('click', () => {
            const willExpand = !card.classList.contains('is-expanded');

            projectCards.forEach(otherCard => {
                if (otherCard === card || !otherCard.classList.contains('project-portal')) return;
                otherCard.classList.remove('is-expanded');
                const otherToggle = otherCard.querySelector('.portal-toggle');
                if (otherToggle) {
                    otherToggle.setAttribute('aria-expanded', 'false');
                    const otherLabel = otherToggle.querySelector('.portal-toggle-label');
                    if (otherLabel) otherLabel.textContent = 'Explore layers';
                }
            });

            card.classList.toggle('is-expanded', willExpand);
            portalToggle.setAttribute('aria-expanded', String(willExpand));
            const toggleLabel = portalToggle.querySelector('.portal-toggle-label');
            if (toggleLabel) toggleLabel.textContent = willExpand ? 'Collapse layers' : 'Explore layers';
        });
    }

    // Homepage project portals use a stable staged composition. Pointer-driven
    // parent rotation can make nested 3D planes intersect in the compositor.
    if (portalVisual && portalDepth && !card.classList.contains('system-slide')) {
        portalVisual.addEventListener('pointermove', event => {
            if (reducedMotionQuery.matches || event.pointerType === 'touch') return;

            const bounds = portalVisual.getBoundingClientRect();
            const pointerX = (event.clientX - bounds.left) / bounds.width;
            const pointerY = (event.clientY - bounds.top) / bounds.height;
            const rotateY = (pointerX - 0.5) * 8;
            const rotateX = (0.5 - pointerY) * 6;

            portalDepth.style.setProperty('--portal-rotate-x', `${rotateX.toFixed(2)}deg`);
            portalDepth.style.setProperty('--portal-rotate-y', `${rotateY.toFixed(2)}deg`);
        });

        portalVisual.addEventListener('pointerleave', () => {
            portalDepth.style.removeProperty('--portal-rotate-x');
            portalDepth.style.removeProperty('--portal-rotate-y');
        });
    }

    card.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !card.classList.contains('is-expanded')) return;
        card.classList.remove('is-expanded');
        if (portalToggle) {
            portalToggle.setAttribute('aria-expanded', 'false');
            const toggleLabel = portalToggle.querySelector('.portal-toggle-label');
            if (toggleLabel) toggleLabel.textContent = 'Explore layers';
            portalToggle.focus();
        }
    });

    // Make entire card clickable if it has a project URL
    const projectUrl = card.getAttribute('data-project-url');
    if (projectUrl && !card.hasAttribute('data-carousel-slide')) {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on a link or button inside
            if (e.target.closest('a, button')) {
                return;
            }
            window.location.href = projectUrl;
        });
    }
});

// Selected systems horizontal carousel
function initProjectCarousel() {
    const carousel = document.querySelector('[data-project-carousel]');
    if (!carousel) return;

    const stage = carousel.closest('[data-project-stage]');
    const projectSection = carousel.closest('.project-stage');
    const viewport = carousel.querySelector('.systems-carousel-viewport');
    const track = carousel.querySelector('.systems-carousel-track');
    const slides = [...carousel.querySelectorAll('[data-carousel-slide]')];
    const dots = [...carousel.querySelectorAll('[data-carousel-dot]')];
    const previousButton = carousel.querySelector('[data-carousel-previous]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const currentLabel = document.querySelector('[data-carousel-current]');
    const totalLabel = document.querySelector('[data-carousel-total]');
    const introKicker = document.querySelector('[data-carousel-kicker]');
    const introTitle = document.querySelector('[data-carousel-title]');
    const introSummary = document.querySelector('[data-carousel-summary]');
    const viewSystemLink = document.querySelector('[data-carousel-link]');
    let selectedIndex = 0;
    let dragStartX = 0;
    let dragDistance = 0;
    let activePointerId = null;
    let isDragging = false;
    let didDrag = false;

    if (!viewport || !track || !slides.length) return;
    if (totalLabel) totalLabel.textContent = String(slides.length).padStart(2, '0');

    function updateSelection(index, direction = 0) {
        selectedIndex = (index + slides.length) % slides.length;
        stage?.setAttribute('data-stage-direction', direction < 0 ? 'previous' : 'next');
        projectSection?.setAttribute('data-active-project', String(selectedIndex + 1));
        track.style.setProperty('--stage-drag', '0px');

        slides.forEach((slide, slideIndex) => {
            const isSelected = slideIndex === selectedIndex;
            const relativePosition = (slideIndex - selectedIndex + slides.length) % slides.length;
            const carouselPosition = relativePosition === 0
                ? 'active'
                : relativePosition === 1
                    ? 'next'
                    : relativePosition === slides.length - 1
                        ? 'previous'
                        : 'far';
            slide.classList.toggle('is-selected', isSelected);
            slide.setAttribute('aria-current', String(isSelected));
            slide.setAttribute('aria-hidden', String(!isSelected));
            slide.toggleAttribute('inert', !isSelected);
            slide.dataset.carouselPosition = carouselPosition;
            const slideToggle = slide.querySelector('.portal-toggle');
            if (slideToggle) slideToggle.tabIndex = isSelected ? 0 : -1;
        });

        dots.forEach((dot, dotIndex) => {
            dot.setAttribute('aria-pressed', String(dotIndex === selectedIndex));
        });

        if (currentLabel) {
            currentLabel.textContent = String(selectedIndex + 1).padStart(2, '0');
        }

        const selectedSlide = slides[selectedIndex];
        const selectedTitle = selectedSlide.querySelector('.project-title')?.textContent.trim() || 'selected project';
        const selectedKicker = selectedSlide.dataset.carouselKicker || 'Selected system';
        const selectedSummary = selectedSlide.dataset.carouselSummary || selectedSlide.querySelector('.project-description')?.textContent.trim();
        const selectedUrl = selectedSlide.dataset.projectUrl;

        if (introKicker) introKicker.textContent = selectedKicker;
        if (introTitle) introTitle.textContent = selectedTitle;
        if (introSummary && selectedSummary) introSummary.textContent = selectedSummary;
        if (viewSystemLink && selectedUrl) {
            viewSystemLink.href = selectedUrl;
            viewSystemLink.setAttribute('aria-label', `View ${selectedTitle} project`);
        }

        selectedSlide.setAttribute('aria-label', `${selectedIndex + 1} of ${slides.length}: ${selectedTitle}`);
    }

    function showPrevious() {
        updateSelection(selectedIndex - 1, -1);
    }

    function showNext() {
        updateSelection(selectedIndex + 1, 1);
    }

    previousButton?.addEventListener('click', showPrevious);
    nextButton?.addEventListener('click', showNext);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const forwardDistance = (index - selectedIndex + slides.length) % slides.length;
            updateSelection(index, forwardDistance === slides.length - 1 ? -1 : 1);
        });
    });

    slides.forEach((slide, index) => {
        slide.addEventListener('click', event => {
            if (didDrag || event.target.closest('a, button')) return;
            if (index !== selectedIndex) updateSelection(index, 1);
        });
    });

    document.addEventListener('keydown', event => {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
        if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

        const carouselBounds = carousel.getBoundingClientRect();
        const carouselIsVisible = carouselBounds.top < window.innerHeight && carouselBounds.bottom > 0;
        if (!carouselIsVisible) return;

        event.preventDefault();
        if (event.key === 'ArrowLeft') showPrevious();
        if (event.key === 'ArrowRight') showNext();
    });

    viewport.addEventListener('pointerdown', event => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (event.target.closest('a, button')) return;
        isDragging = true;
        didDrag = false;
        dragDistance = 0;
        dragStartX = event.clientX;
        activePointerId = event.pointerId;
        viewport.classList.add('is-dragging');
        viewport.setPointerCapture(event.pointerId);
    });

    viewport.addEventListener('pointermove', event => {
        if (!isDragging || event.pointerId !== activePointerId) return;
        dragDistance = event.clientX - dragStartX;
        if (Math.abs(dragDistance) > 7) didDrag = true;
        const resistedDistance = Math.max(-220, Math.min(220, dragDistance * 0.72));
        track.style.setProperty('--stage-drag', `${resistedDistance}px`);
    });

    function finishDrag(event) {
        if (!isDragging || event.pointerId !== activePointerId) return;
        isDragging = false;
        activePointerId = null;
        viewport.classList.remove('is-dragging');
        if (viewport.hasPointerCapture(event.pointerId)) {
            viewport.releasePointerCapture(event.pointerId);
        }
        track.style.setProperty('--stage-drag', '0px');
        if (Math.abs(dragDistance) >= 64) {
            if (dragDistance < 0) showNext();
            if (dragDistance > 0) showPrevious();
        }
        window.setTimeout(() => { didDrag = false; }, 0);
    }

    viewport.addEventListener('pointerup', finishDrag);
    viewport.addEventListener('pointercancel', finishDrag);
    const requestedProject = Number(new URLSearchParams(window.location.search).get('project'));
    const initialIndex = Number.isInteger(requestedProject) && requestedProject >= 1 && requestedProject <= slides.length
        ? requestedProject - 1
        : 0;
    updateSelection(initialIndex, 1);

    // Re-align deep links after responsive layout and web fonts settle. Without
    // this pass, mobile browsers can stop inside the preceding experience
    // section because the anchor is resolved before its final height is known.
    if (window.location.hash === '#projects') {
        const alignProjectSection = () => projectSection?.scrollIntoView({ block: 'start' });
        requestAnimationFrame(() => requestAnimationFrame(alignProjectSection));
        document.fonts?.ready.then(alignProjectSection);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectCarousel);
} else {
    initProjectCarousel();
}

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Typewriter effect for code window
function initTypewriterEffect() {
    const codeContent = document.querySelector('.code-content');
    if (!codeContent) return;
    
    const codeElement = codeContent.querySelector('code');
    if (!codeElement) return;
    const isProjectPage = document.querySelector('.code-block') !== null;
    const isMainPage = document.querySelector('.code-window') !== null;
    const originalHTML = codeElement.innerHTML;
    codeElement.innerHTML = '';
    let codeSegments = [];
    if (isMainPage) {
        // Main page - portfolio object
        codeSegments = [
            { type: 'keyword', text: 'const' },
            { type: 'text', text: ' ' },
            { type: 'variable', text: 'portfolio' },
            { type: 'text', text: ' = {\n  ' },
            { type: 'property', text: 'name' },
            { type: 'text', text: ': ' },
            { type: 'string', text: "'AJ Mendes'" },
            { type: 'text', text: ',\n  ' },
            { type: 'property', text: 'focus' },
            { type: 'text', text: ': ' },
            { type: 'string', text: "'secure software'" },
            { type: 'text', text: ',\n  ' },
            { type: 'property', text: 'projects' },
            { type: 'text', text: ': ' },
            { type: 'text', text: '[' },
            { type: 'string', text: "'encrypted chat'" },
            { type: 'text', text: ', ' },
            { type: 'string', text: "'ClueGame'" },
            { type: 'text', text: '],\n  ' },
            { type: 'property', text: 'method' },
            { type: 'text', text: ': ' },
            { type: 'string', text: "'build, test, explain'" },
            { type: 'text', text: '\n};' }
        ];
    } else if (isProjectPage) {
        // Project page - encryption code
        codeSegments = [
            { type: 'keyword', text: 'from' },
            { type: 'text', text: ' ' },
            { type: 'variable', text: 'cryptography.hazmat.primitives' },
            { type: 'text', text: ' ' },
            { type: 'keyword', text: 'import' },
            { type: 'text', text: ' ' },
            { type: 'variable', text: 'hashes' },
            { type: 'text', text: '\n' },
            { type: 'keyword', text: 'from' },
            { type: 'text', text: ' ' },
            { type: 'variable', text: 'cryptography.hazmat.primitives.asymmetric' },
            { type: 'text', text: ' ' },
            { type: 'keyword', text: 'import' },
            { type: 'text', text: ' ' },
            { type: 'variable', text: 'rsa' },
            { type: 'text', text: ', ' },
            { type: 'variable', text: 'padding' },
            { type: 'text', text: '\n' },
            { type: 'keyword', text: 'from' },
            { type: 'text', text: ' ' },
            { type: 'variable', text: 'cryptography.hazmat.primitives.ciphers.aead' },
            { type: 'text', text: ' ' },
            { type: 'keyword', text: 'import' },
            { type: 'text', text: ' ' },
            { type: 'variable', text: 'AESGCM' },
            { type: 'text', text: '\n' },
            { type: 'keyword', text: 'import' },
            { type: 'text', text: ' ' },
            { type: 'variable', text: 'os' },
            { type: 'text', text: '\n\n' },
            { type: 'keyword', text: 'def' },
            { type: 'text', text: ' ' },
            { type: 'variable', text: 'encrypt_message' },
            { type: 'text', text: '(' },
            { type: 'variable', text: 'message' },
            { type: 'text', text: ', ' },
            { type: 'variable', text: 'public_key' },
            { type: 'text', text: '):\n    ' },
            { type: 'comment', text: '# Generate AES key for this session' },
            { type: 'text', text: '\n    ' },
            { type: 'variable', text: 'aes_key' },
            { type: 'text', text: ' = ' },
            { type: 'function', text: 'AESGCM' },
            { type: 'text', text: '.' },
            { type: 'function', text: 'generate_key' },
            { type: 'text', text: '(' },
            { type: 'variable', text: 'bit_length' },
            { type: 'text', text: '=' },
            { type: 'number', text: '256' },
            { type: 'text', text: ')\n    ' },
            { type: 'variable', text: 'aesgcm' },
            { type: 'text', text: ' = ' },
            { type: 'function', text: 'AESGCM' },
            { type: 'text', text: '(' },
            { type: 'variable', text: 'aes_key' },
            { type: 'text', text: ')\n    ' },
            { type: 'variable', text: 'nonce' },
            { type: 'text', text: ' = ' },
            { type: 'function', text: 'os.urandom' },
            { type: 'text', text: '(' },
            { type: 'number', text: '12' },
            { type: 'text', text: ')\n    \n    ' },
            { type: 'comment', text: '# Encrypt message with AES-GCM' },
            { type: 'text', text: '\n    ' },
            { type: 'variable', text: 'ciphertext' },
            { type: 'text', text: ' = ' },
            { type: 'variable', text: 'aesgcm' },
            { type: 'text', text: '.' },
            { type: 'function', text: 'encrypt' },
            { type: 'text', text: '(' },
            { type: 'variable', text: 'nonce' },
            { type: 'text', text: ', ' },
            { type: 'variable', text: 'message' },
            { type: 'text', text: '.' },
            { type: 'function', text: 'encode' },
            { type: 'text', text: '(), ' },
            { type: 'variable', text: 'None' },
            { type: 'text', text: ')\n    \n    ' },
            { type: 'comment', text: '# Encrypt AES key with RSA' },
            { type: 'text', text: '\n    ' },
            { type: 'variable', text: 'encrypted_key' },
            { type: 'text', text: ' = ' },
            { type: 'variable', text: 'public_key' },
            { type: 'text', text: '.' },
            { type: 'function', text: 'encrypt' },
            { type: 'text', text: '(\n        ' },
            { type: 'variable', text: 'aes_key' },
            { type: 'text', text: ',\n        ' },
            { type: 'function', text: 'padding.OAEP' },
            { type: 'text', text: '(\n            ' },
            { type: 'variable', text: 'mgf' },
            { type: 'text', text: '=' },
            { type: 'function', text: 'padding.MGF1' },
            { type: 'text', text: '(' },
            { type: 'variable', text: 'algorithm' },
            { type: 'text', text: '=' },
            { type: 'function', text: 'hashes.SHA256' },
            { type: 'text', text: '()),\n            ' },
            { type: 'variable', text: 'algorithm' },
            { type: 'text', text: '=' },
            { type: 'function', text: 'hashes.SHA256' },
            { type: 'text', text: '(),\n            ' },
            { type: 'variable', text: 'label' },
            { type: 'text', text: '=' },
            { type: 'variable', text: 'None' },
            { type: 'text', text: '\n        )\n    )\n    \n    ' },
            { type: 'keyword', text: 'return' },
            { type: 'text', text: ' {\n        ' },
            { type: 'string', text: "'encrypted_key'" },
            { type: 'text', text: ': ' },
            { type: 'variable', text: 'encrypted_key' },
            { type: 'text', text: ',\n        ' },
            { type: 'string', text: "'nonce'" },
            { type: 'text', text: ': ' },
            { type: 'variable', text: 'nonce' },
            { type: 'text', text: ',\n        ' },
            { type: 'string', text: "'ciphertext'" },
            { type: 'text', text: ': ' },
            { type: 'variable', text: 'ciphertext' },
            { type: 'text', text: '\n    }' }
        ];
    } else {
        // No matching page, restore original and exit
        codeElement.innerHTML = originalHTML;
        return;
    }
    
    let segmentIndex = 0;
    let charIndex = 0;
    let currentHTML = '';
    
    function getClassForType(type) {
        const classMap = {
            'keyword': 'code-keyword',
            'variable': 'code-variable',
            'property': 'code-property',
            'string': 'code-string',
            'function': 'code-function',
            'comment': 'code-comment',
            'number': 'code-number'
        };
        return classMap[type] || '';
    }
    
    function typeCode() {
        if (segmentIndex < codeSegments.length) {
            const segment = codeSegments[segmentIndex];
            
            if (charIndex < segment.text.length) {
                const char = segment.text[charIndex];
                
                if (segment.type === 'text') {
                    // Regular text
                    currentHTML += char;
                } else {
                    // Styled text - need to handle opening/closing tags
                    if (charIndex === 0) {
                        // Open the span tag
                        currentHTML += `<span class="${getClassForType(segment.type)}">`;
                    }
                    currentHTML += char;
                    
                    if (charIndex === segment.text.length - 1) {
                        // Close the span tag
                        currentHTML += '</span>';
                    }
                }
                
                codeElement.innerHTML = currentHTML;
                charIndex++;
                
                // Variable speed: adjust based on page type
                // Project page types faster due to longer code
                const baseSpeed = isProjectPage ? 15 : 40;
                const keywordSpeed = isProjectPage ? 25 : 60;
                const whitespaceSpeed = isProjectPage ? 8 : 20;
                
                let speed = baseSpeed;
                if (segment.type === 'keyword' || segment.type === 'string' || segment.type === 'comment') {
                    speed = keywordSpeed; // Slower for keywords, strings, and comments
                } else if (char === ' ' || char === '\n') {
                    speed = whitespaceSpeed; // Faster for whitespace
                }
                
                setTimeout(typeCode, speed);
            } else {
                // Move to next segment
                segmentIndex++;
                charIndex = 0;
                const segmentDelay = isProjectPage ? 10 : 30;
                setTimeout(typeCode, segmentDelay);
            }
        }
    }
    
    // Start typing after a short delay
    setTimeout(() => {
        typeCode();
    }, isProjectPage ? 500 : 1500);
}

// Initialize typewriter effect when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypewriterEffect);
} else {
    initTypewriterEffect();
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink();

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll-heavy functions
const throttledScroll = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', throttledScroll);

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Copy email to clipboard
function initEmailCopy() {
    const copyEmailButton = document.getElementById('copy-email');
    const copyStatus = document.getElementById('copy-status');

    function setCopyStatus(message, isError = false) {
        if (!copyStatus) return;
        copyStatus.textContent = message;
        copyStatus.classList.toggle('error', isError);

        if (message) {
            setTimeout(() => {
                if (copyStatus.textContent === message) {
                    copyStatus.textContent = '';
                    copyStatus.classList.remove('error');
                }
            }, 4000);
        }
    }

    async function copyEmailToClipboard(email) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(email);
                return;
            }

            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = email;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        } catch (error) {
            throw error;
        }
    }

    if (copyEmailButton) {
        copyEmailButton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const email = copyEmailButton.dataset.email;
            if (!email) return;

            try {
                await copyEmailToClipboard(email);
                setCopyStatus('Email copied to clipboard!');
            } catch (error) {
                console.error('Failed to copy email', error);
                setCopyStatus('Copy failed. Please copy manually.', true);
            }
        });
    }
}

// Initialize email copy when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailCopy);
} else {
    initEmailCopy();
}

// Toggle Secure Chat summary detail level
function initSummarySwitcher() {
    const switcher = document.querySelector('[data-summary-switcher]');
    if (!switcher) return;

    const buttons = switcher.querySelectorAll('[data-summary-target]');
    const panels = switcher.querySelectorAll('[data-summary-panel]');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.summaryTarget;

            buttons.forEach(item => {
                const isActive = item === button;
                item.classList.toggle('active', isActive);
                item.setAttribute('aria-selected', String(isActive));
            });

            panels.forEach(panel => {
                const isActive = panel.dataset.summaryPanel === target;
                panel.classList.toggle('active', isActive);
                panel.toggleAttribute('hidden', !isActive);
            });
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSummarySwitcher);
} else {
    initSummarySwitcher();
}

// Project detail lens: purpose and outcomes for operators, implementation and validation for builders.
function initPerspectiveSwitchers() {
    const switchers = [...document.querySelectorAll('[data-perspective-switcher]')];
    if (!switchers.length) return;

    const validPerspectives = ['operator', 'builder'];
    const url = new URL(window.location.href);
    const requestedPerspective = url.searchParams.get('lens');
    let storedPerspective = null;

    try {
        storedPerspective = window.sessionStorage.getItem('portfolio-project-perspective');
    } catch (error) {
        storedPerspective = null;
    }

    const initialPerspective = validPerspectives.includes(requestedPerspective)
        ? requestedPerspective
        : validPerspectives.includes(storedPerspective)
            ? storedPerspective
            : 'operator';

    document.body.classList.add('has-perspective-switcher');

    function setPerspective(perspective, updateUrl = true) {
        if (!validPerspectives.includes(perspective)) return;

        document.body.dataset.projectPerspective = perspective;

        switchers.forEach(switcher => {
            const buttons = [...switcher.querySelectorAll('[data-perspective-target]')];
            const panels = [...switcher.querySelectorAll('[data-perspective-panel]')];

            buttons.forEach(button => {
                const isActive = button.dataset.perspectiveTarget === perspective;
                button.classList.toggle('active', isActive);
                button.setAttribute('aria-selected', String(isActive));
                button.tabIndex = isActive ? 0 : -1;
            });

            panels.forEach(panel => {
                const isActive = panel.dataset.perspectivePanel === perspective;
                panel.classList.toggle('active', isActive);
                panel.toggleAttribute('hidden', !isActive);
            });
        });

        document.querySelectorAll('[data-perspective-content]').forEach(section => {
            const sectionPerspective = section.dataset.perspectiveContent;
            const isVisible = sectionPerspective === 'both' || sectionPerspective === perspective;
            section.toggleAttribute('hidden', !isVisible);
            section.classList.toggle('perspective-visible', isVisible);
        });

        try {
            window.sessionStorage.setItem('portfolio-project-perspective', perspective);
        } catch (error) {
            // The control remains fully functional when storage is unavailable.
        }

        if (updateUrl) {
            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.set('lens', perspective);
            window.history.replaceState({}, '', nextUrl);
        }
    }

    switchers.forEach(switcher => {
        const buttons = [...switcher.querySelectorAll('[data-perspective-target]')];

        buttons.forEach((button, buttonIndex) => {
            button.addEventListener('click', () => {
                setPerspective(button.dataset.perspectiveTarget);
            });

            button.addEventListener('keydown', event => {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();

                let targetIndex = buttonIndex;
                if (event.key === 'ArrowLeft') targetIndex = (buttonIndex - 1 + buttons.length) % buttons.length;
                if (event.key === 'ArrowRight') targetIndex = (buttonIndex + 1) % buttons.length;
                if (event.key === 'Home') targetIndex = 0;
                if (event.key === 'End') targetIndex = buttons.length - 1;

                const targetButton = buttons[targetIndex];
                setPerspective(targetButton.dataset.perspectiveTarget);
                targetButton.focus();
            });
        });
    });

    setPerspective(initialPerspective, false);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerspectiveSwitchers);
} else {
    initPerspectiveSwitchers();
}

// Progressive fallback for browsers without cross-document View Transitions.
function initProjectPageTransitions() {
    document.body.dataset.viewTransitionCapability = typeof document.startViewTransition === 'function'
        ? 'native'
        : 'fallback';

    const projectLinks = document.querySelectorAll(
        '[data-carousel-link], .back-link[href*="index.html"], .project-link-btn.secondary[href*="index.html"]'
    );

    function getTransitionElements() {
        if (document.body.classList.contains('project-detail-page')) {
            return {
                visual: document.querySelector('.project-showcase'),
                title: document.querySelector('.project-main-title')
            };
        }

        return {
            visual: document.querySelector('.system-slide.is-selected .portal-depth'),
            title: document.querySelector('[data-carousel-title]')
        };
    }

    function rectToObject(element) {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        };
    }

    function storeTransitionOrigin() {
        const elements = getTransitionElements();
        const transitionState = {
            createdAt: Date.now(),
            visual: rectToObject(elements.visual),
            title: rectToObject(elements.title)
        };

        try {
            window.sessionStorage.setItem('portfolio-shared-transition', JSON.stringify(transitionState));
        } catch (error) {
            // Navigation still works when storage is unavailable.
        }
    }

    function animateElementFromRect(element, sourceRect, duration) {
        if (!element || !sourceRect || typeof element.animate !== 'function') return Promise.resolve();

        const targetRect = element.getBoundingClientRect();
        if (!targetRect.width || !targetRect.height || !sourceRect.width || !sourceRect.height) return Promise.resolve();

        const translateX = sourceRect.left - targetRect.left;
        const translateY = sourceRect.top - targetRect.top;
        const scaleX = sourceRect.width / targetRect.width;
        const scaleY = sourceRect.height / targetRect.height;
        const computedTransform = window.getComputedStyle(element).transform;
        const baseTransform = computedTransform === 'none' ? '' : computedTransform;
        const startTransform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY}) ${baseTransform}`.trim();
        const endTransform = baseTransform || 'none';

        element.classList.add('is-shared-transition-target');
        const animation = element.animate(
            [
                { transform: startTransform, opacity: 0.84, filter: 'brightness(0.76)' },
                { transform: endTransform, opacity: 1, filter: 'brightness(1)' }
            ],
            {
                duration,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                fill: 'both'
            }
        );

        return animation.finished.catch(() => undefined).finally(() => {
            animation.cancel();
            element.classList.remove('is-shared-transition-target');
        });
    }

    function playStoredTransition() {
        if (reducedMotionQuery.matches || typeof document.startViewTransition === 'function') return;

        let transitionState = null;
        try {
            transitionState = JSON.parse(window.sessionStorage.getItem('portfolio-shared-transition'));
            window.sessionStorage.removeItem('portfolio-shared-transition');
        } catch (error) {
            transitionState = null;
        }

        if (!transitionState || Date.now() - transitionState.createdAt > 4000) return;

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                const elements = getTransitionElements();
                document.body.classList.add('is-shared-transition-entering');
                document.body.dataset.sharedTransitionState = 'active';

                Promise.all([
                    animateElementFromRect(elements.visual, transitionState.visual, 620),
                    animateElementFromRect(elements.title, transitionState.title, 480)
                ]).finally(() => {
                    document.body.classList.remove('is-shared-transition-entering');
                    document.body.dataset.sharedTransitionState = 'complete';
                });
            });
        });
    }

    playStoredTransition();

    projectLinks.forEach(link => {
        link.addEventListener('click', event => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            if (reducedMotionQuery.matches) return;

            const destination = new URL(link.href, window.location.href);
            if (destination.origin !== window.location.origin) return;

            if (typeof document.startViewTransition === 'function') return;
            storeTransitionOrigin();

            event.preventDefault();
            document.body.classList.add('project-page-leaving');
            window.setTimeout(() => {
                window.location.href = destination.href;
            }, 120);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectPageTransitions);
} else {
    initProjectPageTransitions();
}

// Interactive encrypted-endpoint architecture model
function initSecureEndpointModel() {
    const model = document.querySelector('[data-secure-endpoint-model]');
    if (!model) return;

    const stageButtons = model.querySelectorAll('[data-secure-stage]');
    const captionIndex = model.querySelector('[data-secure-caption-index]');
    const captionTitle = model.querySelector('[data-secure-caption-title]');
    const captionCopy = model.querySelector('[data-secure-caption-copy]');
    const payloadLabel = model.querySelector('[data-secure-payload-label]');
    const packetLabels = model.querySelectorAll('[data-secure-packet-short]');
    const frameParts = model.querySelector('[data-secure-frame-parts]');
    const relayState = model.querySelector('[data-secure-relay-state]');
    const endpointAState = model.querySelector('[data-secure-endpoint-a-state]');
    const endpointBState = model.querySelector('[data-secure-endpoint-b-state]');
    const sequenceIndex = model.querySelector('[data-secure-sequence-index]');
    const sequenceSteps = model.querySelector('[data-secure-sequence-steps]');
    let animationTimer;
    let ambientTimer;

    const stageContent = {
        keys: {
            index: 'Stage 01',
            title: 'Public key exchange',
            copy: 'Each client sends its RSA-2048 public key through the TCP relay. The corresponding private key stays on disk at its own endpoint.',
            payload: 'RSA public key · PEM payload',
            packet: 'PUB',
            frame: ['TYPE 01 · 1B', 'LENGTH · 4B', 'PUBLIC KEY · PEM'],
            relay: 'Forwards public keys',
            endpointA: 'Share public key',
            endpointB: 'Load peer key',
            sequenceIndex: '01 / IDENTITY',
            sequenceSteps: 'PUBLISH → EXCHANGE → STORE',
            duration: 3600
        },
        session: {
            index: 'Stage 02',
            title: 'Session key setup',
            copy: 'Endpoint A generates a random 32-byte AES key and wraps it with Endpoint B’s public key using RSA-OAEP with SHA-256.',
            payload: 'RSA-OAEP wrapped AES key',
            packet: 'KEY',
            frame: ['TYPE 02 · 1B', 'LENGTH · 4B', 'WRAPPED KEY · 256B'],
            relay: 'Cannot unwrap key',
            endpointA: 'Generate AES-256 key',
            endpointB: 'Unwrap with private key',
            sequenceIndex: '02 / SESSION',
            sequenceSteps: 'GENERATE → WRAP → UNWRAP',
            duration: 3600
        },
        message: {
            index: 'Stage 03',
            title: 'Encrypted message',
            copy: 'AES-256-GCM creates a unique 12-byte nonce, ciphertext, and 16-byte authentication tag. The relay forwards the serialized frame; Endpoint B verifies and decrypts it locally.',
            payload: 'AES-256-GCM encrypted payload',
            packet: 'MSG',
            frame: ['TYPE 03 · 1B', 'LENGTH · 4B', 'NONCE · 12B', 'CIPHERTEXT', 'TAG · 16B'],
            relay: 'Ciphertext only',
            endpointA: 'Encrypt + authenticate',
            endpointB: 'Verify + decrypt',
            sequenceIndex: '03 / MESSAGE',
            sequenceSteps: 'BUILD FRAME → RELAY → VERIFY',
            duration: 4400
        }
    };

    function scheduleAmbientSequence() {
        window.clearTimeout(ambientTimer);
        if (reducedMotionQuery.matches) return;

        const quietInterval = 8500 + Math.round(Math.random() * 3500);
        ambientTimer = window.setTimeout(runSequence, quietInterval);
    }

    function runSequence() {
        window.clearTimeout(animationTimer);
        window.clearTimeout(ambientTimer);
        model.classList.remove('is-animating');

        if (reducedMotionQuery.matches || document.hidden) return;

        const activeStage = stageContent[model.dataset.modelStage] || stageContent.message;

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                model.classList.add('is-animating');
                animationTimer = window.setTimeout(() => {
                    model.classList.remove('is-animating');
                    scheduleAmbientSequence();
                }, activeStage.duration);
            });
        });
    }

    function setStage(stage) {
        const content = stageContent[stage];
        if (!content) return;

        model.dataset.modelStage = stage;
        stageButtons.forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.secureStage === stage));
        });

        if (captionIndex) captionIndex.textContent = content.index;
        if (captionTitle) captionTitle.textContent = content.title;
        if (captionCopy) captionCopy.textContent = content.copy;
        if (payloadLabel) payloadLabel.textContent = content.payload;
        packetLabels.forEach(label => { label.textContent = content.packet; });
        if (frameParts) {
            frameParts.replaceChildren(...content.frame.map(part => {
                const span = document.createElement('span');
                span.textContent = part;
                return span;
            }));
        }
        if (relayState) relayState.textContent = content.relay;
        if (endpointAState) endpointAState.textContent = content.endpointA;
        if (endpointBState) endpointBState.textContent = content.endpointB;
        if (sequenceIndex) sequenceIndex.textContent = content.sequenceIndex;
        if (sequenceSteps) sequenceSteps.textContent = content.sequenceSteps;

        runSequence();
    }

    stageButtons.forEach(button => {
        button.addEventListener('click', () => setStage(button.dataset.secureStage));
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.clearTimeout(ambientTimer);
            window.clearTimeout(animationTimer);
            model.classList.remove('is-animating');
            return;
        }

        scheduleAmbientSequence();
    });

    setStage(model.dataset.modelStage || 'message');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecureEndpointModel);
} else {
    initSecureEndpointModel();
}
