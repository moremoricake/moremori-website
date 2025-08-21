<?php
// MoreMori Supabase Backend
// Verbindung zu Supabase PostgreSQL Database

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class SupabaseBackend {
    private $supabaseUrl;
    private $supabaseKey;
    private $serviceRoleKey;
    private $storageBucket;
    
    public function __construct() {
        // Konfiguration aus externer Datei laden
        $config = require_once 'supabase-config.php';
        $this->supabaseUrl = $config['SUPABASE_URL'];
        $this->supabaseKey = $config['SUPABASE_ANON_KEY'];
        $this->serviceRoleKey = $config['SUPABASE_SERVICE_ROLE_KEY'];
        $this->storageBucket = $config['STORAGE_BUCKET'];
    }
    
    private function makeRequest($endpoint, $method = 'GET', $data = null, $useServiceRole = false) {
        $url = $this->supabaseUrl . '/rest/v1/' . $endpoint;
        
        $headers = [
            'Content-Type: application/json',
            'Prefer: return=representation',
            'apikey: ' . ($useServiceRole ? $this->serviceRoleKey : $this->supabaseKey)
        ];
        
        if ($useServiceRole) {
            $headers[] = 'Authorization: Bearer ' . $this->serviceRoleKey;
        } else {
            $headers[] = 'Authorization: Bearer ' . $this->supabaseKey;
        }
        
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        
        if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        
        if (curl_errno($curl)) {
            throw new Exception('Curl error: ' . curl_error($curl));
        }
        
        curl_close($curl);
        
        if ($httpCode >= 400) {
            $errorData = json_decode($response, true);
            throw new Exception($errorData['message'] ?? 'HTTP Error ' . $httpCode);
        }
        
        return json_decode($response, true);
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';
        
        try {
            switch($method) {
                case 'GET':
                    return $this->handleGet($action);
                case 'POST':
                    return $this->handlePost($action);
                case 'PUT':
                    return $this->handlePut($action);
                case 'DELETE':
                    return $this->handleDelete($action);
                default:
                    throw new Exception('Ungültige HTTP-Methode');
            }
        } catch(Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
    
    // GET Requests
    private function handleGet($action) {
        switch($action) {
            case 'products':
                return $this->getProducts();
            case 'prices':
                return $this->getPrices();
            case 'calendar':
                return $this->getCalendar();
            case 'allergies':
                return $this->getAllergies();
            case 'content':
                return $this->getContent();
            case 'settings':
                return $this->getSettings();
            case 'faq':
                return $this->getFAQ();
            case 'banners':
                return $this->getBanners();
            default:
                return $this->getAllData();
        }
    }
    
    // POST Requests
    private function handlePost($action) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        switch($action) {
            case 'upload':
                return $this->handleImageUpload();
            case 'contact':
                return $this->handleContactForm($input);
            case 'newsletter':
                return $this->handleNewsletterSignup($input);
            case 'products':
                return $this->createProduct($input);
            case 'prices':
                return $this->createPrice($input);
            case 'calendar':
                return $this->createCalendarEvent($input);
            case 'faq':
                return $this->createFAQ($input);
            case 'banners':
                return $this->createBanner($input);
            default:
                throw new Exception('Ungültige POST-Aktion');
        }
    }
    
    // PUT Requests
    private function handlePut($action) {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;
        
        switch($action) {
            case 'products':
                return $this->updateProduct($id, $input);
            case 'prices':
                return $this->updatePrice($id, $input);
            case 'calendar':
                return $this->updateCalendarEvent($id, $input);
            case 'content':
                return $this->updateContent($input);
            case 'allergies':
                return $this->updateAllergies($input);
            case 'settings':
                return $this->updateSettings($input);
            case 'faq':
                return $this->updateFAQ($id, $input);
            case 'banners':
                return $this->updateBanner($id, $input);
            default:
                throw new Exception('Ungültige PUT-Aktion');
        }
    }
    
    // DELETE Requests
    private function handleDelete($action) {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            throw new Exception('ID erforderlich für DELETE-Operationen');
        }
        
        switch($action) {
            case 'products':
                return $this->deleteProduct($id);
            case 'prices':
                return $this->deletePrice($id);
            case 'calendar':
                return $this->deleteCalendarEvent($id);
            case 'faq':
                return $this->deleteFAQ($id);
            case 'banners':
                return $this->deleteBanner($id);
            default:
                throw new Exception('Ungültige DELETE-Aktion');
        }
    }
    
    // Products
    private function getProducts() {
        $data = $this->makeRequest('products?order=sort_order.asc,created_at.desc');
        return $this->successResponse($data);
    }
    
    private function createProduct($data) {
        $result = $this->makeRequest('products', 'POST', $data, true);
        return $this->successResponse($result[0], 'Produkt erfolgreich erstellt');
    }
    
    private function updateProduct($id, $data) {
        $result = $this->makeRequest("products?id=eq.$id", 'PATCH', $data, true);
        return $this->successResponse($result[0], 'Produkt erfolgreich aktualisiert');
    }
    
    private function deleteProduct($id) {
        $this->makeRequest("products?id=eq.$id", 'DELETE', null, true);
        return $this->successResponse(null, 'Produkt erfolgreich gelöscht');
    }
    
    // Prices
    private function getPrices() {
        $data = $this->makeRequest('prices?order=category.asc,item_key.asc');
        
        // Gruppiere nach Kategorien für Frontend-Kompatibilität
        $grouped = [];
        foreach ($data as $item) {
            $category = $item['category'];
            if (!isset($grouped[$category])) {
                $grouped[$category] = [];
            }
            $grouped[$category][$item['item_key']] = [
                'id' => $item['id'],
                'name' => $item['name'],
                'description' => $item['description'],
                'price' => (float)$item['price']
            ];
        }
        
        return $this->successResponse($grouped);
    }
    
    private function createPrice($data) {
        $result = $this->makeRequest('prices', 'POST', $data, true);
        return $this->successResponse($result[0], 'Preis erfolgreich erstellt');
    }
    
    private function updatePrice($id, $data) {
        $result = $this->makeRequest("prices?id=eq.$id", 'PATCH', $data, true);
        return $this->successResponse($result[0], 'Preis erfolgreich aktualisiert');
    }
    
    private function deletePrice($id) {
        $this->makeRequest("prices?id=eq.$id", 'DELETE', null, true);
        return $this->successResponse(null, 'Preis erfolgreich gelöscht');
    }
    
    // Calendar
    private function getCalendar() {
        $data = $this->makeRequest('calendar_events?order=event_date.asc&is_active=eq.true');
        return $this->successResponse($data);
    }
    
    private function createCalendarEvent($data) {
        $result = $this->makeRequest('calendar_events', 'POST', $data, true);
        return $this->successResponse($result[0], 'Event erfolgreich erstellt');
    }
    
    private function updateCalendarEvent($id, $data) {
        $result = $this->makeRequest("calendar_events?id=eq.$id", 'PATCH', $data, true);
        return $this->successResponse($result[0], 'Event erfolgreich aktualisiert');
    }
    
    private function deleteCalendarEvent($id) {
        $this->makeRequest("calendar_events?id=eq.$id", 'DELETE', null, true);
        return $this->successResponse(null, 'Event erfolgreich gelöscht');
    }
    
    // Allergies
    private function getAllergies() {
        $data = $this->makeRequest('allergies?order=product_type.asc,allergen.asc&is_active=eq.true');
        
        // Gruppiere nach Produkt-Typ
        $grouped = [];
        foreach ($data as $item) {
            $productType = $item['product_type'];
            if (!isset($grouped[$productType])) {
                $grouped[$productType] = [];
            }
            $grouped[$productType][] = $item['allergen'];
        }
        
        return $this->successResponse($grouped);
    }
    
    private function updateAllergies($data) {
        // TODO: Implementiere Batch-Update für Allergien
        return $this->successResponse(null, 'Allergien aktualisiert');
    }
    
    // Content
    private function getContent() {
        $data = $this->makeRequest('content?order=section.asc,key.asc&is_active=eq.true');
        
        // Gruppiere nach Sektion
        $grouped = [];
        foreach ($data as $item) {
            $section = $item['section'];
            if (!isset($grouped[$section])) {
                $grouped[$section] = [];
            }
            $grouped[$section][$item['key']] = [
                'id' => $item['id'],
                'title' => $item['title'],
                'content' => $item['content']
            ];
        }
        
        return $this->successResponse($grouped);
    }
    
    private function updateContent($data) {
        // TODO: Implementiere Content-Update
        return $this->successResponse(null, 'Content aktualisiert');
    }
    
    // Settings
    private function getSettings() {
        $data = $this->makeRequest('settings?order=category.asc,key.asc');
        
        // Gruppiere nach Kategorie
        $grouped = [];
        foreach ($data as $item) {
            $category = $item['category'];
            if (!isset($grouped[$category])) {
                $grouped[$category] = [];
            }
            $grouped[$category][$item['key']] = $item['value'];
        }
        
        return $this->successResponse($grouped);
    }
    
    private function updateSettings($data) {
        // TODO: Implementiere Settings-Update
        return $this->successResponse(null, 'Einstellungen aktualisiert');
    }
    
    // FAQ
    private function getFAQ() {
        $data = $this->makeRequest('faq?order=sort_order.asc&is_active=eq.true');
        return $this->successResponse($data);
    }
    
    private function createFAQ($data) {
        $result = $this->makeRequest('faq', 'POST', $data, true);
        return $this->successResponse($result[0], 'FAQ erfolgreich erstellt');
    }
    
    private function updateFAQ($id, $data) {
        $result = $this->makeRequest("faq?id=eq.$id", 'PATCH', $data, true);
        return $this->successResponse($result[0], 'FAQ erfolgreich aktualisiert');
    }
    
    private function deleteFAQ($id) {
        $this->makeRequest("faq?id=eq.$id", 'DELETE', null, true);
        return $this->successResponse(null, 'FAQ erfolgreich gelöscht');
    }
    
    // Banners
    private function getBanners() {
        $data = $this->makeRequest('banners?order=created_at.desc');
        return $this->successResponse($data);
    }
    
    private function createBanner($data) {
        $result = $this->makeRequest('banners', 'POST', $data, true);
        return $this->successResponse($result[0], 'Banner erfolgreich erstellt');
    }
    
    private function updateBanner($id, $data) {
        $result = $this->makeRequest("banners?id=eq.$id", 'PATCH', $data, true);
        return $this->successResponse($result[0], 'Banner erfolgreich aktualisiert');
    }
    
    private function deleteBanner($id) {
        $this->makeRequest("banners?id=eq.$id", 'DELETE', null, true);
        return $this->successResponse(null, 'Banner erfolgreich gelöscht');
    }
    
    // Contact Form
    private function handleContactForm($data) {
        // Validierung
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            throw new Exception('Alle Felder sind erforderlich');
        }
        
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Ungültige E-Mail-Adresse');
        }
        
        // Zusätzliche Daten hinzufügen
        $submissionData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'subject' => $data['subject'] ?? 'Kontaktanfrage',
            'message' => $data['message'],
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
        ];
        
        $result = $this->makeRequest('contact_submissions', 'POST', $submissionData);
        
        // TODO: E-Mail-Benachrichtigung senden
        
        return $this->successResponse($result[0], 'Nachricht erfolgreich gesendet');
    }
    
    // Newsletter
    private function handleNewsletterSignup($data) {
        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Gültige E-Mail-Adresse erforderlich');
        }
        
        $newsletterData = [
            'email' => $data['email'],
            'is_active' => true
        ];
        
        try {
            $result = $this->makeRequest('newsletter_subscriptions', 'POST', $newsletterData);
            return $this->successResponse($result[0], 'Newsletter-Anmeldung erfolgreich');
        } catch(Exception $e) {
            if (strpos($e->getMessage(), 'duplicate key') !== false) {
                return $this->successResponse(null, 'E-Mail bereits registriert');
            }
            throw $e;
        }
    }
    
    // Image Upload to Supabase Storage
    private function handleImageUpload() {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Fehler beim Hochladen des Bildes');
        }
        
        $file = $_FILES['image'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception('Ungültiger Dateityp. Nur JPEG, PNG, GIF und WebP sind erlaubt.');
        }
        
        if ($file['size'] > 5 * 1024 * 1024) { // 5MB Limit
            throw new Exception('Datei zu groß. Maximum 5MB erlaubt.');
        }
        
        $filename = uniqid() . '_' . basename($file['name']);
        
        // Upload zu Supabase Storage
        $storageUrl = $this->supabaseUrl . '/storage/v1/object/' . $this->storageBucket . '/' . $filename;
        
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $storageUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => file_get_contents($file['tmp_name']),
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->serviceRoleKey,
                'Content-Type: ' . $file['type'],
                'apikey: ' . $this->serviceRoleKey
            ]
        ]);
        
        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        
        if ($httpCode !== 200) {
            throw new Exception('Fehler beim Upload zu Supabase Storage');
        }
        
        // Bild-URL für öffentlichen Zugriff
        $publicUrl = $this->supabaseUrl . '/storage/v1/object/public/moremori-images/' . $filename;
        
        // Eintrag in products Tabelle
        $productData = [
            'name' => pathinfo($file['name'], PATHINFO_FILENAME),
            'description' => '',
            'image_url' => $publicUrl,
            'alt_text' => pathinfo($file['name'], PATHINFO_FILENAME),
            'is_active' => true
        ];
        
        $result = $this->makeRequest('products', 'POST', $productData, true);
        
        return $this->successResponse($result[0], 'Bild erfolgreich hochgeladen');
    }
    
    // Helper Functions
    private function getAllData() {
        return $this->successResponse([
            'products' => $this->getProducts()['data'],
            'prices' => $this->getPrices()['data'],
            'calendar' => $this->getCalendar()['data'],
            'allergies' => $this->getAllergies()['data'],
            'content' => $this->getContent()['data'],
            'settings' => $this->getSettings()['data'],
            'faq' => $this->getFAQ()['data'],
            'banners' => $this->getBanners()['data']
        ]);
    }
    
    private function successResponse($data = null, $message = 'Erfolgreich') {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('c')
        ];
    }
    
    private function errorResponse($message) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => $message,
            'timestamp' => date('c')
        ];
    }
}

// Request handling
try {
    $backend = new SupabaseBackend();
    $response = $backend->handleRequest();
    echo json_encode($response);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server-Fehler: ' . $e->getMessage(),
        'timestamp' => date('c')
    ]);
}
?>
