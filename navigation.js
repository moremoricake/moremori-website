// MoreMori Navigation & Interactive Features
// Smooth Scrolling für Navigation Links

document.addEventListener('DOMContentLoaded', function() {
    
    // =================
    // SMOOTH SCROLLING
    // =================
    
    // Alle Navigation-Links auswählen
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Nur bei internen Links (die mit # beginnen)
            const href = this.getAttribute('href');
            
            // Leere Links oder nur # überspringen
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Header-Höhe berücksichtigen für korrektes Scrolling
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20; // 20px extra Abstand
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Mobile Menu schließen falls geöffnet
                const navMenu = document.getElementById('nav-menu');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    
                    // Hamburger Icon zurücksetzen
                    const hamburgerIcon = document.querySelector('#hamburger i');
                    hamburgerIcon.classList.remove('fa-times');
                    hamburgerIcon.classList.add('fa-bars');
                }
            }
        });
    });
    
    
    // ===================
    // HAMBURGER MENU
    // ===================
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            // Menu toggle
            navMenu.classList.toggle('active');
            
            // Icon wechseln zwischen Bars und X
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    
    // ===================
    // ACTIVE LINK HIGHLIGHT
    // ===================
    
    // Highlight der aktiven Sektion in der Navigation
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinksList = document.querySelectorAll('.nav-menu a[href^="#"]');
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Alle aktiven Links zurücksetzen
        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    
    // ===================
    // HEADER SCROLL EFFECT
    // ===================
    
    // Header Background-Effekt beim Scrollen
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    
    // ===================
    // FORM IMPROVEMENTS
    // ===================
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Hier später echte API-Integration
                alert('Danke für deine Anmeldung! 🎉\n\n' + 
                      'Du erhältst in Kürze eine Bestätigungs-E-Mail von uns.\n\n' +
                      '(Hinweis: Dies ist noch ein Demo - die echte Anmeldung folgt beim Launch!)');
                      
                this.querySelector('input[type="email"]').value = '';
            }
        });
    }
    
    // Kontakt Form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[placeholder*="Name"]')?.value;
            
            if (name) {
                // Hier später echte Formular-Verarbeitung
                alert(`Danke ${name}! 🍰\n\n` + 
                      'Deine Nachricht ist bei uns angekommen.\n' +
                      'Wir melden uns innerhalb von 24 Stunden bei dir!\n\n' +
                      '(Hinweis: Dies ist noch ein Demo - das echte Kontaktformular folgt beim Launch!)');
                      
                this.reset();
            }
        });
    }
    
    
    // ===================
    // SWEET ANIMATIONS
    // ===================
    
    // Scroll-Animationen für Karten
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Alle animierbaren Elemente beobachten
    const animateElements = document.querySelectorAll('.comic-panel, .testimonial-card, .event-showcase-item, .faq-item');
    
    animateElements.forEach((element, index) => {
        // Initial unsichtbar setzen
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        observer.observe(element);
    });
    
    
    // ===================
    // LOADING COMPLETE
    // ===================
    
    console.log('🍰 MoreMori Navigation & Interactivity loaded successfully!');
});

// ===================
// UTILITY FUNCTIONS
// ===================

// Smooth scroll zu beliebiger Position
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    if (section) {
        window.scrollTo({
            top: section.offsetTop - headerHeight - 20,
            behavior: 'smooth'
        });
    }
}

// Mobile Menu schließen (für externe Aufrufe)
function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}
