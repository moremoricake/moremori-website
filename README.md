# MoreMori Sweet it yourself 🧁

Eine professionelle Landing Page für Ulms erste interaktive mobile Cake-Bar mit vollständigem Admin-Panel.

## 📁 Projektstruktur

```
W:\Bake\
├── index.html           # Haupt-Landing Page
├── style.css           # Landing Page Styling
├── admin.html          # Admin-Panel Interface  
├── admin-style.css     # Admin-Panel Styling
├── admin-script.js     # Admin-Panel JavaScript
├── admin-backend.php   # PHP Backend für Datenverwaltung
└── README.md          # Diese Dokumentation
```

## 🌟 Features

### **Landing Page:**
- ✅ **Responsive Design** (Mobile-First)
- ✅ **Moderne Farbverläufe** und Animationen
- ✅ **3-Schritte Comic-Anleitung** für DIY-Konzept
- ✅ **Mehrfache Kontaktmöglichkeiten** (WhatsApp, E-Mail, Telefon)
- ✅ **Kontaktformular** für direkte Anfragen
- ✅ **Allergie-Warnungen** mit ⚠️ Symbolen
- ✅ **Event-Catering** Sektion
- ✅ **Newsletter-Anmeldung**
- ✅ **Social Media Integration**

### **Admin-Panel:**
- ✅ **Dashboard** mit Übersicht
- ✅ **Produktbilder verwalten** (Upload, Bearbeiten, Löschen)
- ✅ **Preise ändern** für alle Produkte und Services
- ✅ **Inhalte bearbeiten** (Texte, Beschreibungen)
- ✅ **Kalender-Management** (Termine hinzufügen/löschen)
- ✅ **Allergie-Warnungen konfigurieren** ⚠️
- ✅ **Einstellungen** (Kontaktdaten, Social Media)
- ✅ **Responsive Admin-Interface**

## 🚀 Quick Start

### 1. Website ansehen:
```bash
# Im Browser öffnen
start index.html
```

### 2. Admin-Panel öffnen:
```bash
# Admin-Panel im Browser öffnen
start admin.html
```

### 3. Mit lokalem Server (empfohlen):
```bash
# PHP Development Server starten
php -S localhost:8000

# Dann öffnen:
# http://localhost:8000/index.html
# http://localhost:8000/admin.html
```

## 🎨 Design-Updates

Das Design wurde modernisiert mit:
- **Lebendige Farbpalette:** Pink-Akzente (#E91E63) für mehr Aufmerksamkeit
- **Gradient-Hintergründe** für moderne Optik
- **Verbesserte Button-Animationen** mit Glanz-Effekten
- **Erweiterte Kontaktoptionen** mit WhatsApp-Integration
- **Professionelle Schatten** und Hover-Effekte

## ⚙️ Admin-Panel Funktionen

### **Dashboard:**
- Schnellübersicht aller wichtigen Kennzahlen
- Direkte Sprunglinks zu den verschiedenen Bereichen

### **Produktbilder:** 📸
- Drag & Drop Bildupload
- Bildverwaltung mit Vorschau
- Alt-Text und Beschreibungen editieren

### **Preise:** 💰
- **Basis-Riegel:** MoreMori Wolke, Mokka-Traum
- **Toppings:** Vanille-Creme, Erdbeersoße, Karamell
- **Event-Pakete:** Basis- und Premium-Pakete

### **Allergie-Warnungen:** ⚠️
- Checkbox-System für alle Allergene
- **Live-Vorschau** der Warnung
- Automatische Anzeige auf der Website

### **Kalender:** 📅
- Events hinzufügen/bearbeiten/löschen
- Datum, Zeit und Ort verwalten
- Automatische Website-Aktualisierung

## 🔧 Backend-API

Das PHP-Backend bietet folgende Endpunkte:

```php
GET    /admin-backend.php?action=data        # Alle Daten abrufen
POST   /admin-backend.php?action=upload      # Bild hochladen  
PUT    /admin-backend.php?action=prices      # Preise aktualisieren
DELETE /admin-backend.php?action=image&id=1  # Bild löschen
POST   /admin-backend.php?action=contact     # Kontaktformular
POST   /admin-backend.php?action=newsletter  # Newsletter-Anmeldung
```

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** > 1024px

## 🎯 Content Management Features

Entsprechend deiner Regel können folgende Inhalte einfach geändert werden:

### ✅ **Produktbilder:** 
- Upload über Admin-Panel
- Automatische Optimierung
- Alt-Text Management

### ✅ **Preise:**
- Einfache Eingabefelder
- Euro-Formatierung
- Sofortige Aktualisierung

### ✅ **Beschreibungen:**
- WYSIWYG-ähnliche Bearbeitung
- Multi-Line Support
- Live-Vorschau

### ✅ **Allergie-Warnungen:**
- Checkbox-System
- **Automatische ⚠️ Symbole**
- Compliance-ready

## 🔒 Sicherheit

**Wichtige Sicherheitshinweise für Produktion:**

1. **Passwörter ändern** in `admin-backend.php`
2. **API-Keys** über Umgebungsvariablen setzen
3. **HTTPS** verwenden
4. **Input-Validierung** auf Server-Seite
5. **Backup-System** einrichten

## 🚀 Deployment

### **Für Live-Betrieb:**

1. **Webserver** mit PHP 7.4+ 
2. **SSL-Zertifikat** installieren
3. **Backup-System** einrichten
4. **Admin-Zugangsdaten** sicher konfigurieren

### **Empfohlene Hosting-Provider:**
- **All-Inkl.com** (Deutschland)
- **Strato** 
- **1und1/IONOS**

## 📞 Kontaktdaten anpassen

Im Admin-Panel unter **"Einstellungen"** können geändert werden:
- Telefonnummer: `+49 123 456 7890`
- E-Mail: `info@moremori.de`  
- WhatsApp: `+49 123 456 7890`
- Social Media Links

## 🆘 Support

Das System ist so konzipiert, dass auch technische Laien die wichtigsten Inhalte über das Admin-Panel ändern können.

**Bei Problemen:**
1. Browser-Cache leeren
2. Admin-Panel neu laden
3. PHP-Logs prüfen

## 📈 Nächste Entwicklungsschritte

**Mögliche Erweiterungen:**
- 🛒 **Online-Shop** Integration
- 📊 **Analytics** Dashboard  
- 🔔 **Push-Notifications**
- 📧 **E-Mail-Marketing** Integration
- 💳 **Payment-Gateway** für Events
- 🗺️ **Google Maps** Integration

---

**Entwickelt für MoreMori - Süße Momente zum Selbergestalten** ✨
