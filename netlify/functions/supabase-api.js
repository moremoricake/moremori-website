// MoreMori Supabase API - Netlify Function
// Ersetzt supabase-backend.php für serverless deployment

const { createClient } = require('@supabase/supabase-js');

// Supabase Konfiguration aus Environment Variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { action, type, id } = event.queryStringParameters || {};
        const body = event.body ? JSON.parse(event.body) : null;

        console.log(`📡 API Call: ${action} ${type} ${id || ''}`);

        let result;

        switch (action) {
            case 'get':
                result = await handleGet(type, id);
                break;
            case 'create':
                result = await handleCreate(type, body);
                break;
            case 'update':
                result = await handleUpdate(type, id, body);
                break;
            case 'delete':
                result = await handleDelete(type, id);
                break;
            case 'upload':
                result = await handleUpload(type, body);
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('❌ API Error:', error);
        
        return {
            statusCode: 500,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};

// GET Operations
async function handleGet(type, id) {
    const client = supabase;

    switch (type) {
        case 'products': {
            const { data, error } = id 
                ? await client.from('products').select('*').eq('id', id).single()
                : await client.from('products').select('*').order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        }

        case 'prices': {
            const { data, error } = id 
                ? await client.from('prices').select('*').eq('id', id).single()
                : await client.from('prices').select('*').order('category', { ascending: true });
            
            if (error) throw error;
            return data;
        }

        case 'calendar': {
            const { data, error } = id 
                ? await client.from('calendar_events').select('*').eq('id', id).single()
                : await client.from('calendar_events').select('*').order('date', { ascending: true });
            
            if (error) throw error;
            return data;
        }

        case 'banners': {
            const { data, error } = id 
                ? await client.from('banners').select('*').eq('id', id).single()
                : await client.from('banners').select('*').order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        }

        case 'faq': {
            const { data, error } = id 
                ? await client.from('faq').select('*').eq('id', id).single()
                : await client.from('faq').select('*').order('sort_order', { ascending: true });
            
            if (error) throw error;
            return data;
        }

        case 'allergies': {
            const { data, error } = id 
                ? await client.from('allergies').select('*').eq('id', id).single()
                : await client.from('allergies').select('*').order('name', { ascending: true });
            
            if (error) throw error;
            return data;
        }

        case 'content': {
            const { data, error } = id 
                ? await client.from('content').select('*').eq('id', id).single()
                : await client.from('content').select('*').order('section', { ascending: true });
            
            if (error) throw error;
            return data;
        }

        case 'settings': {
            const { data, error } = id 
                ? await client.from('settings').select('*').eq('id', id).single()
                : await client.from('settings').select('*').order('category', { ascending: true });
            
            if (error) throw error;
            return data;
        }

        case 'contact': {
            const { data, error } = id 
                ? await client.from('contact_submissions').select('*').eq('id', id).single()
                : await client.from('contact_submissions').select('*').order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        }

        case 'newsletter': {
            const { data, error } = id 
                ? await client.from('newsletter_subscriptions').select('*').eq('id', id).single()
                : await client.from('newsletter_subscriptions').select('*').order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        }

        default:
            throw new Error(`Unknown type for GET: ${type}`);
    }
}

// CREATE Operations
async function handleCreate(type, data) {
    const client = supabaseAdmin; // Use admin client for writes

    switch (type) {
        case 'products': {
            const { data: result, error } = await client
                .from('products')
                .insert([{
                    name: data.name,
                    description: data.description || '',
                    image_url: data.image_url || '',
                    category: data.category || 'general',
                    is_active: data.is_active !== false
                }])
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        case 'prices': {
            const { data: result, error } = await client
                .from('prices')
                .insert([{
                    category: data.category,
                    item_key: data.item_key,
                    name: data.name,
                    description: data.description || '',
                    price: parseFloat(data.price),
                    is_active: data.is_active !== false
                }])
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        case 'calendar': {
            const { data: result, error } = await client
                .from('calendar_events')
                .insert([{
                    name: data.name,
                    date: data.date,
                    time_start: data.time_start,
                    time_end: data.time_end,
                    location: data.location,
                    description: data.description || ''
                }])
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        case 'banners': {
            const { data: result, error } = await client
                .from('banners')
                .insert([{
                    title: data.title,
                    message: data.message,
                    banner_type: data.banner_type || 'announcement',
                    cta_text: data.cta_text || '',
                    link_url: data.link_url || '#',
                    position: data.position || 'popup',
                    is_active: data.is_active !== false,
                    dismissible: data.dismissible !== false,
                    auto_hide_seconds: data.auto_hide_seconds || null
                }])
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        case 'faq': {
            const { data: result, error } = await client
                .from('faq')
                .insert([{
                    question: data.question,
                    answer: data.answer,
                    category: data.category || 'general',
                    sort_order: data.sort_order || 0,
                    is_active: data.is_active !== false
                }])
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        case 'contact': {
            const { data: result, error } = await client
                .from('contact_submissions')
                .insert([{
                    name: data.name,
                    email: data.email,
                    phone: data.phone || '',
                    message: data.message,
                    subject: data.subject || 'Website Kontakt'
                }])
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        case 'newsletter': {
            const { data: result, error } = await client
                .from('newsletter_subscriptions')
                .insert([{
                    email: data.email,
                    name: data.name || '',
                    source: data.source || 'website'
                }])
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        default:
            throw new Error(`Unknown type for CREATE: ${type}`);
    }
}

// UPDATE Operations
async function handleUpdate(type, id, data) {
    const client = supabaseAdmin;

    if (!id) throw new Error('ID is required for updates');

    switch (type) {
        case 'products': {
            const updateData = {
                ...(data.name && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.image_url !== undefined && { image_url: data.image_url }),
                ...(data.category && { category: data.category }),
                ...(data.is_active !== undefined && { is_active: data.is_active }),
                updated_at: new Date().toISOString()
            };

            const { data: result, error } = await client
                .from('products')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        case 'prices': {
            const updateData = {
                ...(data.name && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.price !== undefined && { price: parseFloat(data.price) }),
                ...(data.is_active !== undefined && { is_active: data.is_active }),
                updated_at: new Date().toISOString()
            };

            const { data: result, error } = await client
                .from('prices')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        case 'banners': {
            const updateData = {
                ...(data.title && { title: data.title }),
                ...(data.message && { message: data.message }),
                ...(data.banner_type && { banner_type: data.banner_type }),
                ...(data.cta_text !== undefined && { cta_text: data.cta_text }),
                ...(data.link_url !== undefined && { link_url: data.link_url }),
                ...(data.position && { position: data.position }),
                ...(data.is_active !== undefined && { is_active: data.is_active }),
                ...(data.dismissible !== undefined && { dismissible: data.dismissible }),
                ...(data.auto_hide_seconds !== undefined && { auto_hide_seconds: data.auto_hide_seconds }),
                updated_at: new Date().toISOString()
            };

            const { data: result, error } = await client
                .from('banners')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        case 'settings': {
            const updateData = {
                ...(data.value !== undefined && { value: data.value }),
                ...(data.description !== undefined && { description: data.description }),
                updated_at: new Date().toISOString()
            };

            const { data: result, error } = await client
                .from('settings')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return result;
        }

        default:
            throw new Error(`Unknown type for UPDATE: ${type}`);
    }
}

// DELETE Operations
async function handleDelete(type, id) {
    const client = supabaseAdmin;

    if (!id) throw new Error('ID is required for delete');

    switch (type) {
        case 'products': {
            const { data: result, error } = await client
                .from('products')
                .delete()
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, deleted: result };
        }

        case 'prices': {
            const { data: result, error } = await client
                .from('prices')
                .delete()
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, deleted: result };
        }

        case 'calendar': {
            const { data: result, error } = await client
                .from('calendar_events')
                .delete()
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, deleted: result };
        }

        case 'banners': {
            const { data: result, error } = await client
                .from('banners')
                .delete()
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, deleted: result };
        }

        case 'faq': {
            const { data: result, error } = await client
                .from('faq')
                .delete()
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, deleted: result };
        }

        default:
            throw new Error(`Unknown type for DELETE: ${type}`);
    }
}

// File Upload to Supabase Storage
async function handleUpload(type, data) {
    const client = supabaseAdmin;

    switch (type) {
        case 'image': {
            const { filename, content, bucket = 'moremori-images' } = data;
            
            if (!filename || !content) {
                throw new Error('Filename and content are required for upload');
            }

            // Convert base64 to buffer if needed
            const buffer = Buffer.from(content, 'base64');
            
            const { data: uploadResult, error } = await client.storage
                .from(bucket)
                .upload(filename, buffer, {
                    contentType: 'image/jpeg',
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: urlData } = client.storage
                .from(bucket)
                .getPublicUrl(filename);

            return {
                success: true,
                path: uploadResult.path,
                url: urlData.publicUrl,
                fullPath: uploadResult.fullPath
            };
        }

        default:
            throw new Error(`Unknown type for UPLOAD: ${type}`);
    }
}
