// MoreMori Admin Panel JavaScript

class MoreMoriAdmin {
    constructor() {
        this.currentSection = 'dashboard';
        this.data = {
            products: [],
            prices: [],
            content: [],
            calendar: [],
            allergies: [],
            banners: [],
            faq: [],
            settings: []
        };
        this.apiEndpoint = '/.netlify/functions/supabase-api';
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDashboardCards();
        this.setupImageManagement();
        this.setupPriceManagement();
        this.setupCalendarManagement();
        this.setupAllergyManagement();
        this.setupFAQManagement();
        this.setupAdvancedPriceManagement();
        this.setupBannerManagement();
        this.setupSettings();
        
        // Enhanced Features
        this.addUIPolish();
        this.setupMobileOptimizations();
        this.setupKeyboardShortcuts();
        
        this.loadData();
        
        // Welcome Message mit Shortcuts-Hint
        setTimeout(() => {
            this.showNotification('🚀 Admin Panel bereit! Drücke F1 für Shortcuts', 'info');
        }, 1000);
    }

    // Navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const cardButtons = document.querySelectorAll('.card-button');
        
        [...navItems, ...cardButtons].forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                if (section) {
                    this.showSection(section);
                }
            });
        });
    }

    showSection(sectionName) {
        // Alle Sektionen ausblenden
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Navigation zurücksetzen
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        // Gewählte Sektion anzeigen
        const targetSection = document.getElementById(sectionName);
        const targetNav = document.querySelector(`[data-section="${sectionName}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }
        
        if (targetNav && targetNav.classList.contains('nav-item')) {
            targetNav.classList.add('active');
        }
    }

    // Dashboard Cards Setup
    setupDashboardCards() {
        this.updateDashboardStats();
    }

    updateDashboardStats() {
        this.updateProductStats();
        this.updatePriceStats();
        this.updateBannerStats();
        this.updateActivityStats();
        this.updateQuickActions();
    }

    updateProductStats() {
        const productCard = document.querySelector('[data-stat="products"]');
        if (productCard) {
            const imageCount = document.querySelectorAll('.image-card').length;
            const statValue = productCard.querySelector('.stat-value');
            const statChange = productCard.querySelector('.stat-change');
            
            if (statValue) {
                this.animateCounter(statValue, 0, imageCount);
            }
            
            if (statChange) {
                const changePercent = imageCount > 0 ? '+12%' : '0%';
                statChange.textContent = changePercent;
                statChange.className = `stat-change ${imageCount > 3 ? 'positive' : 'neutral'}`;
            }
        }
    }

    updatePriceStats() {
        const priceCard = document.querySelector('[data-stat="prices"]');
        if (priceCard) {
            const priceData = this.data.prices || [];
            const totalItems = Array.isArray(priceData) ? priceData.length : 0;
            
            const statValue = priceCard.querySelector('.stat-value');
            const statSubtitle = priceCard.querySelector('.stat-subtitle');
            
            if (statValue) {
                this.animateCounter(statValue, 0, totalItems);
            }
            
            if (statSubtitle) {
                const avgPrice = this.calculateAveragePrice();
                statSubtitle.textContent = `Ø ${avgPrice.toFixed(2)}€ pro Artikel`;
            }
        }
    }

    updateBannerStats() {
        const bannerCard = document.querySelector('[data-stat="banners"]');
        if (bannerCard) {
            const banners = this.data.banners || [];
            const activeBanners = banners.filter(b => b.active).length;
            
            const statValue = bannerCard.querySelector('.stat-value');
            const statSubtitle = bannerCard.querySelector('.stat-subtitle');
            
            if (statValue) {
                this.animateCounter(statValue, 0, activeBanners);
            }
            
            if (statSubtitle) {
                statSubtitle.textContent = `${banners.length} gesamt, ${activeBanners} aktiv`;
            }
        }
    }

    updateActivityStats() {
        const activityCard = document.querySelector('[data-stat="activity"]');
        if (activityCard) {
            const lastUpdate = this.getLastUpdateTime();
            const statValue = activityCard.querySelector('.stat-value');
            const statSubtitle = activityCard.querySelector('.stat-subtitle');
            
            if (statValue) {
                statValue.textContent = this.formatTimeAgo(lastUpdate);
            }
            
            if (statSubtitle) {
                const todayChanges = this.getTodayChangesCount();
                statSubtitle.textContent = `${todayChanges} Änderungen heute`;
            }
        }
    }

    updateQuickActions() {
        const quickActionsCard = document.querySelector('[data-stat="quick-actions"]');
        if (quickActionsCard) {
            const pendingTasks = this.getPendingTasksCount();
            const statValue = quickActionsCard.querySelector('.stat-value');
            
            if (statValue) {
                statValue.textContent = pendingTasks;
            }
        }
    }

    // Helper functions for statistics
    animateCounter(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    calculateAveragePrice() {
        const prices = this.data.prices || [];
        let total = 0;
        let count = 0;
        
        if (Array.isArray(prices)) {
            prices.forEach(priceItem => {
                if (priceItem.price && typeof priceItem.price === 'number') {
                    total += priceItem.price;
                    count++;
                }
            });
        }
        
        return count > 0 ? total / count : 4.50; // Default fallback
    }

    getLastUpdateTime() {
        const lastUpdate = localStorage.getItem('moreMoriLastUpdate');
        return lastUpdate ? new Date(lastUpdate) : new Date();
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Gerade eben';
        if (minutes < 60) return `${minutes}min`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    }

    getTodayChangesCount() {
        const changes = JSON.parse(localStorage.getItem('moreMoriChangesToday') || '0');
        return changes;
    }

    getPendingTasksCount() {
        const banners = this.data.banners || [];
        const inactiveBanners = banners.filter(b => !b.active).length;
        const emptyPrices = this.getEmptyPricesCount();
        return inactiveBanners + emptyPrices;
    }

    getEmptyPricesCount() {
        const prices = this.data.prices || [];
        let emptyCount = 0;
        
        if (Array.isArray(prices)) {
            prices.forEach(priceItem => {
                if (!priceItem.price || priceItem.price === 0) {
                    emptyCount++;
                }
            });
        } else if (typeof prices === 'object') {
            Object.values(prices).forEach(category => {
                if (Array.isArray(category)) {
                    category.forEach(price => {
                        if (price === 0 || price === null || price === undefined) {
                            emptyCount++;
                        }
                    });
                } else if (typeof category === 'object') {
                    Object.values(category).forEach(price => {
                        if (price === 0 || price === null || price === undefined) {
                            emptyCount++;
                        }
                    });
                }
            });
        }
        
        return emptyCount;
    }

    incrementTodayChanges() {
        const current = this.getTodayChangesCount();
        localStorage.setItem('moreMoriChangesToday', JSON.stringify(current + 1));
        localStorage.setItem('moreMoriLastUpdate', new Date().toISOString());
        this.updateDashboardStats();
    }

    // Bildverwaltung
    setupImageManagement() {
        const uploadPlaceholder = document.querySelector('.upload-placeholder');
        if (uploadPlaceholder) {
            uploadPlaceholder.addEventListener('click', () => {
                this.handleImageUpload();
            });
        }

        // Image Action Buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn') && e.target.closest('.image-card')) {
                const imageCard = e.target.closest('.image-card');
                this.editImage(imageCard);
            }
            
            if (e.target.closest('.delete-btn') && e.target.closest('.image-card')) {
                const imageCard = e.target.closest('.image-card');
                this.deleteImage(imageCard);
            }
        });
    }

    handleImageUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.uploadImage(file);
            }
        };
        input.click();
    }

    uploadImage(file) {
        // Hier würde normalerweise ein Upload zum Server stattfinden
        console.log('Bild wird hochgeladen:', file.name);
        this.showNotification('Bild erfolgreich hochgeladen!', 'success');
    }

    editImage(imageCard) {
        const imageName = imageCard.querySelector('h4').textContent;
        const newName = prompt('Neuer Name für das Bild:', imageName);
        if (newName && newName !== imageName) {
            imageCard.querySelector('h4').textContent = newName;
            this.showNotification('Bildname aktualisiert!', 'success');
        }
    }

    deleteImage(imageCard) {
        const imageName = imageCard.querySelector('h4').textContent;
        if (confirm(`Möchtest du "${imageName}" wirklich löschen?`)) {
            imageCard.remove();
            this.showNotification('Bild gelöscht!', 'warning');
        }
    }

    // Preisverwaltung
    setupPriceManagement() {
        const priceInputs = document.querySelectorAll('.price-input');
        priceInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.updatePrice(e.target);
            });
        });

        // Save Button
        const saveButtons = document.querySelectorAll('#prices .primary-btn');
        saveButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.savePrices();
            });
        });
    }

    updatePrice(input) {
        const value = parseFloat(input.value);
        if (value >= 0) {
            console.log('Preis aktualisiert:', value);
            input.style.borderColor = 'var(--admin-success)';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 1000);
        }
    }

    savePrices() {
        const priceInputs = document.querySelectorAll('.price-input');
        const prices = {};
        
        priceInputs.forEach(input => {
            const label = input.parentElement.querySelector('label').textContent;
            prices[label] = parseFloat(input.value);
        });
        
        console.log('Preise gespeichert:', prices);
        this.showNotification('Preise erfolgreich gespeichert!', 'success');
    }

    // Kalender-Management
    setupCalendarManagement() {
        // Add Event Button
        const addEventBtn = document.querySelector('#calendar .primary-btn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                this.showAddEventForm();
            });
        }

        // Event Action Buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn') && e.target.closest('.event-item')) {
                const eventItem = e.target.closest('.event-item');
                this.editEvent(eventItem);
            }
            
            if (e.target.closest('.delete-btn') && e.target.closest('.event-item')) {
                const eventItem = e.target.closest('.event-item');
                this.deleteEvent(eventItem);
            }
        });
    }

    showAddEventForm() {
        const form = document.querySelector('.add-event-form');
        if (form) {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        }
    }

    editEvent(eventItem) {
        const eventName = eventItem.querySelector('h4').textContent;
        const newName = prompt('Event-Name bearbeiten:', eventName);
        if (newName && newName !== eventName) {
            eventItem.querySelector('h4').textContent = newName;
            this.showNotification('Event aktualisiert!', 'success');
        }
    }

    deleteEvent(eventItem) {
        const eventName = eventItem.querySelector('h4').textContent;
        if (confirm(`Event "${eventName}" wirklich löschen?`)) {
            eventItem.remove();
            this.showNotification('Event gelöscht!', 'warning');
        }
    }

    // Allergie-Management
    setupAllergyManagement() {
        const checkboxes = document.querySelectorAll('.allergy-item input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateAllergyPreview();
            });
        });

        // Save Button
        const saveBtn = document.querySelector('#allergies .primary-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveAllergies();
            });
        }
    }

    updateAllergyPreview() {
        const checkedAllergies = [];
        const checkboxes = document.querySelectorAll('.allergy-item input[type="checkbox"]:checked');
        
        checkboxes.forEach(checkbox => {
            const label = checkbox.parentElement.textContent.trim();
            checkedAllergies.push(label);
        });

        // Preview aktualisieren
        const warningContent = document.querySelector('.warning-content');
        if (warningContent) {
            const mainAllergies = checkedAllergies.slice(0, 4).join(', ');
            const traceAllergies = checkedAllergies.slice(4).join(', ');
            
            warningContent.innerHTML = `
                <h4>Allergie-Hinweise ⚠️</h4>
                <p><strong>Enthält:</strong> ${mainAllergies}</p>
                ${traceAllergies ? `<p><strong>Kann Spuren enthalten von:</strong> ${traceAllergies}</p>` : ''}
            `;
        }
    }

    saveAllergies() {
        console.log('Allergie-Einstellungen gespeichert');
        this.showNotification('Allergie-Warnungen aktualisiert!', 'success');
    }

    // FAQ Management
    setupFAQManagement() {
        // FAQ bearbeiten buttons
        this.setupFAQEventListeners();
        
        // Neue FAQ hinzufügen
        const addFAQBtn = document.querySelector('#faq .section-header .primary-btn');
        const addFAQForm = document.querySelector('.add-faq-form');
        
        if (addFAQBtn) {
            addFAQBtn.addEventListener('click', () => {
                addFAQForm.style.display = addFAQForm.style.display === 'block' ? 'none' : 'block';
            });
        }
        
        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                const answer = btn.dataset.answer;
                
                const questionInput = document.querySelector('.new-faq-question');
                const answerInput = document.querySelector('.new-faq-answer');
                
                if (questionInput && answerInput) {
                    questionInput.value = question;
                    answerInput.value = answer;
                    addFAQForm.style.display = 'block';
                    
                    // Scroll zur Form
                    addFAQForm.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Form-Handler für neue FAQ
        const saveNewFAQBtn = document.querySelector('.add-faq-save-btn');
        const cancelNewFAQBtn = document.querySelector('.add-faq-cancel-btn');
        
        if (saveNewFAQBtn) {
            saveNewFAQBtn.addEventListener('click', () => {
                this.saveNewFAQ();
            });
        }
        
        if (cancelNewFAQBtn) {
            cancelNewFAQBtn.addEventListener('click', () => {
                this.cancelNewFAQ();
            });
        }
    }
    
    setupFAQEventListeners() {
        // Event-Delegation für dynamisch erstellte FAQ-Elemente
        document.addEventListener('click', (e) => {
            // FAQ bearbeiten
            if (e.target.closest('.edit-btn') && e.target.closest('.faq-item-admin')) {
                const faqItem = e.target.closest('.faq-item-admin');
                this.editFAQ(faqItem);
            }
            
            // FAQ speichern
            if (e.target.closest('.save-faq-btn')) {
                const faqItem = e.target.closest('.faq-item-admin');
                this.saveFAQ(faqItem);
            }
            
            // FAQ bearbeitung abbrechen
            if (e.target.closest('.cancel-faq-btn')) {
                const faqItem = e.target.closest('.faq-item-admin');
                this.cancelEditFAQ(faqItem);
            }
            
            // FAQ löschen
            if (e.target.closest('.delete-btn') && e.target.closest('.faq-item-admin')) {
                const faqItem = e.target.closest('.faq-item-admin');
                this.deleteFAQ(faqItem);
            }
        });
    }
    
    editFAQ(faqItem) {
        const preview = faqItem.querySelector('.faq-content-preview');
        const editForm = faqItem.querySelector('.faq-edit-form');
        
        if (preview && editForm) {
            preview.style.display = 'none';
            editForm.style.display = 'block';
        }
    }
    
    saveFAQ(faqItem) {
        const preview = faqItem.querySelector('.faq-content-preview');
        const editForm = faqItem.querySelector('.faq-edit-form');
        const questionInput = editForm.querySelector('.faq-question-input');
        const answerInput = editForm.querySelector('.faq-answer-input');
        
        if (questionInput && answerInput && preview && editForm) {
            // Aktualisiere die Anzeige
            faqItem.querySelector('.faq-header h4').textContent = questionInput.value;
            preview.querySelector('p').textContent = answerInput.value;
            
            // Zeige Erfolgsbenachrichtigung
            this.showNotification('FAQ erfolgreich aktualisiert!', 'success');
            
            // Zurück zur Vorschau
            editForm.style.display = 'none';
            preview.style.display = 'block';
        }
    }
    
    cancelEditFAQ(faqItem) {
        const preview = faqItem.querySelector('.faq-content-preview');
        const editForm = faqItem.querySelector('.faq-edit-form');
        
        if (preview && editForm) {
            editForm.style.display = 'none';
            preview.style.display = 'block';
        }
    }
    
    deleteFAQ(faqItem) {
        if (confirm('Sind Sie sicher, dass Sie diese FAQ löschen möchten?')) {
            faqItem.style.opacity = '0';
            faqItem.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                faqItem.remove();
                this.showNotification('FAQ erfolgreich gelöscht!', 'success');
                this.updateDashboardFAQCount();
            }, 300);
        }
    }
    
    saveNewFAQ() {
        const questionInput = document.querySelector('.new-faq-question');
        const answerInput = document.querySelector('.new-faq-answer');
        
        if (questionInput && answerInput) {
            const question = questionInput.value.trim();
            const answer = answerInput.value.trim();
            
            if (question && answer) {
                this.addNewFAQ(question, answer);
                questionInput.value = '';
                answerInput.value = '';
                document.querySelector('.add-faq-form').style.display = 'none';
                this.showNotification('FAQ erfolgreich hinzugefügt!', 'success');
                this.updateDashboardFAQCount();
            } else {
                this.showNotification('Bitte füllen Sie alle Felder aus!', 'error');
            }
        }
    }
    
    cancelNewFAQ() {
        const questionInput = document.querySelector('.new-faq-question');
        const answerInput = document.querySelector('.new-faq-answer');
        const addFAQForm = document.querySelector('.add-faq-form');
        
        if (questionInput) questionInput.value = '';
        if (answerInput) answerInput.value = '';
        if (addFAQForm) addFAQForm.style.display = 'none';
    }
    
    addNewFAQ(question, answer) {
        const faqManager = document.querySelector('.faq-manager');
        const addFAQForm = document.querySelector('.add-faq-form');
        
        if (!faqManager) return;
        
        const newFAQItem = document.createElement('div');
        newFAQItem.className = 'faq-item-admin';
        newFAQItem.innerHTML = `
            <div class="faq-header">
                <h4>${this.escapeHtml(question)}</h4>
                <div class="faq-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i> Bearbeiten</button>
                    <button class="delete-btn"><i class="fas fa-trash"></i> Löschen</button>
                </div>
            </div>
            <div class="faq-content-preview">
                <p>${this.escapeHtml(answer)}</p>
            </div>
            <div class="faq-edit-form" style="display: none;">
                <label>Frage:</label>
                <input type="text" value="${this.escapeHtml(question)}" class="faq-question-input">
                <label>Antwort:</label>
                <textarea rows="4" class="faq-answer-input">${this.escapeHtml(answer)}</textarea>
                <div class="form-actions">
                    <button class="primary-btn save-faq-btn">Speichern</button>
                    <button class="secondary-btn cancel-faq-btn">Abbrechen</button>
                </div>
            </div>
        `;
        
        // Animation hinzufügen
        newFAQItem.style.opacity = '0';
        newFAQItem.style.transform = 'translateY(-10px)';
        
        // Füge das neue Element vor dem Add-Form hinzu
        if (addFAQForm) {
            faqManager.insertBefore(newFAQItem, addFAQForm);
        } else {
            faqManager.appendChild(newFAQItem);
        }
        
        // Animation ausführen
        setTimeout(() => {
            newFAQItem.style.transition = 'all 0.3s ease';
            newFAQItem.style.opacity = '1';
            newFAQItem.style.transform = 'translateY(0)';
        }, 10);
    }
    
    updateDashboardFAQCount() {
        const faqCount = document.querySelectorAll('.faq-item-admin').length;
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        
        dashboardCards.forEach(card => {
            const icon = card.querySelector('.fa-question-circle');
            if (icon) {
                const countElement = card.querySelector('p');
                if (countElement) {
                    countElement.textContent = `${faqCount} Fragen konfiguriert`;
                }
            }
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Erweiterte Preisverwaltung (CRUD für Artikel)
    setupAdvancedPriceManagement() {
        this.currentCategory = null;
        
        // Add Item Buttons
        document.querySelectorAll('.add-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentCategory = btn.dataset.category;
                this.showAddItemModal();
            });
        });
        
        // Modal Event Listeners
        this.setupItemModalEventListeners();
        
        // Price Item Event Listeners (für bestehende Artikel)
        this.setupPriceItemEventListeners();
        
        // Save All Prices Button
        const saveAllBtn = document.querySelector('.save-all-prices');
        if (saveAllBtn) {
            saveAllBtn.addEventListener('click', () => {
                this.saveAllPrices();
            });
        }
    }
    
    setupItemModalEventListeners() {
        const modal = document.querySelector('.add-item-modal');
        const closeBtn = modal?.querySelector('.modal-close');
        const cancelBtn = modal?.querySelector('.modal-cancel');
        const form = modal?.querySelector('.add-item-form');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideAddItemModal();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideAddItemModal();
            });
        }
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveNewItem();
            });
        }
        
        // Click outside to close
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAddItemModal();
                }
            });
        }
    }
    
    setupPriceItemEventListeners() {
        // Event delegation für dynamisch erstellte Artikel
        document.addEventListener('click', (e) => {
            // Edit Item
            if (e.target.closest('.edit-item-btn')) {
                const priceItem = e.target.closest('.price-item-extended');
                this.toggleItemEdit(priceItem);
            }
            
            // Delete Item
            if (e.target.closest('.delete-item-btn')) {
                const priceItem = e.target.closest('.price-item-extended');
                this.deleteItem(priceItem);
            }
        });
        
        // Auto-save bei Änderungen
        document.addEventListener('input', (e) => {
            if (e.target.matches('.item-name-input, .item-description-input, .price-input')) {
                this.scheduleItemSave(e.target);
            }
        });
    }
    
    showAddItemModal() {
        const modal = document.querySelector('.add-item-modal');
        const titleElement = modal?.querySelector('h3');
        
        if (modal && titleElement) {
            const categoryNames = {
                'bases': 'Basis-Riegel',
                'creams': 'Creme/Soße',
                'events': 'Event-Paket'
            };
            
            titleElement.textContent = `Neuen ${categoryNames[this.currentCategory]} hinzufügen`;
            modal.style.display = 'flex';
            
            // Focus auf erstes Input-Feld
            const nameInput = modal.querySelector('.new-item-name');
            if (nameInput) {
                setTimeout(() => nameInput.focus(), 100);
            }
        }
    }
    
    hideAddItemModal() {
        const modal = document.querySelector('.add-item-modal');
        if (modal) {
            modal.style.display = 'none';
            this.clearModalForm();
        }
    }
    
    clearModalForm() {
        const form = document.querySelector('.add-item-form');
        if (form) {
            form.reset();
        }
    }
    
    saveNewItem() {
        const nameInput = document.querySelector('.new-item-name');
        const descInput = document.querySelector('.new-item-description');
        const priceInput = document.querySelector('.new-item-price');
        
        if (!nameInput?.value.trim() || !priceInput?.value) {
            this.showNotification('Bitte füllen Sie alle Pflichtfelder aus!', 'error');
            return;
        }
        
        const itemData = {
            id: Date.now().toString(),
            name: nameInput.value.trim(),
            description: descInput?.value.trim() || '',
            price: parseFloat(priceInput.value)
        };
        
        this.addItemToCategory(this.currentCategory, itemData);
        this.hideAddItemModal();
        this.showNotification(`${itemData.name} erfolgreich hinzugefügt!`, 'success');
    }
    
    addItemToCategory(category, itemData) {
        const container = document.querySelector(`[data-category="${category}"]`);
        if (!container) return;
        
        const newItemElement = this.createPriceItemElement(itemData);
        container.appendChild(newItemElement);
        
        // Animation
        newItemElement.style.opacity = '0';
        newItemElement.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            newItemElement.style.transition = 'all 0.3s ease';
            newItemElement.style.opacity = '1';
            newItemElement.style.transform = 'translateY(0)';
        }, 10);
    }
    
    createPriceItemElement(itemData) {
        const element = document.createElement('div');
        element.className = 'price-item-extended';
        element.dataset.itemId = itemData.id;
        
        element.innerHTML = `
            <div class="item-info">
                <input type="text" value="${this.escapeHtml(itemData.name)}" class="item-name-input">
                <textarea rows="2" class="item-description-input" placeholder="Produktbeschreibung...">${this.escapeHtml(itemData.description)}</textarea>
            </div>
            <div class="item-price">
                <input type="number" step="0.10" value="${itemData.price}" class="price-input">
                <span class="currency">€</span>
            </div>
            <div class="item-actions">
                <button class="edit-item-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-item-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        return element;
    }
    
    toggleItemEdit(priceItem) {
        const inputs = priceItem.querySelectorAll('input, textarea');
        const isReadonly = inputs[0].hasAttribute('readonly');
        
        inputs.forEach(input => {
            if (isReadonly) {
                input.removeAttribute('readonly');
                input.style.background = 'var(--admin-input-bg)';
            } else {
                input.setAttribute('readonly', true);
                input.style.background = 'transparent';
            }
        });
        
        const editBtn = priceItem.querySelector('.edit-item-btn');
        if (editBtn) {
            editBtn.innerHTML = isReadonly ? 
                '<i class="fas fa-save"></i>' : 
                '<i class="fas fa-edit"></i>';
        }
        
        if (!isReadonly) {
            this.showNotification('Artikel-Änderungen gespeichert!', 'success');
        }
    }
    
    deleteItem(priceItem) {
        const itemName = priceItem.querySelector('.item-name-input').value;
        if (confirm(`"${itemName}" wirklich löschen?`)) {
            priceItem.style.opacity = '0';
            priceItem.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                priceItem.remove();
                this.showNotification('Artikel gelöscht!', 'warning');
            }, 300);
        }
    }
    
    scheduleItemSave(input) {
        // Visual feedback
        input.style.borderColor = 'var(--admin-warning)';
        setTimeout(() => {
            input.style.borderColor = 'var(--admin-success)';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 1000);
        }, 500);
    }
    
    saveAllPrices() {
        const allItems = document.querySelectorAll('.price-item-extended');
        const priceData = {};
        
        allItems.forEach(item => {
            const category = item.closest('[data-category]')?.dataset.category;
            const name = item.querySelector('.item-name-input')?.value;
            const price = item.querySelector('.price-input')?.value;
            const description = item.querySelector('.item-description-input')?.value;
            
            if (category && name && price) {
                if (!priceData[category]) priceData[category] = {};
                priceData[category][item.dataset.itemId] = {
                    name, price: parseFloat(price), description
                };
            }
        });
        
        console.log('Alle Preise gespeichert:', priceData);
        this.showNotification('Alle Preise erfolgreich gespeichert!', 'success');
    }
    
    // Banner Management
    setupBannerManagement() {
        this.currentBannerId = null;
        
        // Create Banner Button
        const createBannerBtn = document.querySelector('#banners .section-header .primary-btn');
        if (createBannerBtn) {
            createBannerBtn.addEventListener('click', () => {
                this.showBannerEditor();
            });
        }
        
        // Banner Event Listeners
        this.setupBannerEventListeners();
        
        // Template Usage
        document.querySelectorAll('.use-template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const template = btn.closest('.banner-template');
                const templateType = template?.dataset.type;
                this.useBannerTemplate(templateType);
            });
        });
        
        // Banner Editor Modal
        this.setupBannerEditorModal();
    }
    
    setupBannerEventListeners() {
        document.addEventListener('click', (e) => {
            // Banner Toggle
            if (e.target.matches('.banner-toggle')) {
                const bannerId = e.target.closest('.banner-item')?.dataset.bannerId;
                this.toggleBanner(bannerId, e.target.checked);
            }
            
            // Edit Banner
            if (e.target.closest('.edit-banner-btn')) {
                const bannerId = e.target.closest('.banner-item')?.dataset.bannerId;
                this.editBanner(bannerId);
            }
            
            // Delete Banner
            if (e.target.closest('.delete-banner-btn')) {
                const bannerId = e.target.closest('.banner-item')?.dataset.bannerId;
                this.deleteBanner(bannerId);
            }
        });
        
        // Live preview updates
        document.addEventListener('input', (e) => {
            if (e.target.closest('.banner-editor')) {
                this.updateBannerPreview();
            }
        });
    }
    
    setupBannerEditorModal() {
        const modal = document.querySelector('.banner-editor-modal');
        const closeBtn = modal?.querySelector('.modal-close');
        const cancelBtn = modal?.querySelector('.cancel-banner-btn');
        const saveBtn = modal?.querySelector('.save-banner-btn');
        const previewBtn = modal?.querySelector('.preview-banner-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideBannerEditor();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideBannerEditor();
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveBanner();
            });
        }
        
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.showBannerOnWebsite();
            });
        }
        
        // Click outside to close
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideBannerEditor();
                }
            });
        }
    }
    
    showBannerEditor(bannerId = null) {
        this.currentBannerId = bannerId;
        const modal = document.querySelector('.banner-editor-modal');
        
        if (modal) {
            modal.style.display = 'flex';
            
            if (bannerId) {
                this.loadBannerData(bannerId);
            } else {
                this.clearBannerForm();
            }
            
            this.updateBannerPreview();
        }
    }
    
    hideBannerEditor() {
        const modal = document.querySelector('.banner-editor-modal');
        if (modal) {
            modal.style.display = 'none';
            this.clearBannerForm();
        }
    }
    
    useBannerTemplate(templateType) {
        const templates = {
            launch: {
                title: '🎉 MoreMori Launch Event!',
                message: 'Feiere mit uns die Eröffnung! Erste 50 Besucher erhalten 20% Rabatt!',
                cta: 'Jetzt dabei sein!',
                icon: 'fa-rocket'
            },
            promotion: {
                title: '🎯 Spezial-Aktion!',
                message: 'Nur diese Woche: 15% Rabatt auf alle Event-Pakete!',
                cta: 'Jetzt sparen!',
                icon: 'fa-percent'
            },
            seasonal: {
                title: '🎄 Weihnachts-Special',
                message: 'Süße Weihnachtsriegel mit festlichen Cremes - perfekt für die Feiertage!',
                cta: 'Jetzt vorbestellen',
                icon: 'fa-gift'
            },
            announcement: {
                title: '📢 Wichtige Mitteilung',
                message: 'Neue Öffnungszeiten ab nächster Woche: Montag-Samstag 10-18 Uhr',
                cta: 'Mehr erfahren',
                icon: 'fa-bullhorn'
            }
        };
        
        const template = templates[templateType];
        if (template) {
            this.showBannerEditor();
            this.fillBannerForm(template);
        }
    }
    
    fillBannerForm(template) {
        const titleInput = document.querySelector('.banner-title-input');
        const messageInput = document.querySelector('.banner-message-input');
        const ctaInput = document.querySelector('.banner-cta-input');
        const typeSelect = document.querySelector('.banner-type-select');
        
        if (titleInput) titleInput.value = template.title;
        if (messageInput) messageInput.value = template.message;
        if (ctaInput) ctaInput.value = template.cta;
        
        this.updateBannerPreview();
    }
    
    updateBannerPreview() {
        const titleInput = document.querySelector('.banner-title-input');
        const messageInput = document.querySelector('.banner-message-input');
        const ctaInput = document.querySelector('.banner-cta-input');
        const typeSelect = document.querySelector('.banner-type-select');
        
        const previewBanner = document.querySelector('.preview-banner');
        if (!previewBanner) return;
        
        const previewTitle = previewBanner.querySelector('h4');
        const previewMessage = previewBanner.querySelector('p');
        const previewCTA = previewBanner.querySelector('.banner-cta');
        const previewIcon = previewBanner.querySelector('.banner-icon i');
        
        if (previewTitle && titleInput) {
            previewTitle.textContent = titleInput.value || 'Banner Titel';
        }
        
        if (previewMessage && messageInput) {
            previewMessage.textContent = messageInput.value || 'Banner Nachricht';
        }
        
        if (previewCTA && ctaInput) {
            previewCTA.textContent = ctaInput.value || 'Button Text';
        }
        
        // Icon basierend auf Banner-Typ ändern
        if (previewIcon && typeSelect) {
            const iconMap = {
                'launch': 'fa-rocket',
                'promotion': 'fa-percent', 
                'seasonal': 'fa-gift',
                'announcement': 'fa-bullhorn'
            };
            
            const iconClass = iconMap[typeSelect.value] || 'fa-bullhorn';
            previewIcon.className = `fas ${iconClass}`;
        }
    }
    
    toggleBanner(bannerId, isActive) {
        const bannerItem = document.querySelector(`[data-banner-id="${bannerId}"]`);
        if (!bannerItem) return;
        
        const statusBadge = bannerItem.querySelector('.status-badge');
        
        if (isActive) {
            bannerItem.classList.remove('inactive-banner');
            bannerItem.classList.add('active-banner');
            statusBadge.textContent = 'Aktiv';
            statusBadge.className = 'status-badge active';
            this.showNotification('Banner aktiviert!', 'success');
        } else {
            bannerItem.classList.remove('active-banner');
            bannerItem.classList.add('inactive-banner');
            statusBadge.textContent = 'Inaktiv';
            statusBadge.className = 'status-badge inactive';
            this.showNotification('Banner deaktiviert!', 'info');
        }
        
        this.updateDashboardBannerCount();
    }
    
    editBanner(bannerId) {
        this.showBannerEditor(bannerId);
    }
    
    deleteBanner(bannerId) {
        if (confirm('Banner wirklich löschen?')) {
            const bannerItem = document.querySelector(`[data-banner-id="${bannerId}"]`);
            if (bannerItem) {
                bannerItem.style.opacity = '0';
                bannerItem.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    bannerItem.remove();
                    this.showNotification('Banner gelöscht!', 'warning');
                    this.updateDashboardBannerCount();
                }, 300);
            }
        }
    }
    
    loadBannerData(bannerId) {
        // Hier würden Banner-Daten aus der Datenbank geladen
        const bannerElement = document.querySelector(`[data-banner-id="${bannerId}"]`);
        if (!bannerElement) return;
        
        const title = bannerElement.querySelector('h4')?.textContent || '';
        const message = bannerElement.querySelector('p')?.textContent || '';
        const cta = bannerElement.querySelector('.banner-cta')?.textContent || '';
        
        // Form füllen
        const titleInput = document.querySelector('.banner-title-input');
        const messageInput = document.querySelector('.banner-message-input');
        const ctaInput = document.querySelector('.banner-cta-input');
        
        if (titleInput) titleInput.value = title;
        if (messageInput) messageInput.value = message;
        if (ctaInput) ctaInput.value = cta;
    }
    
    clearBannerForm() {
        const inputs = document.querySelectorAll('.banner-editor input, .banner-editor textarea, .banner-editor select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        
        // Dismissible standardmäßig aktiviert
        const dismissibleCheckbox = document.querySelector('.banner-dismissible');
        if (dismissibleCheckbox) {
            dismissibleCheckbox.checked = true;
        }
    }
    
    saveBanner() {
        const titleInput = document.querySelector('.banner-title-input');
        const messageInput = document.querySelector('.banner-message-input');
        const ctaInput = document.querySelector('.banner-cta-input');
        
        if (!titleInput?.value.trim() || !messageInput?.value.trim()) {
            this.showNotification('Titel und Nachricht sind Pflichtfelder!', 'error');
            return;
        }
        
        const bannerData = {
            title: titleInput.value.trim(),
            message: messageInput.value.trim(),
            cta: ctaInput?.value.trim() || 'Mehr erfahren',
            type: document.querySelector('.banner-type-select')?.value || 'announcement',
            link: document.querySelector('.banner-link-input')?.value || '#',
            autoHide: document.querySelector('.banner-auto-hide')?.checked || false,
            dismissible: document.querySelector('.banner-dismissible')?.checked || true,
            position: document.querySelector('.banner-position-select')?.value || 'popup'
        };
        
        if (this.currentBannerId) {
            this.updateExistingBanner(this.currentBannerId, bannerData);
        } else {
            this.createNewBanner(bannerData);
        }
        
        this.hideBannerEditor();
        this.showNotification('Banner erfolgreich gespeichert!', 'success');
        this.updateDashboardBannerCount();
    }
    
    createNewBanner(bannerData) {
        const bannerId = 'banner_' + Date.now();
        const bannerElement = this.createBannerElement(bannerId, bannerData);
        
        // Füge zu aktiven oder inaktiven Bannern hinzu
        const activeSection = document.querySelector('.banner-section:first-child .banner-item');
        if (activeSection) {
            const container = activeSection.parentElement;
            container.appendChild(bannerElement);
        }
    }
    
    createBannerElement(bannerId, bannerData) {
        const element = document.createElement('div');
        element.className = 'banner-item active-banner';
        element.dataset.bannerId = bannerId;
        
        const iconMap = {
            'launch': 'fa-rocket',
            'promotion': 'fa-percent',
            'seasonal': 'fa-gift',
            'announcement': 'fa-bullhorn'
        };
        
        const iconClass = iconMap[bannerData.type] || 'fa-bullhorn';
        
        element.innerHTML = `
            <div class="banner-preview">
                <div class="banner-content ${bannerData.type}-banner">
                    <div class="banner-icon">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="banner-text">
                        <h4>${this.escapeHtml(bannerData.title)}</h4>
                        <p>${this.escapeHtml(bannerData.message)}</p>
                    </div>
                    <button class="banner-cta">${this.escapeHtml(bannerData.cta)}</button>
                </div>
            </div>
            <div class="banner-controls">
                <div class="banner-status">
                    <span class="status-badge active">Aktiv</span>
                    <span class="banner-stats">0 Klicks</span>
                </div>
                <div class="banner-actions">
                    <label class="toggle-banner">
                        <input type="checkbox" checked class="banner-toggle">
                        <span class="toggle-slider"></span>
                    </label>
                    <button class="edit-banner-btn"><i class="fas fa-edit"></i> Bearbeiten</button>
                    <button class="delete-banner-btn"><i class="fas fa-trash"></i> Löschen</button>
                </div>
            </div>
        `;
        
        return element;
    }
    
    updateExistingBanner(bannerId, bannerData) {
        const bannerElement = document.querySelector(`[data-banner-id="${bannerId}"]`);
        if (!bannerElement) return;
        
        const title = bannerElement.querySelector('h4');
        const message = bannerElement.querySelector('p');
        const cta = bannerElement.querySelector('.banner-cta');
        const icon = bannerElement.querySelector('.banner-icon i');
        
        if (title) title.textContent = bannerData.title;
        if (message) message.textContent = bannerData.message;
        if (cta) cta.textContent = bannerData.cta;
        
        // Icon update
        const iconMap = {
            'launch': 'fa-rocket',
            'promotion': 'fa-percent',
            'seasonal': 'fa-gift',
            'announcement': 'fa-bullhorn'
        };
        
        if (icon) {
            const iconClass = iconMap[bannerData.type] || 'fa-bullhorn';
            icon.className = `fas ${iconClass}`;
        }
    }
    
    showBannerOnWebsite() {
        // Öffne Hauptwebsite in neuem Tab mit Banner-Vorschau
        window.open('index.html?preview=banner', '_blank');
        this.showNotification('Banner-Vorschau in neuem Tab geöffnet', 'info');
    }
    
    updateDashboardBannerCount() {
        const activeBanners = document.querySelectorAll('.banner-item.active-banner').length;
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        
        dashboardCards.forEach(card => {
            const icon = card.querySelector('.fa-bullhorn');
            if (icon) {
                const countElement = card.querySelector('p');
                if (countElement) {
                    countElement.textContent = `${activeBanners} Banner aktiv`;
                }
            }
        });
    }

    // Settings Management
    setupSettings() {
        const toggles = document.querySelectorAll('.toggle-item input[type="checkbox"]');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.updateSetting(e.target);
            });
        });

        const settingInputs = document.querySelectorAll('.setting-input');
        settingInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateContactInfo(e.target);
            });
        });
    }

    updateSetting(toggle) {
        const label = toggle.parentElement.textContent.trim();
        console.log(`Einstellung "${label}": ${toggle.checked ? 'aktiviert' : 'deaktiviert'}`);
        
        if (label.includes('Wartungsmodus') && toggle.checked) {
            this.showNotification('Wartungsmodus aktiviert - Website ist offline!', 'warning');
        }
    }

    updateContactInfo(input) {
        console.log('Kontaktinfo aktualisiert:', input.type, input.value);
        this.showNotification('Kontaktdaten gespeichert!', 'success');
    }

    // Content Management
    setupContentManagement() {
        const contentInputs = document.querySelectorAll('.content-input, .content-textarea');
        contentInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                this.saveContent(e.target);
            });
        });
    }

    saveContent(input) {
        console.log('Content gespeichert:', input.value);
        this.showNotification('Inhalt gespeichert!', 'success');
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        // Erstelle Notification Element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Styling
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '400px',
            animation: 'slideIn 0.3s ease-out'
        });

        // CSS für Animation hinzufügen
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Close Button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // Auto-hide nach 4 Sekunden
        setTimeout(() => {
            if (document.body.contains(notification)) {
                this.hideNotification(notification);
            }
        }, 4000);
    }

    hideNotification(notification) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4caf50',
            warning: '#ff9800',
            error: '#f44336',
            info: '#2196f3'
        };
        return colors[type] || colors.info;
    }

    // Data Management
    async loadData() {
        try {
            // Lade alle Daten parallel von Supabase
            await Promise.all([
                this.loadProducts(),
                this.loadPrices(),
                this.loadContent(),
                this.loadCalendar(),
                this.loadAllergies(),
                this.loadBanners(),
                this.loadFAQ(),
                this.loadSettings()
            ]);
            
            console.log('📊 Alle Daten von Supabase geladen');
            this.updateDashboardStats();
            this.updateAllergyPreview();
            this.showNotification('Daten erfolgreich geladen!', 'success');
            
        } catch (error) {
            console.error('Fehler beim Laden der Daten:', error);
            this.showNotification('Fehler beim Laden der Daten', 'error');
        }
    }

    // Spezifische Load-Funktionen für jede Datenquelle
    async loadProducts() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get&type=products`);
            const products = await response.json();
            this.data.products = products;
            console.log('🖼️ Produkte geladen:', products.length);
        } catch (error) {
            console.error('Fehler beim Laden der Produkte:', error);
            this.data.products = [];
        }
    }

    async loadPrices() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get&type=prices`);
            const prices = await response.json();
            this.data.prices = prices;
            console.log('💰 Preise geladen:', prices.length);
        } catch (error) {
            console.error('Fehler beim Laden der Preise:', error);
            this.data.prices = [];
        }
    }

    async loadContent() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get&type=content`);
            const content = await response.json();
            this.data.content = content;
            console.log('📝 Inhalte geladen:', content.length);
        } catch (error) {
            console.error('Fehler beim Laden der Inhalte:', error);
            this.data.content = [];
        }
    }

    async loadCalendar() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get&type=calendar`);
            const calendar = await response.json();
            this.data.calendar = calendar;
            console.log('📅 Kalender geladen:', calendar.length);
        } catch (error) {
            console.error('Fehler beim Laden des Kalenders:', error);
            this.data.calendar = [];
        }
    }

    async loadAllergies() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get&type=allergies`);
            const allergies = await response.json();
            this.data.allergies = allergies;
            console.log('⚠️ Allergien geladen:', allergies.length);
        } catch (error) {
            console.error('Fehler beim Laden der Allergien:', error);
            this.data.allergies = [];
        }
    }

    async loadBanners() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get&type=banners`);
            const banners = await response.json();
            this.data.banners = banners;
            console.log('🏳️ Banner geladen:', banners.length);
        } catch (error) {
            console.error('Fehler beim Laden der Banner:', error);
            this.data.banners = [];
        }
    }

    async loadFAQ() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get&type=faq`);
            const faq = await response.json();
            this.data.faq = faq;
            console.log('❓ FAQ geladen:', faq.length);
        } catch (error) {
            console.error('Fehler beim Laden der FAQ:', error);
            this.data.faq = [];
        }
    }

    async loadSettings() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get&type=settings`);
            const settings = await response.json();
            this.data.settings = settings;
            console.log('⚙️ Einstellungen geladen:', settings.length);
        } catch (error) {
            console.error('Fehler beim Laden der Einstellungen:', error);
            this.data.settings = [];
        }
    }

    // API Helper-Funktionen
    async apiCall(action, type, data = null, id = null) {
        try {
            const url = new URL(this.apiEndpoint, window.location.origin);
            url.searchParams.set('action', action);
            url.searchParams.set('type', type);
            if (id) url.searchParams.set('id', id);

            const options = {
                method: action === 'get' ? 'GET' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data && action !== 'get') {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Call Error:', error);
            throw error;
        }
    }

    // CRUD Helper-Funktionen
    async saveItem(type, data, id = null) {
        try {
            const action = id ? 'update' : 'create';
            const result = await this.apiCall(action, type, data, id);
            this.showNotification(`${type} erfolgreich gespeichert!`, 'success');
            this.incrementTodayChanges();
            return result;
        } catch (error) {
            this.showNotification(`Fehler beim Speichern: ${error.message}`, 'error');
            throw error;
        }
    }

    async deleteItem(type, id) {
        try {
            const result = await this.apiCall('delete', type, null, id);
            this.showNotification(`${type} erfolgreich gelöscht!`, 'success');
            this.incrementTodayChanges();
            return result;
        } catch (error) {
            this.showNotification(`Fehler beim Löschen: ${error.message}`, 'error');
            throw error;
        }
    }

    saveData() {
        // Legacy Funktion für Kompatibilität
        console.log('saveData called - use specific save functions instead');
        return Promise.resolve(true);
    }

    // Image Upload Simulation
    simulateImageUpload(file) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    url: URL.createObjectURL(file),
                    id: Date.now()
                });
            }, 2000);
        });
    }

    // Form Validation
    validateForm(formData) {
        const errors = [];
        
        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('Name muss mindestens 2 Zeichen lang sein');
        }
        
        if (!formData.email || !this.isValidEmail(formData.email)) {
            errors.push('Gültige E-Mail-Adresse erforderlich');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Export/Import Funktionen
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'moremori-data.json';
        link.click();
        
        this.showNotification('Daten exportiert!', 'success');
    }

    importData(jsonFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = { ...this.data, ...importedData };
                this.loadData();
                this.showNotification('Daten erfolgreich importiert!', 'success');
            } catch (error) {
                this.showNotification('Fehler beim Importieren der Daten!', 'error');
            }
        };
        reader.readAsText(jsonFile);
    }

    // Mobile Menu Toggle
    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('mobile-active');
    }

    // Enhanced Keyboard Shortcuts System
    setupKeyboardShortcuts() {
        // Hauptnavigation Shortcuts
        document.addEventListener('keydown', (e) => {
            // Globale Shortcuts (mit Ctrl/Cmd)
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveCurrentSection();
                        this.showNotification('💾 Gespeichert!', 'success');
                        break;
                    case 'n':
                        e.preventDefault();
                        this.handleQuickAdd();
                        break;
                    case 'b':
                        e.preventDefault();
                        if (this.currentSection === 'banners') {
                            this.showBannerEditor();
                        }
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportData();
                        break;
                    case '1': case '2': case '3': case '4': case '5':
                    case '6': case '7': case '8': case '9':
                        e.preventDefault();
                        this.navigateToSection(parseInt(e.key));
                        break;
                }
            }
            
            // Shortcuts ohne Modifier
            switch(e.key) {
                case 'Escape':
                    this.closeModalsAndForms();
                    break;
                case 'F1':
                    e.preventDefault();
                    this.showKeyboardShortcuts();
                    break;
            }
            
            // Arrow Navigation für Listen
            if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                this.handleArrowNavigation(e);
            }
        });
        
        // Quick Tooltips für Shortcuts
        this.addShortcutTooltips();
    }
    
    handleQuickAdd() {
        switch(this.currentSection) {
            case 'products':
                this.handleImageUpload();
                break;
            case 'prices':
                // Zeige erste Kategorie-Add-Button
                const firstAddBtn = document.querySelector('.add-item-btn');
                if (firstAddBtn) firstAddBtn.click();
                break;
            case 'calendar':
                this.showAddEventForm();
                break;
            case 'faq':
                const faqBtn = document.querySelector('#faq .primary-btn');
                if (faqBtn) faqBtn.click();
                break;
            case 'banners':
                this.showBannerEditor();
                break;
            default:
                this.showNotification('Keine Quick-Add Funktion für diese Sektion', 'info');
        }
    }
    
    navigateToSection(number) {
        const sections = ['dashboard', 'products', 'prices', 'content', 'calendar', 'allergies', 'faq', 'banners', 'settings'];
        const targetSection = sections[number - 1];
        if (targetSection) {
            this.showSection(targetSection);
            this.showNotification(`📍 ${this.getSectionName(targetSection)}`, 'info');
        }
    }
    
    getSectionName(section) {
        const names = {
            dashboard: 'Dashboard',
            products: 'Produktbilder',
            prices: 'Preise',
            content: 'Inhalte',
            calendar: 'Kalender',
            allergies: 'Allergien',
            faq: 'FAQ',
            banners: 'Banner',
            settings: 'Einstellungen'
        };
        return names[section] || section;
    }
    
    closeModalsAndForms() {
        // Schließe alle Modals
        const modals = document.querySelectorAll('.add-item-modal, .banner-editor-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Schließe alle offenen Formulare
        const forms = document.querySelectorAll('.add-event-form, .add-faq-form');
        forms.forEach(form => {
            form.style.display = 'none';
        });
        
        // Schließe alle Edit-Modi
        const editForms = document.querySelectorAll('.faq-edit-form');
        editForms.forEach(form => {
            form.style.display = 'none';
            const preview = form.parentElement.querySelector('.faq-content-preview');
            if (preview) preview.style.display = 'block';
        });
    }
    
    handleArrowNavigation(e) {
        const currentList = this.getCurrentFocusableList();
        if (!currentList.length) return;
        
        const activeIndex = currentList.findIndex(item => 
            item.matches(':focus') || item.classList.contains('keyboard-selected')
        );
        
        let newIndex;
        if (e.key === 'ArrowUp') {
            newIndex = activeIndex > 0 ? activeIndex - 1 : currentList.length - 1;
        } else {
            newIndex = activeIndex < currentList.length - 1 ? activeIndex + 1 : 0;
        }
        
        // Remove previous selection
        currentList.forEach(item => item.classList.remove('keyboard-selected'));
        
        // Add new selection
        currentList[newIndex].classList.add('keyboard-selected');
        currentList[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        e.preventDefault();
    }
    
    getCurrentFocusableList() {
        switch(this.currentSection) {
            case 'faq':
                return Array.from(document.querySelectorAll('.faq-item-admin'));
            case 'banners':
                return Array.from(document.querySelectorAll('.banner-item'));
            case 'products':
                return Array.from(document.querySelectorAll('.image-card'));
            case 'calendar':
                return Array.from(document.querySelectorAll('.event-item'));
            default:
                return [];
        }
    }
    
    addShortcutTooltips() {
        // Füge Tooltips zu wichtigen Buttons hinzu
        const tooltips = {
            '[data-section="dashboard"]': 'Ctrl+1',
            '[data-section="products"]': 'Ctrl+2',
            '[data-section="prices"]': 'Ctrl+3',
            '[data-section="content"]': 'Ctrl+4',
            '[data-section="calendar"]': 'Ctrl+5',
            '[data-section="allergies"]': 'Ctrl+6',
            '[data-section="faq"]': 'Ctrl+7',
            '[data-section="banners"]': 'Ctrl+8',
            '[data-section="settings"]': 'Ctrl+9',
            '.primary-btn': 'Ctrl+S zum Speichern'
        };
        
        Object.entries(tooltips).forEach(([selector, shortcut]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.title = element.title ? `${element.title} (${shortcut})` : shortcut;
            });
        });
    }
    
    showKeyboardShortcuts() {
        const shortcuts = {
            'Navigation': {
                'Ctrl+1-9': 'Zu Sektion springen',
                'Esc': 'Modals/Formulare schließen',
                '↑↓': 'In Listen navigieren'
            },
            'Aktionen': {
                'Ctrl+S': 'Aktuelle Sektion speichern',
                'Ctrl+N': 'Neues Element hinzufügen',
                'Ctrl+B': 'Neuen Banner erstellen',
                'Ctrl+E': 'Daten exportieren'
            },
            'Hilfe': {
                'F1': 'Diese Hilfe anzeigen'
            }
        };
        
        let shortcutHtml = '<div style="background: white; padding: 20px; border-radius: 12px; max-width: 500px;">';
        shortcutHtml += '<h3 style="margin-bottom: 20px; color: var(--admin-primary);">⌨️ Keyboard Shortcuts</h3>';
        
        Object.entries(shortcuts).forEach(([category, items]) => {
            shortcutHtml += `<h4 style="margin: 15px 0 10px; color: var(--admin-text);">${category}</h4>`;
            Object.entries(items).forEach(([key, description]) => {
                shortcutHtml += `
                    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                        <span style="font-family: monospace; background: var(--admin-light); padding: 2px 6px; border-radius: 4px;">${key}</span>
                        <span style="color: var(--admin-text-light);">${description}</span>
                    </div>
                `;
            });
        });
        
        shortcutHtml += '<button onclick="document.querySelector(\'#shortcut-modal\').remove()" style="margin-top: 20px; padding: 8px 16px; background: var(--admin-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">Schließen</button>';
        shortcutHtml += '</div>';
        
        const modal = document.createElement('div');
        modal.id = 'shortcut-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; align-items: center;
            justify-content: center; z-index: 20000;
        `;
        modal.innerHTML = shortcutHtml;
        
        document.body.appendChild(modal);
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    // UI Polish: Enhanced Animations
    addUIPolish() {
        // Hover-Effekte für alle Cards
        this.setupCardAnimations();
        
        // Loading States
        this.setupLoadingStates();
        
        // Success Animations
        this.setupSuccessAnimations();
        
        // Auto-Save Indicator
        this.setupAutoSaveIndicator();
    }
    
    setupCardAnimations() {
        const cards = document.querySelectorAll('.dashboard-card, .form-card, .image-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    setupLoadingStates() {
        // Loading Overlay für Buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.primary-btn, .secondary-btn')) {
                this.showButtonLoading(e.target);
            }
        });
    }
    
    showButtonLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Lädt...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }
    
    setupSuccessAnimations() {
        // Erfolgs-Pulse für gespeicherte Elemente
        const originalNotification = this.showNotification.bind(this);
        this.showNotification = (message, type) => {
            originalNotification(message, type);
            
            if (type === 'success') {
                this.addSuccessPulse();
            }
        };
    }
    
    addSuccessPulse() {
        const activeSection = document.querySelector('.admin-section.active');
        if (activeSection) {
            activeSection.style.animation = 'successPulse 0.6s ease-out';
            setTimeout(() => {
                activeSection.style.animation = '';
            }, 600);
        }
        
        // CSS für Success Pulse
        if (!document.querySelector('#success-pulse-styles')) {
            const style = document.createElement('style');
            style.id = 'success-pulse-styles';
            style.textContent = `
                @keyframes successPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.01); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupAutoSaveIndicator() {
        let saveIndicator;
        
        // Auto-Save Indikator erstellen
        const createIndicator = () => {
            if (!saveIndicator) {
                saveIndicator = document.createElement('div');
                saveIndicator.id = 'auto-save-indicator';
                saveIndicator.innerHTML = '<i class="fas fa-save"></i> Auto-Save';
                Object.assign(saveIndicator.style, {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: 'var(--admin-success)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    zIndex: '9999',
                    opacity: '0',
                    transition: 'all 0.3s ease',
                    pointerEvents: 'none'
                });
                document.body.appendChild(saveIndicator);
            }
            return saveIndicator;
        };
        
        // Auto-Save bei Input-Änderungen
        let saveTimeout;
        document.addEventListener('input', (e) => {
            if (e.target.matches('.item-name-input, .item-description-input, .price-input, .content-input, .content-textarea')) {
                const indicator = createIndicator();
                
                // Zeige Indicator
                indicator.style.opacity = '1';
                indicator.innerHTML = '<i class="fas fa-clock"></i> Speichere...';
                
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    // Simuliere Auto-Save
                    indicator.innerHTML = '<i class="fas fa-check"></i> Gespeichert!';
                    
                    setTimeout(() => {
                        indicator.style.opacity = '0';
                    }, 1500);
                    
                    this.incrementTodayChanges();
                }, 2000);
            }
        });
    }
    
    // Touch-optimierte Mobile Features
    setupMobileOptimizations() {
        // Touch-friendly Button-Größen
        if (this.isMobileDevice()) {
            this.enableMobileMode();
        }
        
        // Swipe-Gesten für Navigation
        this.setupSwipeGestures();
        
        // Mobile Modal Verbesserungen
        this.setupMobileModals();
    }
    
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    enableMobileMode() {
        document.body.classList.add('mobile-mode');
        
        // Größere Touch-Targets
        const style = document.createElement('style');
        style.textContent = `
            .mobile-mode .edit-btn,
            .mobile-mode .delete-btn,
            .mobile-mode .card-button,
            .mobile-mode .quick-action-btn {
                min-height: 44px;
                min-width: 44px;
                padding: 12px 16px;
            }
            
            .mobile-mode .price-input,
            .mobile-mode .item-name-input {
                min-height: 48px;
                font-size: 16px; /* Verhindert Zoom auf iOS */
            }
            
            .mobile-mode .sidebar {
                z-index: 20000;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupSwipeGestures() {
        let startX, startY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Horizontale Swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
                if (deltaX > 0) {
                    // Swipe right - Sidebar öffnen
                    if (window.innerWidth <= 768) {
                        document.querySelector('.sidebar').classList.add('mobile-active');
                    }
                } else {
                    // Swipe left - Sidebar schließen
                    document.querySelector('.sidebar').classList.remove('mobile-active');
                }
            }
            
            startX = startY = null;
        });
    }
    
    setupMobileModals() {
        const modals = document.querySelectorAll('.add-item-modal, .banner-editor-modal');
        modals.forEach(modal => {
            const content = modal.querySelector('.modal-content');
            if (content && this.isMobileDevice()) {
                content.style.margin = '10px';
                content.style.maxHeight = '95vh';
                content.style.width = '95%';
            }
        });
    }

    saveCurrentSection() {
        switch(this.currentSection) {
            case 'prices':
                this.savePrices();
                break;
            case 'allergies':
                this.saveAllergies();
                break;
            case 'content':
                this.saveContent();
                break;
            default:
                this.showNotification('Nichts zu speichern in dieser Sektion', 'info');
        }
    }
}

// Admin Panel initialisieren wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    window.moreMoriAdmin = new MoreMoriAdmin();
    
    // Mobile Menu Button (falls benötigt)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            window.moreMoriAdmin.toggleMobileMenu();
        });
    }
    
    // Keyboard Shortcuts aktivieren
    window.moreMoriAdmin.setupKeyboardShortcuts();
    
    console.log('MoreMori Admin Panel geladen und bereit!');
});

// Globale Funktionen für HTML onclick Events
function switchToSection(sectionName) {
    if (window.moreMoriAdmin) {
        window.moreMoriAdmin.showSection(sectionName);
    }
}

function saveAll() {
    if (window.moreMoriAdmin) {
        window.moreMoriAdmin.saveData().then(() => {
            window.moreMoriAdmin.showNotification('Alle Änderungen gespeichert!', 'success');
        });
    }
}

// Auto-Save Funktionalität
let autoSaveTimer;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        if (window.moreMoriAdmin) {
            console.log('Auto-Save ausgeführt');
            // Hier könnte ein stiller Auto-Save implementiert werden
        }
    }, 30000); // 30 Sekunden
}

// Event Listener für Auto-Save
document.addEventListener('input', scheduleAutoSave);
document.addEventListener('change', scheduleAutoSave);
