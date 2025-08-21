// MoreMori Bilder-Konfiguration
// Einfach hier die Pfade ändern und alle Bilder werden automatisch aktualisiert

const IMAGES = {
    // HERO SECTION
    hero: {
        desktop: './images/hero/main-hero.jpg',
        mobile: './images/hero/main-hero-mobile.jpg',
        fallback: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80'
    },

    // KONZEPT (3 Schritte)
    konzept: {
        schritt1: './images/konzept/schritt-1-basis.jpg',
        schritt2: './images/konzept/schritt-2-creme.jpg', 
        schritt3: './images/konzept/schritt-3-toppings.jpg',
        // Fallbacks
        fallback1: 'https://placehold.co/400x400/FFF8E1/333333?text=SCHRITT-1-BASIS',
        fallback2: 'https://placehold.co/400x400/FFF8E1/333333?text=SCHRITT-2-CREME',
        fallback3: 'https://placehold.co/400x400/FFF8E1/333333?text=SCHRITT-3-TOPPINGS'
    },

    // TEAM
    team: {
        gruender: './images/team/gruender-portrait.jpg',
        fallback: 'https://placehold.co/600x600/C4D7E0/333333?text=GRÜNDER-FOTO'
    },

    // EVENTS
    events: {
        hochzeit: './images/events/hochzeit-elegant.jpg',
        firmenevent: './images/events/firmenevent-teambuilding.jpg',
        geburtstag: './images/events/geburtstag-kinder.jpg',
        markt: './images/events/markt-stand.jpg',
        // Fallbacks (aktuelle Unsplash Bilder)
        hochzeitFallback: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        firmeneventFallback: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    },

    // GALLERY / INSTAGRAM
    gallery: {
        riegel1: './images/gallery/riegel-creation-1.jpg',
        riegel2: './images/gallery/riegel-creation-2.jpg',
        riegel3: './images/gallery/riegel-creation-3.jpg',
        riegel4: './images/gallery/riegel-creation-4.jpg',
        riegel5: './images/gallery/riegel-creation-5.jpg',
        riegel6: './images/gallery/riegel-creation-6.jpg',
        fallback: 'https://placehold.co/800x400/EED9C4/333333?text=INSTAGRAM-FEED'
    },

    // PARTNER LOGOS
    partners: {
        partner1: './images/partners/partner-logo-1.png',
        partner2: './images/partners/partner-logo-2.png', 
        partner3: './images/partners/partner-logo-3.png',
        // Fallbacks
        fallback1: 'https://placehold.co/150x75/E6E6E6/333333?text=PARTNER-1',
        fallback2: 'https://placehold.co/150x75/E6E6E6/333333?text=PARTNER-2',
        fallback3: 'https://placehold.co/150x75/E6E6E6/333333?text=PARTNER-3'
    },

    // TESTIMONIALS (Kunden-Fotos)
    testimonials: {
        kunde1: './images/testimonials/lisa-m.jpg',
        kunde2: './images/testimonials/paul-r.jpg',
        fallback1: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        fallback2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },

    // LOGOS (MoreMori Brand)
    logos: {
        main: './images/logos/moremori-logo.svg',
        favicon: './images/logos/moremori-favicon.png',
        socialMedia: './images/logos/moremori-social.png'
    }
};

// Hilfsfunktion: Prüft ob lokales Bild existiert, sonst Fallback
function getImageSrc(localPath, fallbackPath) {
    // In Zukunft kann hier eine Existenz-Prüfung rein
    return localPath || fallbackPath;
}

// Funktion zum Aktualisieren aller Bilder im HTML
function updateAllImages() {
    // Hero Image
    const heroImg = document.querySelector('.hero-bg');
    if (heroImg) {
        heroImg.src = getImageSrc(IMAGES.hero.desktop, IMAGES.hero.fallback);
    }

    // Konzept Images  
    const konzeptImgs = document.querySelectorAll('.comic-img');
    if (konzeptImgs.length >= 3) {
        konzeptImgs[0].src = getImageSrc(IMAGES.konzept.schritt1, IMAGES.konzept.fallback1);
        konzeptImgs[1].src = getImageSrc(IMAGES.konzept.schritt2, IMAGES.konzept.fallback2); 
        konzeptImgs[2].src = getImageSrc(IMAGES.konzept.schritt3, IMAGES.konzept.fallback3);
    }

    // Team Image
    const teamImg = document.querySelector('.profile-photo');
    if (teamImg) {
        teamImg.src = getImageSrc(IMAGES.team.gruender, IMAGES.team.fallback);
    }

    // Partner Logos
    const partnerImgs = document.querySelectorAll('.partner-logos img');
    if (partnerImgs.length >= 3) {
        partnerImgs[0].src = getImageSrc(IMAGES.partners.partner1, IMAGES.partners.fallback1);
        partnerImgs[1].src = getImageSrc(IMAGES.partners.partner2, IMAGES.partners.fallback2);
        partnerImgs[2].src = getImageSrc(IMAGES.partners.partner3, IMAGES.partners.fallback3);
    }

    console.log('✅ Alle Bilder wurden aktualisiert!');
}

// Auto-Update when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Auskommentiert für jetzt - aktiviere wenn lokale Bilder da sind
    // updateAllImages();
    
    console.log('🖼️ Bild-Management System geladen. Verwende updateAllImages() zum Aktualisieren.');
});

// Export für andere Scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IMAGES, getImageSrc, updateAllImages };
}
