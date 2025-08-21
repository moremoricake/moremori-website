<?php
// MoreMori Supabase Configuration - BEISPIEL
// WICHTIG: Diese Datei NIEMALS in Version Control committen!

return [
    // Project URL - von Supabase Dashboard → Settings → API
    'SUPABASE_URL' => 'https://xyz12345.supabase.co',
    
    // Anon/Public Key - von Supabase Dashboard → Settings → API
    'SUPABASE_ANON_KEY' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzUyNTYwMCwiZXhwIjoxOTYzMTAxNjAwfQ.example-anon-key',
    
    // Service Role Key - von Supabase Dashboard → Settings → API
    'SUPABASE_SERVICE_ROLE_KEY' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ3NTI1NjAwLCJleHAiOjE5NjMxMDE2MDB9.example-service-role-key',
    
    // Storage Configuration
    'STORAGE_BUCKET' => 'moremori-images',
    
    // Project Settings
    'PROJECT_NAME' => 'MoreMori Production',
    'REGION' => 'eu-central-1'
];

/*
SCREENSHOTS DER LOCATION:

1. https://app.supabase.com → Ihr Projekt wählen
2. Sidebar links unten: "Settings" 
3. Im Settings-Menü: "API"
4. Dort sehen Sie alle 3 Keys!

WICHTIG:
- anon key: Kann öffentlich verwendet werden
- service_role key: GEHEIM halten! Nie im Frontend verwenden!
*/
?>
