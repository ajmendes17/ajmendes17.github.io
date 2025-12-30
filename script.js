// Navigation functionality
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

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
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
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
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const gridOverlay = document.querySelector('.grid-overlay');
    
    if (hero && scrolled < window.innerHeight) {
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

// Project card hover effects
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

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
const codeContent = document.querySelector('.code-content');
if (codeContent) {
    const codeElement = codeContent.querySelector('code');
    if (codeElement) {
        // Store the original HTML structure
        const originalHTML = codeElement.innerHTML;
        
        // Clear the content
        codeElement.innerHTML = '';
        
        // Define the code structure as segments
        const codeSegments = [
            { type: 'keyword', text: 'const' },
            { type: 'text', text: ' ' },
            { type: 'variable', text: 'developer' },
            { type: 'text', text: ' = {\n  ' },
            { type: 'property', text: 'name' },
            { type: 'text', text: ': ' },
            { type: 'string', text: "'AJ Mendes'" },
            { type: 'text', text: ',\n  ' },
            { type: 'property', text: 'role' },
            { type: 'text', text: ': ' },
            { type: 'string', text: "'Full-Stack Developer'" },
            { type: 'text', text: ',\n  ' },
            { type: 'property', text: 'passion' },
            { type: 'text', text: ': ' },
            { type: 'string', text: "'Building innovative solutions'" },
            { type: 'text', text: '\n};' }
        ];
        
        let segmentIndex = 0;
        let charIndex = 0;
        let currentHTML = '';
        
        function getClassForType(type) {
            const classMap = {
                'keyword': 'code-keyword',
                'variable': 'code-variable',
                'property': 'code-property',
                'string': 'code-string'
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
                    
                    // Variable speed: slower for keywords and strings
                    let speed = 40;
                    if (segment.type === 'keyword' || segment.type === 'string') {
                        speed = 60; // Slower for keywords and strings
                    } else if (char === ' ' || char === '\n') {
                        speed = 20; // Faster for whitespace
                    }
                    
                    setTimeout(typeCode, speed);
                } else {
                    // Move to next segment
                    segmentIndex++;
                    charIndex = 0;
                    setTimeout(typeCode, 30);
                }
            }
        }
        
        // Start typing after a short delay
        setTimeout(() => {
            typeCode();
        }, 1500);
    }
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

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

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
