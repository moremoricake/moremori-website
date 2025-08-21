// Sweet Bakery Animation System (ohne Parallax)
class SweetAnimationSystem {
    constructor() {
        this.init();
        this.setupScrollAnimations();
        this.setupLoadingAnimation();
        this.setupInteractiveEffects();
    }

    init() {
        // Warten bis DOM geladen ist
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeAnimations());
        } else {
            this.initializeAnimations();
        }
    }

    initializeAnimations() {
        console.log('🧁 Sweet Bakery Animation System aktiviert!');
        
        // Loading Screen erstellen
        this.createLoadingScreen();
        
        // Scroll-Animation Elemente
        this.scrollElements = document.querySelectorAll('.comic-panel, .testimonial-card, .section-title');
        
        // Background Bubbles hinzufügen
        this.createBackgroundBubbles();
        
        // Event Listeners
        this.addEventListeners();
    }

    createLoadingScreen() {
        // Prüfen ob Loading Screen bereits existiert
        if (document.querySelector('.sweet-loading-container')) return;
        
        const loadingHTML = `
            <div class="sweet-loading-container" id="sweetLoader">
                <div class="cupcakes-parade">
                    <div class="cupcake-item">🧁</div>
                    <div class="cupcake-item">🍪</div>
                    <div class="cupcake-item">🧁</div>
                </div>
                <div class="loading-text">Süße Momente werden geladen...</div>
            </div>
        `;
        
        // Loading Screen zum Body hinzufügen
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        
        // Loading Screen nach 2 Sekunden ausblenden
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }

    hideLoadingScreen() {
        const loader = document.getElementById('sweetLoader');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }

    // Parallax-Funktionen entfernt für bessere Performance

    setupScrollAnimations() {
        // Intersection Observer für Scroll-Animationen
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Elemente beobachten
        this.scrollElements.forEach(el => {
            el.style.opacity = '0'; // Initial unsichtbar
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        // Verschiedene Animationen basierend auf Element-Typ
        if (element.classList.contains('comic-panel')) {
            element.classList.add('animate-bounce-in', 'playful');
            element.style.opacity = '1';
        } else if (element.classList.contains('testimonial-card')) {
            element.classList.add('animate-fade-in-up');
            element.style.opacity = '1';
        } else if (element.classList.contains('section-title')) {
            element.classList.add('animate-slide-in-left');
            element.style.opacity = '1';
        }
        
        // Sparkle-Effekt für Comic Panels
        if (element.classList.contains('comic-panel')) {
            element.classList.add('sparkle-effect');
        }
    }

    createBackgroundBubbles() {
        const bubblesHTML = `
            <div class="background-bubbles">
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', bubblesHTML);
    }

    setupInteractiveEffects() {
        // CTA Buttons mit Sweet Pulse
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.classList.add('sweet-pulse');
            
            // Hover-Effekte verstärken
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });

        // Comic Panels Interactive
        const comicPanels = document.querySelectorAll('.comic-panel');
        comicPanels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                panel.classList.add('floating-element');
            });
            
            panel.addEventListener('mouseleave', () => {
                panel.classList.remove('floating-element');
            });
        });

        // Logo Animation
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.createCupcakeExplosion(e);
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
            });
        }
    }

    createCupcakeExplosion(event) {
        const { clientX: x, clientY: y } = event;
        const cupcakes = ['🧁', '🍪', '🎂', '🍰', '🧁'];
        
        cupcakes.forEach((cupcake, index) => {
            const element = document.createElement('div');
            element.textContent = cupcake;
            element.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 9999;
                animation: cupcakeExplosion 1s ease-out forwards;
                animation-delay: ${index * 0.1}s;
            `;
            
            document.body.appendChild(element);
            
            setTimeout(() => element.remove(), 1000);
        });
        
        // CSS für Explosion-Animation hinzufügen
        if (!document.querySelector('#cupcake-explosion-style')) {
            const style = document.createElement('style');
            style.id = 'cupcake-explosion-style';
            style.textContent = `
                @keyframes cupcakeExplosion {
                    0% {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2) rotate(360deg) translateY(-100px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addEventListeners() {
        // Throttled Scroll Event für Performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Resize Event
        window.addEventListener('resize', () => {
            // Parallax bei kleinen Bildschirmen deaktivieren
            if (window.innerWidth < 768) {
                this.parallaxElements.forEach(el => {
                    el.style.transform = '';
                });
            }
        });

        // Page Visibility API - Animationen pausieren wenn Tab nicht aktiv
        document.addEventListener('visibilitychange', () => {
            const bubbles = document.querySelectorAll('.bubble');
            if (document.hidden) {
                bubbles.forEach(bubble => {
                    bubble.style.animationPlayState = 'paused';
                });
            } else {
                bubbles.forEach(bubble => {
                    bubble.style.animationPlayState = 'running';
                });
            }
        });
    }

    // Utility Methoden
    showCupcakeNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-gradient);
            padding: 15px 20px;
            border-radius: 25px;
            box-shadow: var(--card-shadow);
            z-index: 9999;
            font-family: 'Fredoka', sans-serif;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: sweetSlideInRight 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <span class="cupcake-bouncer">🧁</span>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'sweetSlideInRight 0.5s ease-out reverse';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Animation System starten wenn Seite geladen wird
const sweetAnimations = new SweetAnimationSystem();

// Globale Funktionen für externe Nutzung
window.showSweetNotification = (message) => sweetAnimations.showCupcakeNotification(message);

// Easter Egg: Konami Code für Cupcake Rain
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konami.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konami)) {
        startCupcakeRain();
        konamiCode = [];
    }
});

function startCupcakeRain() {
    sweetAnimations.showCupcakeNotification('🧁 CUPCAKE RAIN AKTIVIERT! 🧁');
    
    const cupcakeTypes = ['🧁', '🍪', '🎂', '🍰', '🍩'];
    let rainInterval;
    
    function createRainDrop() {
        const drop = document.createElement('div');
        drop.textContent = cupcakeTypes[Math.floor(Math.random() * cupcakeTypes.length)];
        drop.style.cssText = `
            position: fixed;
            top: -50px;
            left: ${Math.random() * 100}vw;
            font-size: ${Math.random() * 2 + 1}rem;
            pointer-events: none;
            z-index: 9998;
            animation: bubbleFloat 3s linear forwards;
        `;
        
        document.body.appendChild(drop);
        setTimeout(() => drop.remove(), 3000);
    }
    
    // Cupcake Rain für 10 Sekunden
    rainInterval = setInterval(createRainDrop, 200);
    setTimeout(() => {
        clearInterval(rainInterval);
        sweetAnimations.showCupcakeNotification('Cupcake Rain beendet! 🌈');
    }, 10000);
}

console.log('🧁 Sweet Bakery Parallax System geladen! Drücke ↑↑↓↓←→←→BA für eine Überraschung! 🧁');
