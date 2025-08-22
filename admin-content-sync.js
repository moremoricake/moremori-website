// MoreMori Admin Content Synchronization
// Synchronisiert Content-Änderungen live zwischen Admin-Panel und Website

class AdminContentSync {
    constructor() {
        this.apiEndpoint = '/.netlify/functions/supabase-api';
        this.contentElements = new Map();
        this.init();
    }

    async init() {
        console.log('🔄 Admin Content Sync initialisiert');
        await this.loadContentFromDatabase();
        this.setupContentEditors();
        this.setupAutoSave();
    }

    // Content aus Datenbank laden und ins Admin-Panel einfügen
    async loadContentFromDatabase() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get&type=content`);
            if (!response.ok) {
                throw new Error('Fehler beim Laden der Inhalte');
            }

            const contentData = await response.json();
            console.log('📄 Content aus Datenbank geladen:', contentData.length || 0);

            // Content-Daten in Admin-Panel anzeigen
            this.populateContentSection(contentData);
            
        } catch (error) {
            console.error('❌ Fehler beim Laden der Inhalte:', error);
            this.showNotification('Fehler beim Laden der Inhalte aus der Datenbank', 'error');
        }
    }

    // Content-Sektion im Admin mit Datenbank-Inhalten füllen
    populateContentSection(contentData) {
        const contentSection = document.getElementById('content');
        if (!contentSection) return;

        // Bestehende Content-Container leeren
        const existingContainer = contentSection.querySelector('.content-items-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Neuen Container erstellen
        const container = document.createElement('div');
        container.className = 'content-items-container';
        container.style.cssText = `
            display: grid;
            gap: 20px;
            margin-top: 20px;
        `;

        // Content-Items aus Datenbank anzeigen
        if (Array.isArray(contentData) && contentData.length > 0) {
            contentData.forEach(item => {
                const contentCard = this.createContentCard(item);
                container.appendChild(contentCard);
            });
        } else {
            // Standard-Content hinzufügen wenn Datenbank leer ist
            this.addDefaultContent(container);
        }

        // Nach der Content-Sektion einfügen
        const sectionHeader = contentSection.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.insertAdjacentElement('afterend', container);
        }
    }

    // Content-Card für einzelnes Content-Item erstellen
    createContentCard(item) {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #e1e5e9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        const sectionBadge = this.getSectionBadge(item.section);
        
        card.innerHTML = `
            <div class="content-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <span class="section-badge" style="background: ${sectionBadge.color}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${sectionBadge.label}</span>
                    <h3 style="margin: 8px 0 0 0; color: #2c3e50;">${item.key || 'Content'}</h3>
                </div>
                <div class="content-actions">
                    <button class="btn-edit" onclick="contentSync.editContent('${item.id}')" style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 5px; margin-right: 5px; cursor: pointer;">
                        <i class="fas fa-edit"></i> Bearbeiten
                    </button>
                    <button class="btn-delete" onclick="contentSync.deleteContent('${item.id}')" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="content-details">
                <div style="margin-bottom: 10px;">
                    <strong>Titel:</strong> <span class="content-title">${item.title || 'Kein Titel'}</span>
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Inhalt:</strong>
                    <div class="content-text" style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 5px; max-height: 100px; overflow-y: auto;">
                        ${item.content || 'Kein Inhalt'}
                    </div>
                </div>
                <div style="font-size: 12px; color: #6c757d;">
                    <strong>Letzte Änderung:</strong> ${new Date(item.updated_at || item.created_at).toLocaleDateString('de-DE')}
                </div>
            </div>
        `;

        return card;
    }

    // Section Badge mit Farbe
    getSectionBadge(section) {
        const badges = {
            'hero': { label: 'Hero-Bereich', color: '#ff6b6b' },
            'about': { label: 'Über uns', color: '#4ecdc4' },
            'process': { label: '3-Schritte', color: '#45b7d1' },
            'events': { label: 'Events', color: '#96c93f' },
            'contact': { label: 'Kontakt', color: '#f7931e' },
            'footer': { label: 'Footer', color: '#6c757d' },
            'default': { label: section || 'Allgemein', color: '#007bff' }
        };

        return badges[section] || badges.default;
    }

    // Standard-Content hinzufügen falls Datenbank leer
    addDefaultContent(container) {
        const defaultContent = [
            { id: 'temp-1', section: 'hero', key: 'title', title: 'Hauptslogan', content: 'Süße Momente zum Selbergestalten.' },
            { id: 'temp-2', section: 'hero', key: 'subtitle', title: 'Untertitel', content: 'Ulms erste interaktive Cake-Bar, bei der DU der Künstler bist.' },
            { id: 'temp-3', section: 'about', key: 'text', title: 'Über uns Text', content: 'Als Gründer von MoreMori lebe ich meine Leidenschaft für Süßes aus.' }
        ];

        defaultContent.forEach(item => {
            const card = this.createContentCard(item);
            container.appendChild(card);
        });

        // Hinweis anzeigen
        const notice = document.createElement('div');
        notice.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        `;
        notice.innerHTML = `
            <i class="fas fa-info-circle"></i> 
            <strong>Hinweis:</strong> Es wurden noch keine Inhalte in der Datenbank gefunden. 
            Diese Beispiel-Inhalte werden angezeigt. Bearbeite sie, um sie in der Datenbank zu speichern.
        `;
        container.insertBefore(notice, container.firstChild);
    }

    // Content bearbeiten
    async editContent(contentId) {
        console.log('✏️ Bearbeite Content:', contentId);
        
        // Modal für Content-Bearbeitung erstellen
        const modal = this.createEditModal(contentId);
        document.body.appendChild(modal);

        // Content-Daten laden falls nicht temporär
        if (!contentId.startsWith('temp-')) {
            try {
                const response = await fetch(`${this.apiEndpoint}?action=get&type=content&id=${contentId}`);
                if (response.ok) {
                    const contentItem = await response.json();
                    this.populateEditModal(modal, contentItem);
                }
            } catch (error) {
                console.error('Fehler beim Laden des Content-Items:', error);
            }
        }
    }

    // Edit-Modal erstellen
    createEditModal(contentId) {
        const modal = document.createElement('div');
        modal.className = 'content-edit-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #f8f9fa;">
                    <h2 style="margin: 0; color: #2c3e50;">
                        <i class="fas fa-edit"></i> Content bearbeiten
                    </h2>
                    <button class="close-btn" onclick="contentSync.closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6c757d;">&times;</button>
                </div>
                
                <form class="content-edit-form" onsubmit="contentSync.saveContent(event, '${contentId}')">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Bereich:</label>
                        <select name="section" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <option value="hero">Hero-Bereich</option>
                            <option value="about">Über uns</option>
                            <option value="process">3-Schritte Prozess</option>
                            <option value="events">Events</option>
                            <option value="contact">Kontakt</option>
                            <option value="footer">Footer</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Schlüssel:</label>
                        <input type="text" name="key" placeholder="z.B. title, subtitle, text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" required>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Titel:</label>
                        <input type="text" name="title" placeholder="Titel für das Content-Element" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Inhalt:</label>
                        <textarea name="content" rows="5" placeholder="Content-Text eingeben..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical;" required></textarea>
                    </div>
                    
                    <div class="form-actions" style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="contentSync.closeModal()" style="background: #6c757d; color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer;">
                            Abbrechen
                        </button>
                        <button type="submit" style="background: #28a745; color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-save"></i> Speichern
                        </button>
                    </div>
                </form>
            </div>
        `;

        return modal;
    }

    // Modal schließen
    closeModal() {
        const modal = document.querySelector('.content-edit-modal');
        if (modal) {
            modal.remove();
        }
    }

    // Content speichern
    async saveContent(event, contentId) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            section: formData.get('section'),
            key: formData.get('key'),
            title: formData.get('title'),
            content: formData.get('content'),
            is_active: true
        };

        try {
            let response;
            if (contentId.startsWith('temp-')) {
                // Neuen Content erstellen
                response = await fetch(`${this.apiEndpoint}?action=create&type=content`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                // Bestehenden Content aktualisieren
                response = await fetch(`${this.apiEndpoint}?action=update&type=content&id=${contentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            if (response.ok) {
                this.showNotification('Content erfolgreich gespeichert! Die Änderungen sind sofort live.', 'success');
                this.closeModal();
                
                // Content-Sektion neu laden
                await this.loadContentFromDatabase();
                
                // Cache der Hauptseite leeren (Browser-seitig)
                this.clearWebsiteCache();
                
            } else {
                throw new Error('Fehler beim Speichern');
            }

        } catch (error) {
            console.error('❌ Fehler beim Speichern:', error);
            this.showNotification('Fehler beim Speichern des Contents', 'error');
        }
    }

    // Website-Cache leeren (für sofortige Aktualisierung)
    clearWebsiteCache() {
        // Service Worker Cache löschen falls vorhanden
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    registration.update();
                });
            });
        }
        
        // Browser-Cache für die Hauptseite löschen
        fetch('/', { cache: 'reload' }).catch(() => {});
    }

    // Content löschen
    async deleteContent(contentId) {
        if (!confirm('Möchtest du diesen Content-Eintrag wirklich löschen?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiEndpoint}?action=delete&type=content&id=${contentId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showNotification('Content erfolgreich gelöscht', 'success');
                await this.loadContentFromDatabase();
            } else {
                throw new Error('Fehler beim Löschen');
            }

        } catch (error) {
            console.error('❌ Fehler beim Löschen:', error);
            this.showNotification('Fehler beim Löschen des Contents', 'error');
        }
    }

    // Setup Content-Editoren
    setupContentEditors() {
        // Inline-Editing für bestehende Text-Elemente aktivieren
        document.querySelectorAll('[data-editable]').forEach(element => {
            element.addEventListener('click', () => {
                this.makeEditable(element);
            });
        });
    }

    // Auto-Save Setup
    setupAutoSave() {
        // Auto-Save für Formulare alle 30 Sekunden
        setInterval(() => {
            this.autoSave();
        }, 30000);
    }

    // Notification anzeigen
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 1001;
            max-width: 400px;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; margin-left: auto;">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove nach 5 Sekunden
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Auto-Save implementieren
    autoSave() {
        console.log('💾 Auto-Save ausgeführt');
        // Implementierung für automatisches Speichern
    }
}

// Content Sync global verfügbar machen
let contentSync;

// Initialisierung wenn Admin-Panel geladen ist
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('content')) {
        contentSync = new AdminContentSync();
        console.log('🚀 Admin Content Sync aktiviert');
    }
});
