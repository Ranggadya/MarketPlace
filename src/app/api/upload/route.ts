import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export async function POST(request: NextRequest) {
  try {
    // ===================================
    // 1. INIT SUPABASE CLIENT (Service Role)
    // ===================================
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = 
      process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('❌ Missing Supabase configuration:', {
        supabaseUrl: supabaseUrl ? 'Exists' : 'Missing',
        serviceRoleKey: serviceRoleKey ? 'Exists' : 'Missing'
      });
      return NextResponse.json(
        { error: 'Server configuration error: Missing Supabase keys' },
        { status: 500 }
      );
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    // ===================================
    // 2. GET FILE FROM REQUEST
    // ===================================
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    // ===================================
    // 3. CONVERT FILE TO BUFFER
    // ===================================
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // ===================================
    // 4. UPLOAD TO SUPABASE STORAGE
    // ===================================
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });
    if (error) {
      console.error('❌ Supabase upload error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    // ===================================
    // 5. GET PUBLIC URL
    // ===================================
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);
    console.log('✅ Image uploaded successfully:', urlData.publicUrl);
    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path
    });
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
