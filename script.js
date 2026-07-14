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
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
}

navToggle.addEventListener('click', () => {
    const isOpening = !navMenu.classList.contains('active');
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpening));
    navToggle.setAttribute('aria-label', isOpening ? 'Close navigation menu' : 'Open navigation menu');
});

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

// Project card hover effects and click handling
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });

    // Make entire card clickable if it has a project URL
    const projectUrl = card.getAttribute('data-project-url');
    if (projectUrl) {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on a link or button inside
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            window.location.href = projectUrl;
        });
    }
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
