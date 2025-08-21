-- MoreMori Supabase Database Schema
-- PostgreSQL/Supabase Database Structure

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Products table (Produktbilder)
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prices table (Preise)
CREATE TABLE prices (
    id BIGSERIAL PRIMARY KEY,
    category TEXT NOT NULL, -- 'bases', 'creams', 'events'
    item_key TEXT NOT NULL, -- 'wolke', 'mokka', etc.
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category, item_key)
);

-- Calendar Events table (Kalender)
CREATE TABLE calendar_events (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allergies table (Allergie-Warnungen)
CREATE TABLE allergies (
    id BIGSERIAL PRIMARY KEY,
    product_type TEXT NOT NULL, -- 'wolke', 'mokka', 'toppings'
    allergen TEXT NOT NULL, -- 'gluten', 'nuts', 'milk', etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_type, allergen)
);

-- Content table (Inhalte/CMS)
CREATE TABLE content (
    id BIGSERIAL PRIMARY KEY,
    section TEXT NOT NULL, -- 'hero', 'about', etc.
    key TEXT NOT NULL,
    title TEXT,
    content TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section, key)
);

-- Settings table (Einstellungen)
CREATE TABLE settings (
    id BIGSERIAL PRIMARY KEY,
    category TEXT NOT NULL, -- 'contact', 'social', 'general'
    key TEXT NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category, key)
);

-- FAQ table
CREATE TABLE faq (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners table
CREATE TABLE banners (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    banner_type TEXT DEFAULT 'announcement', -- 'launch', 'promotion', 'seasonal', 'announcement'
    cta_text TEXT,
    cta_link TEXT,
    icon TEXT,
    position TEXT DEFAULT 'top', -- 'top', 'floating'
    is_active BOOLEAN DEFAULT true,
    auto_hide_after INTEGER, -- seconds
    show_close_button BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Form Submissions table
CREATE TABLE contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscriptions table
CREATE TABLE newsletter_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes für bessere Performance
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_prices_category ON prices(category);
CREATE INDEX idx_prices_active ON prices(is_active);
CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX idx_calendar_events_active ON calendar_events(is_active);
CREATE INDEX idx_allergies_product_type ON allergies(product_type);
CREATE INDEX idx_content_section ON content(section);
CREATE INDEX idx_settings_category ON settings(category);
CREATE INDEX idx_faq_active ON faq(is_active);
CREATE INDEX idx_banners_active ON banners(is_active);
CREATE INDEX idx_banners_dates ON banners(start_date, end_date);

-- Row Level Security (RLS) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read access für Frontend
CREATE POLICY "Public can read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read prices" ON prices FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read calendar_events" ON calendar_events FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read allergies" ON allergies FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read content" ON content FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read faq" ON faq FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read banners" ON banners FOR SELECT USING (is_active = true);

-- Public insert für Contact & Newsletter
CREATE POLICY "Public can insert contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert newsletter_subscriptions" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);

-- Admin full access (später durch Authentication erweitern)
-- CREATE POLICY "Admin full access" ON ALL TABLES FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- Update Triggers für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prices_updated_at BEFORE UPDATE ON prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_allergies_updated_at BEFORE UPDATE ON allergies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_updated_at BEFORE UPDATE ON faq FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Initial Data (Seed Data)
INSERT INTO content (section, key, title, content) VALUES
('hero', 'title', 'Hauptslogan', 'Süße Momente zum Selbergestalten.'),
('hero', 'subtitle', 'Untertitel', 'Ulms erste interaktive Cake-Bar, bei der DU der Künstler bist.'),
('about', 'text', 'Über uns Text', 'Als Gründer von MoreMori lebe ich meine Leidenschaft für Süßes aus. Bei uns geht es um mehr als nur Kuchen – es geht um ein Erlebnis.');

INSERT INTO prices (category, item_key, name, description, price) VALUES
('bases', 'wolke', 'MoreMori Wolke', 'Luftig-leichter Vanille-Riegel', 4.50),
('bases', 'mokka', 'Mokka-Traum', 'Intensiver Kaffee-Riegel', 4.90),
('creams', 'vanille', 'Vanille-Creme', 'Cremige Vanille-Creme aus echter Bourbon-Vanille', 0.80),
('creams', 'erdbeere', 'Erdbeer-Soße', 'Fruchtige Erdbeersoße aus echten Erdbeeren', 0.90),
('creams', 'karamell', 'Flüssiges Karamell', 'Süßes, flüssiges Karamell mit butterigem Geschmack', 1.00),
('events', 'basic', 'Event Basic (20 Personen)', 'Perfekt für kleinere Events', 120.00),
('events', 'premium', 'Event Premium (50 Personen)', 'Für große Events mit Premium-Ausstattung', 280.00);

INSERT INTO allergies (product_type, allergen) VALUES
('wolke', 'gluten'),
('wolke', 'eggs'),
('wolke', 'milk'),
('mokka', 'gluten'),
('mokka', 'eggs'),
('mokka', 'milk'),
('mokka', 'caffeine'),
('toppings', 'nuts'),
('toppings', 'milk');

INSERT INTO settings (category, key, value, description) VALUES
('contact', 'phone', '+49 123 456 7890', 'Haupttelefonnummer'),
('contact', 'email', 'info@moremori.de', 'Hauptkontakt E-Mail'),
('contact', 'whatsapp', '+49 123 456 7890', 'WhatsApp Nummer'),
('social', 'instagram', '', 'Instagram URL'),
('social', 'facebook', '', 'Facebook URL'),
('general', 'maintenance_mode', 'false', 'Wartungsmodus aktiviert');

INSERT INTO faq (question, answer, sort_order) VALUES
('Sind eure Riegel vegetarisch?', 'Ja, alle unsere Produkte sind zu 100% vegetarisch. Wir verwenden keine tierischen Produkte außer Milchprodukten und Eiern in einigen unserer Cremes.', 1),
('Bietet ihr auch glutenfreie Optionen an?', 'Derzeit haben wir noch keine glutenfreien Riegelböden im Angebot, arbeiten aber daran, unser Sortiment zu erweitern. Bleibt dran!', 2),
('Gibt es Allergie-Warnungen? ⚠️', 'Ja! Alle unsere Produkte werden deutlich mit Allergie-Warnungen gekennzeichnet. Wir informieren dich über alle enthaltenen Allergene wie Nüsse, Gluten, Milchprodukte etc.', 3);
