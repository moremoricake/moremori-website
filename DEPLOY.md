# 🚀 MoreMori - Netlify Deployment Anleitung

## ✅ Vorbereitung

### Schritt 1: Netlify Account erstellen
1. Gehe zu [netlify.com](https://netlify.com)
2. Registriere dich mit GitHub, GitLab oder E-Mail
3. Bestätige dein Konto

### Schritt 2: Git Repository erstellen (Optional aber empfohlen)
```bash
# In deinem MoreMori Ordner
git init
git add .
git commit -m "Initial MoreMori website"
```

## 🔧 Deployment Optionen

### Option A: Drag & Drop Deployment (Einfachste Methode)

1. **ZIP-Datei erstellen:**
   - Packe alle Dateien in eine ZIP-Datei (außer node_modules, .git)
   - Achte darauf, dass `netlify.toml` und `package.json` enthalten sind

2. **In Netlify hochladen:**
   - Gehe zu [app.netlify.com](https://app.netlify.com)
   - Ziehe die ZIP-Datei auf das "Deploy manually" Feld
   - Netlify erstellt automatisch eine URL wie `https://amazing-xyz-123.netlify.app`

3. **Environment Variables konfigurieren:**
   - Gehe zu Site Settings > Environment variables
   - Füge hinzu:
     ```
     SUPABASE_URL = https://fmknnazatrnknfqoykys.supabase.co
     SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZta25uYXphdHJua25mcW95a3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDYwMjYsImV4cCI6MjA3MTM4MjAyNn0.kvO5E-94R5uiAOhJuzVzHmp8OSynKEsm0WCWIdPoCcU
     SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZta25uYXphdHJua25mcW95a3lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgwNjAyNiwiZXhwIjoyMDcxMzgyMDI2fQ.nUQas46jMlWfWnsq2r6PdNOm_-nxCo2e7RKbx-7XsQA
     ```

### Option B: Git-basiertes Deployment (Professioneller)

1. **Repository auf GitHub erstellen:**
   ```bash
   # Lokales Git Repository
   git init
   git add .
   git commit -m "MoreMori website ready for deployment"
   
   # GitHub Repository erstellen und pushen
   git remote add origin https://github.com/USERNAME/moremori-website.git
   git push -u origin main
   ```

2. **In Netlify mit Git verbinden:**
   - New site from Git > GitHub
   - Repository auswählen: `moremori-website`
   - Build settings:
     - Build command: `echo "Building MoreMori..."`
     - Publish directory: `.` (Root)
     - Functions directory: `netlify/functions`

3. **Environment Variables wie oben konfigurieren**

## ⚙️ Nach dem Deployment

### Custom Domain konfigurieren (Optional)
1. Domain Settings > Add custom domain
2. Gebe deine Domain ein (z.B. `moremori.de`)
3. Folge den DNS-Anweisungen
4. SSL wird automatisch aktiviert

### Functions testen
Die API sollte unter diesen URLs erreichbar sein:
- `https://deine-site.netlify.app/.netlify/functions/supabase-api?action=get&type=prices`
- `https://deine-site.netlify.app/supabase-backend.php?action=get&type=settings`

## 🔍 Troubleshooting

### Problem: Functions funktionieren nicht
**Lösung:**
- Prüfe Environment Variables
- Schaue in Function Logs: Site > Functions > supabase-api > View logs

### Problem: CORS Fehler
**Lösung:**
- In `netlify/functions/supabase-api.js` sind CORS Headers bereits konfiguriert
- Prüfe, ob die Function korrekt deployed wurde

### Problem: Supabase Connection Error
**Lösung:**
1. Prüfe Environment Variables
2. Teste Supabase direkt:
   ```bash
   curl "https://fmknnazatrnknfqoykys.supabase.co/rest/v1/settings" \
     -H "apikey: DEIN_ANON_KEY"
   ```

## 🎯 Fertig!

Nach erfolgreichem Deployment sollte deine Website vollständig funktionieren:

- ✅ Frontend lädt Daten von Supabase
- ✅ Admin-Panel kann Daten bearbeiten
- ✅ Bilder werden in Supabase Storage gespeichert
- ✅ Automatisches HTTPS
- ✅ Weltweites CDN für schnelle Ladezeiten

**Deine Website ist jetzt live! 🎉**

## 📞 Support

Falls du Probleme hast:
1. Prüfe die Netlify Deploy Logs
2. Schaue in die Browser Konsole
3. Prüfe die Function Logs in Netlify

---

**Hinweis:** Die Supabase Keys in dieser Anleitung sind Beispiele. Verwende deine echten Keys aus dem Supabase Dashboard.
