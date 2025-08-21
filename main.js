// MoreMori Hauptseite JavaScript
// Verwaltet Banner, dynamische Preise, Event-Popups und Notifications

class MoreMoriSite {
    constructor() {
        this.notifications = [];
        this.banners = [];
        this.prices = {};
        this.events = [];
        this.popupQueue = [];
        
        this.init();
    }

    async init() {
        // Data laden
        await this.loadData();
        
        // Features initialisieren
        this.setupNotifications();
        this.setupBanners();
        this.setupDynamicPrices();
        this.setupEventPopups();
        this.setupHamburgerMenu();
        
        // Banner anzeigen
        this.displayActiveBanners();
        
        // Event-Popups nach kurzer Verzögerung
        setTimeout(() => {
            this.showPendingPopups();
        }, 3000);
        
        console.log('MoreMori Site initialized');
    }

    // Data Management
    async loadData() {
        try {
            // API-Calls zu Supabase Backend
            await Promise.all([
                this.loadBanners(),
                this.loadPrices(),
                this.loadEvents()
            ]);
        } catch (error) {
            console.error('Fehler beim Laden der Daten:', error);
            this.showNotification('Fehler beim Laden der Daten', 'error');
        }
    }

    async loadBanners() {
        try {
            const response = await fetch('/.netlify/functions/supabase-api?action=get&type=banners');
            if (!response.ok) throw new Error('Failed to fetch banners');
            
            const banners = await response.json();
            
            // Transformiere API-Daten ins Frontend-Format
            this.banners = banners.filter(banner => banner.is_active).map(banner => ({
                id: banner.id,
                type: banner.banner_type || 'announcement',
                active: banner.is_active,
                title: banner.title,
                message: banner.message,
                ctaText: banner.cta_text || 'Mehr erfahren',
                ctaAction: () => {
                    if (banner.link_url && banner.link_url !== '#') {
                        window.open(banner.link_url, '_blank');
                    } else {
                        this.scrollToSection('kontakt');
                    }
                },
                position: banner.position || 'floating',
                showClose: banner.dismissible !== false,
                icon: this.getBannerIcon(banner.banner_type),
                autoHide: banner.auto_hide_seconds ? banner.auto_hide_seconds * 1000 : null
            }));
            
            console.log('Banner geladen:', this.banners.length);
        } catch (error) {
            console.error('Fehler beim Laden der Banner:', error);
            this.banners = []; // Fallback: keine Banner
        }
    }

    async loadPrices() {
        try {
            const response = await fetch('/.netlify/functions/supabase-api?action=get&type=prices');
            if (!response.ok) throw new Error('Failed to fetch prices');
            
            const pricesArray = await response.json();
            
            // Transformiere Array in kategorisierte Struktur
            this.prices = {
                bases: {},
                creams: {},
                events: {}
            };
            
            pricesArray.filter(price => price.is_active).forEach(price => {
                const key = price.item_key;
                const item = {
                    name: price.name,
                    price: parseFloat(price.price),
                    description: price.description || ''
                };
                
                if (price.category === 'bases') {
                    this.prices.bases[key] = item;
                } else if (price.category === 'creams') {
                    this.prices.creams[key] = item;
                } else if (price.category === 'events') {
                    this.prices.events[key] = item;
                }
            });
            
            console.log('Preise geladen:', Object.keys(this.prices.bases).length + Object.keys(this.prices.creams).length + Object.keys(this.prices.events).length);
        } catch (error) {
            console.error('Fehler beim Laden der Preise:', error);
            // Fallback zu Demo-Preisen
            this.prices = {
                bases: {
                    wolke: { name: 'MoreMori Wolke', price: 4.50, description: 'Luftig-leichter Vanille-Riegel' }
                },
                creams: {
                    vanille: { name: 'Vanille-Creme', price: 0.80 }
                },
                events: {
                    basic: { name: 'Event Basic', price: 120.00, description: 'Für bis zu 20 Personen' }
                }
            };
        }
    }

    async loadEvents() {
        try {
            const response = await fetch('/.netlify/functions/supabase-api?action=get&type=calendar');
            if (!response.ok) throw new Error('Failed to fetch events');
            
            const calendarEvents = await response.json();
            
            // Transformiere Kalender-Events zu Popup-Events
            this.events = calendarEvents
                .filter(event => {
                    const eventDate = new Date(event.date);
                    const now = new Date();
                    // Nur zukünftige oder heutige Events als Popups
                    return eventDate >= now.setHours(0,0,0,0);
                })
                .map(event => ({
                    id: `event_${event.id}`,
                    type: 'announcement',
                    active: true,
                    title: `📅 ${event.name}`,
                    message: `${event.location} - ${event.date} von ${event.time_start} bis ${event.time_end}`,
                    image: null,
                    priority: 'normal',
                    showOnce: true,
                    validUntil: new Date(event.date)
                }));
                
            console.log('Events geladen:', this.events.length);
        } catch (error) {
            console.error('Fehler beim Laden der Events:', error);
            this.events = []; // Fallback: keine Events
        }
    }

    // Notification System
    setupNotifications() {
        // Toast Container erstellen falls nicht vorhanden
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const container = document.querySelector('.toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Toast hinzufügen
        container.appendChild(toast);

        // Animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto-remove
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    }

    // Banner System
    setupBanners() {
        // Banner Container erstellen
        this.createBannerContainers();
    }

    createBannerContainers() {
        // Top Banner Container
        const topContainer = document.createElement('div');
        topContainer.className = 'banner-container banner-top';
        topContainer.id = 'top-banner-container';
        
        // Floating Banner Container
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'banner-container banner-floating';
        floatingContainer.id = 'floating-banner-container';
        
        // Banner vor dem Header einfügen
        const header = document.querySelector('.header');
        if (header) {
            header.parentNode.insertBefore(topContainer, header);
        }
        
        // Floating Banner am Ende des Body
        document.body.appendChild(floatingContainer);
    }

    displayActiveBanners() {
        const activeBanners = this.banners.filter(banner => banner.active);
        
        activeBanners.forEach(banner => {
            this.displayBanner(banner);
        });
    }

    displayBanner(banner) {
        const containerId = banner.position === 'top' ? 'top-banner-container' : 'floating-banner-container';
        const container = document.getElementById(containerId);
        
        if (!container) return;

        const bannerElement = document.createElement('div');
        bannerElement.className = `banner banner-${banner.type} banner-${banner.position}`;
        bannerElement.id = `banner-${banner.id}`;
        
        bannerElement.innerHTML = `
            <div class="banner-content">
                <div class="banner-icon">
                    <i class="${banner.icon}"></i>
                </div>
                <div class="banner-text">
                    <h4>${banner.title}</h4>
                    <p>${banner.message}</p>
                </div>
                ${banner.ctaText ? `<button class="banner-cta" onclick="moreMoriSite.handleBannerAction('${banner.id}')">${banner.ctaText}</button>` : ''}
                ${banner.showClose ? `<button class="banner-close" onclick="moreMoriSite.closeBanner('${banner.id}')"><i class="fas fa-times"></i></button>` : ''}
            </div>
        `;

        container.appendChild(bannerElement);

        // Animation
        setTimeout(() => bannerElement.classList.add('show'), 100);

        // Auto-hide
        if (banner.autoHide) {
            setTimeout(() => {
                this.closeBanner(banner.id);
            }, banner.autoHide);
        }

        // Top-Banner Padding hinzufügen
        if (banner.position === 'top') {
            this.adjustTopBannerSpacing();
        }
    }

    handleBannerAction(bannerId) {
        const banner = this.banners.find(b => b.id === bannerId);
        if (banner && banner.ctaAction) {
            banner.ctaAction();
        }
    }

    closeBanner(bannerId) {
        const bannerElement = document.getElementById(`banner-${bannerId}`);
        if (bannerElement) {
            bannerElement.classList.add('hide');
            setTimeout(() => {
                bannerElement.remove();
                this.adjustTopBannerSpacing();
            }, 300);
        }
    }

    adjustTopBannerSpacing() {
        const topContainer = document.getElementById('top-banner-container');
        const header = document.querySelector('.header');
        
        if (topContainer && header) {
            const bannerHeight = topContainer.offsetHeight;
            header.style.marginTop = bannerHeight > 0 ? `${bannerHeight}px` : '0px';
        }
    }

    // Dynamic Prices
    setupDynamicPrices() {
        // Preise in relevanten Sektionen aktualisieren
        this.updatePricesInContent();
        
        // Preis-Updates überwachen (polling simulation)
        setInterval(() => {
            this.checkForPriceUpdates();
        }, 30000); // Alle 30 Sekunden
    }

    updatePricesInContent() {
        // Event-Preise in der Events-Sektion
        const eventsSection = document.getElementById('events');
        if (eventsSection && this.prices.events) {
            this.insertEventPricing(eventsSection);
        }
        
        // Durchschnittspreise im Konzept
        const konzeptSection = document.getElementById('konzept');
        if (konzeptSection) {
            this.insertConceptPricing(konzeptSection);
        }
    }

    insertEventPricing(eventsSection) {
        const existingPricing = eventsSection.querySelector('.event-pricing');
        if (existingPricing) {
            existingPricing.remove();
        }

        // Check if we have event prices
        const eventPrices = Object.values(this.prices.events);
        if (eventPrices.length === 0) {
            return; // No event prices to display
        }

        const pricingElement = document.createElement('div');
        pricingElement.className = 'event-pricing';
        
        let pricingCards = '';
        eventPrices.forEach(event => {
            pricingCards += `
                <div class="pricing-card">
                    <h4>${event.name}</h4>
                    <div class="price">${event.price.toFixed(2)}€</div>
                    <p>${event.description || 'Event-Paket'}</p>
                </div>
            `;
        });
        
        pricingElement.innerHTML = `<div class="pricing-cards">${pricingCards}</div>`;

        const eventButton = eventsSection.querySelector('.event-button');
        if (eventButton) {
            eventButton.parentNode.insertBefore(pricingElement, eventButton);
        } else {
            eventsSection.appendChild(pricingElement);
        }
    }

    insertConceptPricing(konzeptSection) {
        const existingPricing = konzeptSection.querySelector('.concept-pricing');
        if (existingPricing) {
            existingPricing.remove();
        }

        const basePrices = Object.values(this.prices.bases);
        const creamPrices = Object.values(this.prices.creams);
        
        if (basePrices.length === 0 || creamPrices.length === 0) {
            return; // Not enough data for pricing
        }
        
        const avgBasePrice = basePrices.reduce((sum, item) => sum + item.price, 0) / basePrices.length;
        const avgCreamPrice = creamPrices.reduce((sum, item) => sum + item.price, 0) / creamPrices.length;
        const totalPrice = avgBasePrice + avgCreamPrice;

        const pricingElement = document.createElement('div');
        pricingElement.className = 'concept-pricing';
        pricingElement.innerHTML = `
            <div class="pricing-summary">
                <p class="price-info">
                    <i class="fas fa-tag"></i> 
                    Riegel ab <strong>${avgBasePrice.toFixed(2)}€</strong> + Creme/Soße ab <strong>${avgCreamPrice.toFixed(2)}€</strong> 
                    = <strong class="total-price">${totalPrice.toFixed(2)}€</strong>
                </p>
            </div>
        `;

        const comicGrid = konzeptSection.querySelector('.comic-grid');
        if (comicGrid) {
            comicGrid.parentNode.insertBefore(pricingElement, comicGrid.nextSibling);
        }
    }

    checkForPriceUpdates() {
        // Simuliere Preis-Updates vom Server
        // In einer echten App würde hier eine API abgefragt werden
        const hasUpdates = Math.random() < 0.1; // 10% Chance auf Updates
        
        if (hasUpdates) {
            this.showNotification('Preise wurden aktualisiert! 💰', 'info', 3000);
            this.updatePricesInContent();
        }
    }

    // Event Popups
    setupEventPopups() {
        // Event-Popups Container erstellen
        if (!document.querySelector('.popup-container')) {
            const container = document.createElement('div');
            container.className = 'popup-container';
            document.body.appendChild(container);
        }
    }

    showPendingPopups() {
        const activeEvents = this.events.filter(event => {
            if (!event.active) return false;
            if (event.validUntil && new Date() > event.validUntil) return false;
            if (event.showOnce && this.hasSeenEvent(event.id)) return false;
            return true;
        });

        activeEvents.forEach((event, index) => {
            setTimeout(() => {
                this.showEventPopup(event);
            }, index * 2000); // Stagger popups by 2 seconds
        });
    }

    showEventPopup(event) {
        const container = document.querySelector('.popup-container');
        if (!container) return;

        const popup = document.createElement('div');
        popup.className = `event-popup event-popup-${event.type}`;
        popup.id = `popup-${event.id}`;

        const priorityClass = event.priority === 'high' ? 'popup-priority' : '';

        popup.innerHTML = `
            <div class="popup-overlay" onclick="moreMoriSite.closeEventPopup('${event.id}')"></div>
            <div class="popup-content ${priorityClass}">
                <button class="popup-close" onclick="moreMoriSite.closeEventPopup('${event.id}')">
                    <i class="fas fa-times"></i>
                </button>
                <div class="popup-header">
                    <h3>${event.title}</h3>
                </div>
                <div class="popup-body">
                    ${event.image ? `<img src="${event.image}" alt="${event.title}" class="popup-image">` : ''}
                    <p>${event.message}</p>
                </div>
                <div class="popup-actions">
                    <button class="popup-btn popup-primary" onclick="moreMoriSite.handleEventAction('${event.id}')">
                        Mehr erfahren
                    </button>
                    <button class="popup-btn popup-secondary" onclick="moreMoriSite.closeEventPopup('${event.id}')">
                        Später
                    </button>
                </div>
            </div>
        `;

        container.appendChild(popup);

        // Animation
        setTimeout(() => popup.classList.add('show'), 100);

        // Als gesehen markieren
        if (event.showOnce) {
            this.markEventAsSeen(event.id);
        }
    }

    handleEventAction(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Event-spezifische Aktionen
        switch (eventId) {
            case 'grand-opening':
                this.scrollToSection('kalender');
                break;
            default:
                this.scrollToSection('kontakt');
        }

        this.closeEventPopup(eventId);
    }

    closeEventPopup(eventId) {
        const popup = document.getElementById(`popup-${eventId}`);
        if (popup) {
            popup.classList.add('hide');
            setTimeout(() => popup.remove(), 300);
        }
    }

    hasSeenEvent(eventId) {
        const seenEvents = JSON.parse(localStorage.getItem('moreMoriSeenEvents') || '[]');
        return seenEvents.includes(eventId);
    }

    markEventAsSeen(eventId) {
        const seenEvents = JSON.parse(localStorage.getItem('moreMoriSeenEvents') || '[]');
        if (!seenEvents.includes(eventId)) {
            seenEvents.push(eventId);
            localStorage.setItem('moreMoriSeenEvents', JSON.stringify(seenEvents));
        }
    }

    // Utility Functions
    getBannerIcon(bannerType) {
        const iconMap = {
            'launch': 'fas fa-rocket',
            'promotion': 'fas fa-percentage',
            'seasonal': 'fas fa-gift',
            'announcement': 'fas fa-bullhorn',
            'info': 'fas fa-info-circle'
        };
        return iconMap[bannerType] || 'fas fa-bullhorn';
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupHamburgerMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        }
    }

    // API Simulation (für zukünftige Integration)
    async updateDataFromAPI() {
        try {
            // Simuliere API-Calls
            // const banners = await fetch('/api/banners').then(r => r.json());
            // const prices = await fetch('/api/prices').then(r => r.json());
            // const events = await fetch('/api/events').then(r => r.json());
            
            this.showNotification('Daten wurden aktualisiert', 'success', 3000);
        } catch (error) {
            this.showNotification('Fehler beim Aktualisieren der Daten', 'error', 5000);
        }
    }
}

// Global instance
let moreMoriSite;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    moreMoriSite = new MoreMoriSite();
});

// Global functions for inline event handlers
function handleBannerAction(bannerId) {
    if (moreMoriSite) {
        moreMoriSite.handleBannerAction(bannerId);
    }
}

function closeBanner(bannerId) {
    if (moreMoriSite) {
        moreMoriSite.closeBanner(bannerId);
    }
}

function closeEventPopup(eventId) {
    if (moreMoriSite) {
        moreMoriSite.closeEventPopup(eventId);
    }
}

function handleEventAction(eventId) {
    if (moreMoriSite) {
        moreMoriSite.handleEventAction(eventId);
    }
}
