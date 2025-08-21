# MoreMori - Ulms erste interaktive Cake-Bar 🍰

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/moremori/deploys)

Willkommen bei MoreMori, der ersten interaktiven Cake-Bar in Ulm! Hier können Kunden ihre eigenen süßen Kreationen zusammenstellen.

🚀 **Live Website:** [moremori.netlify.app](https://moremori.netlify.app) _(nach Deployment)_

## 🌟 Features

- **🍰 Interaktive Cake-Bar** - Kunden gestalten ihre eigenen Desserts
- **📱 Responsive Design** - Optimiert für alle Geräte
- **⚡ Serverless Backend** - Netlify Functions + Supabase
- **🎨 Admin-Panel** - Preise, Inhalte und Banner verwalten
- **🖼️ Bild-Upload** - Supabase Storage Integration
- **📅 Event-Management** - Kalender und Popup-System
- **💬 FAQ-System** - Dynamisch verwaltbare FAQs
- **🏷️ Banner-Management** - Promo-Banner mit Admin-Interface

## 🛠️ Technologie Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Backend:** Netlify Functions (JavaScript)
- **Datenbank:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Deployment:** Netlify
- **Version Control:** Git + GitHub

## 🚀 Quick Start

### 1. Repository klonen
```bash
git clone https://github.com/YOUR-USERNAME/moremori-website.git
cd moremori-website
```

### 2. Supabase konfigurieren
1. Erstelle ein [Supabase](https://supabase.com) Projekt
2. Führe `supabase-schema.sql` in der SQL-Konsole aus
3. Erstelle einen Storage Bucket namens `moremori-images`
4. Konfiguriere Environment Variables (siehe Deployment)

### 3. Lokal entwickeln
```bash
npm install
npm run dev
```

### 4. Auf Netlify deployen
1. Erstelle einen [Netlify](https://netlify.com) Account
2. Verbinde dein GitHub Repository
3. Konfiguriere Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy! 🚀

> Detaillierte Anleitung in [DEPLOY.md](DEPLOY.md)

## 📁 Projektstruktur

```
moremori-website/
├── 📄 index.html              # Hauptseite
├── 📄 admin.html              # Admin-Panel
├── 🎨 style.css               # Hauptstyles
├── 🎨 main-features.css       # Feature-Styles
├── 🎨 admin-style.css         # Admin-Styles
├── ⚡ main.js                 # Frontend Logic
├── ⚡ admin-script.js         # Admin Logic
├── 📦 netlify/
│   └── functions/
│       └── supabase-api.js    # Serverless API
├── 🗄️ supabase-schema.sql    # Datenbankschema
├── ⚙️ netlify.toml           # Netlify Config
├── 📦 package.json           # Dependencies
└── 📖 DEPLOY.md              # Deployment Guide
```

## 🔧 Technische Details

### Frontend
- **HTML5** mit semantischen Strukturen
- **CSS3** mit Flexbox und Grid
- **Vanilla JavaScript** (ES6+) - keine Frameworks!
- **Responsive Design** für alle Geräte
- **Accessibility** Features
- **Performance-optimiert**

### Backend
- **Serverless Functions** (Netlify)
- **PostgreSQL** Datenbank (Supabase)
- **REST API** für alle CRUD-Operationen
- **File Upload** zu Cloud Storage
- **Environment-basierte Konfiguration**

## 🔐 Environment Variables

Für Netlify Deployment benötigte Variablen:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Roadmap

- [ ] Online-Bestellsystem
- [ ] PayPal/Stripe Integration
- [ ] Kunden-Account System
- [ ] Push-Benachrichtigungen
- [ ] Mobile App (PWA)
- [ ] Multi-Language Support

## 📞 Support & Kontakt

- 🌐 **Website:** [moremori.de](https://moremori.de)
- 📧 **E-Mail:** info@moremori.de
- 📱 **WhatsApp:** +49 123 456 7890
- 📍 **Standort:** Ulm, Deutschland

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

---

*Erstellt mit ❤️ in Ulm für süße Momente zum Selbergestalten* 🍰

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/YOUR-USERNAME/moremori-website)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7.svg)](https://netlify.com)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E.svg)](https://supabase.com)
