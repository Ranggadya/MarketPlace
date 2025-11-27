import { supabase } from "./supabase";

export async function uploadToSupabase(
  file: File,
  folder: string
) {
  const fileName = `${folder}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("seller-docs")
    .upload(fileName, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("seller-docs")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
