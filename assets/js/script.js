/**
 * Apple Liquid Glass Design System — macOS 26 Tahoe & iOS 26
 * Interactive Physics, Optical Caustic Tracking & Scroll Engine
 * Vraj Patel Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    initOpticalMouseTracking();
    initTahoeNavigation();
    initTypingEngine();
    initScrollReveal();
    initContactForm();
});

/**
 * Real-time Optical Specular Lensing
 * Tracks pointer movement across glass cards to simulate real-world light refraction
 */
function initOpticalMouseTracking() {
    const glassCards = document.querySelectorAll('.glass-card, .skill-liquid-card, .cert-glass-card');
    
    // Throttled mousemove listener on window/cards for silky 60fps performance
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            // Smoothly reset spotlight to center
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

/**
 * macOS Tahoe Floating Capsule Navigation Engine (Photos, Music, Mail Style)
 * Dynamic scroll glass density, smooth sliding liquid pill indicator, and optical glare
 */
function initTahoeNavigation() {
    const navbar = document.getElementById('tahoeNavbar');
    const navLinksContainer = document.getElementById('tahoeNavLinks');
    const pillIndicator = document.getElementById('tahoePillIndicator');
    const navLinks = document.querySelectorAll('.tahoe-nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const navToggle = document.getElementById('tahoeNavToggle');
    const mobileMenu = document.getElementById('tahoeMobileMenu');
    const sections = document.querySelectorAll('section[id]');
    
    let isMouseOverNav = false;
    let isClickScrolling = false;
    let clickScrollTimer = null;

    // Real-time Optical Specular Glare across the liquid glass bar
    if (navbar) {
        navbar.addEventListener('mousemove', (e) => {
            const rect = navbar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            navbar.style.setProperty('--nav-mouse-x', `${x}px`);
            navbar.style.setProperty('--nav-mouse-y', `${y}px`);
        });

        navbar.addEventListener('mouseleave', () => {
            navbar.style.setProperty('--nav-mouse-x', '50%');
            navbar.style.setProperty('--nav-mouse-y', '50%');
        });
    }

    // Move Liquid Pill Indicator to target link using exact viewport-relative rects
    function movePillTo(element, animate = true) {
        if (!element || !pillIndicator || !navLinksContainer) return;
        
        const elementRect = element.getBoundingClientRect();
        const containerRect = navLinksContainer.getBoundingClientRect();
        
        // Calculate exact horizontal offset inside the segmented container
        const left = elementRect.left - containerRect.left;
        const width = elementRect.width;

        if (width <= 0) return;

        if (!animate) {
            pillIndicator.style.transition = 'none';
        }

        pillIndicator.style.transform = `translateX(${left}px)`;
        pillIndicator.style.width = `${width}px`;
        pillIndicator.style.opacity = '1';

        if (!animate) {
            pillIndicator.offsetHeight; // Force reflow
            pillIndicator.style.transition = '';
        }
    }

    // Initialize/sync pill position on active tab
    function syncPillWithActive(animate = false) {
        const activeLink = navLinksContainer ? navLinksContainer.querySelector('.tahoe-nav-link.active') : null;
        if (activeLink) {
            movePillTo(activeLink, animate);
        } else if (pillIndicator) {
            pillIndicator.style.opacity = '0';
        }
    }

    // Initialize once fonts and styles settle
    setTimeout(() => syncPillWithActive(false), 100);
    window.addEventListener('resize', () => syncPillWithActive(false));

    // Smooth hover physics on nav links
    if (navLinksContainer) {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                isMouseOverNav = true;
                movePillTo(link, true);
            });
        });

        navLinksContainer.addEventListener('mouseenter', () => {
            isMouseOverNav = true;
        });

        navLinksContainer.addEventListener('mouseleave', () => {
            isMouseOverNav = false;
            syncPillWithActive(true);
        });
    }

    // Scroll density shift & ScrollSpy
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveSection();
    }, { passive: true });

    // Smooth scroll for all anchor links & instant active tab switch
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                
                // Set click scroll lock so intermediate scroll events don't jitter the active state
                isClickScrolling = true;
                clearTimeout(clickScrollTimer);
                clickScrollTimer = setTimeout(() => {
                    isClickScrolling = false;
                    updateActiveSection();
                }, 850);

                // Update active state on nav links immediately
                navLinks.forEach(l => {
                    if (l.getAttribute('href') === targetId) {
                        l.classList.add('active');
                    } else {
                        l.classList.remove('active');
                    }
                });

                mobileLinks.forEach(l => {
                    if (l.getAttribute('href') === targetId) {
                        l.classList.add('active');
                    } else {
                        l.classList.remove('active');
                    }
                });

                // Immediately glide pill to clicked tab
                const targetNavLink = Array.from(navLinks).find(l => l.getAttribute('href') === targetId);
                if (targetNavLink) {
                    movePillTo(targetNavLink, true);
                }

                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    const icon = navToggle ? navToggle.querySelector('i') : null;
                    if (icon) icon.className = 'fas fa-bars';
                }

                // Smooth scroll to target position
                const navOffset = 85;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile drawer toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('open');
            const icon = navToggle.querySelector('i');
            if (mobileMenu.classList.contains('open')) {
                icon.className = 'fas fa-xmark';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
                mobileMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }

    // ScrollSpy: highlight current section tab during natural scrolling
    function updateActiveSection() {
        if (isClickScrolling) return;

        let currentSectionId = '';
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Bottom of page detection (activates contact tab)
        if (scrollPosition + windowHeight >= documentHeight - 70) {
            currentSectionId = 'contact';
        } else {
            // Find section currently in view
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 220 && rect.bottom >= 120) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        if (currentSectionId) {
            let activeChanged = false;

            navLinks.forEach(link => {
                const wasActive = link.classList.contains('active');
                const shouldBeActive = link.getAttribute('href') === `#${currentSectionId}`;
                
                if (shouldBeActive) {
                    if (!wasActive) activeChanged = true;
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            mobileLinks.forEach(link => {
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Smoothly move pill to newly active link if mouse is not currently hovering
            if (activeChanged && !isMouseOverNav) {
                syncPillWithActive(true);
            }
        }
    }
}

/**
 * Liquid Beam Typing Animation
 */
function initTypingEngine() {
    const nameEl = document.getElementById('typing-name');
    if (!nameEl) return;

    const phrases = ['Vraj Patel'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 120;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            nameEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 60;
        } else {
            nameEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at end of text
            typeSpeed = 3500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    nameEl.textContent = '';
    setTimeout(type, 300);
}

/**
 * Intersection Observer for Apple Spring Motion Reveals
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/**
 * Contact Form Engine with macOS Tahoe Liquid Toast Feedback
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin me-2"></i> Transmitting...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showTahoeToast('Message transmitted successfully! I will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showTahoeToast('Unable to send message. Please reach out via email directly.', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showTahoeToast('Network error occurred. Please reach out via LinkedIn or email.', 'error');
        } finally {
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Liquid Glass Toast Notification
 */
function showTahoeToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.tahoe-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `tahoe-toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'all 0.4s var(--apple-ease)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-15px) scale(0.95)';
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}