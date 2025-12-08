document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initProgressBars();
    initContactForm();
    initNavbarScroll();
    initTypingAnimation();
    initSectionAnimations();
});

function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
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
}

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
            }
        });
    });

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Submit form data to Formspree using fetch
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Show success message
                formStatus.style.display = 'block';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.innerHTML = '<div class="alert alert-danger">Something went wrong. Please try again.</div>';
                formStatus.style.display = 'block';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(244, 235, 208, 0.95)';
        } else {
            navbar.style.background = 'rgba(244, 235, 208, 0.1)';
        }
    });
}

function initTypingAnimation() {
    const nameElement = document.getElementById('typing-name');
    const originalText = 'Vraj Patel';
    let currentText = '';
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < originalText.length) {
            currentText += originalText.charAt(charIndex);
            nameElement.textContent = currentText;
            charIndex++;
            setTimeout(typeWriter, 120);
        }
    }
    
    nameElement.textContent = '';
    typeWriter();
}

function initSectionAnimations() {
    const sections = document.querySelectorAll('.section-animate');
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    const skillElements = document.querySelectorAll('.skill-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    });
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('animate');
                });
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -10px 0px'
    });
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    skillElements.forEach(element => {
        skillObserver.observe(element);
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        backdrop-filter: blur(20px);
        background: ${type === 'success' ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)'};
        border: none;
        border-radius: 10px;
        color: white;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}