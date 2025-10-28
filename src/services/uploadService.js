// src/services/uploadService.js
import supabase from "./supabase";
import { v4 as uuidv4 } from "uuid";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIMES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Optional: use public CDN-hosted fallbacks or remove if not needed
const THUMBNAIL_FALLBACKS = {
  "application/pdf": "https://your-cdn.com/default_pdf.png", // ← replace with real URL or remove
  "image/jpeg": "https://your-cdn.com/default_image.png",
  "image/png": "https://your-cdn.com/default_image.png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "https://your-cdn.com/default_doc.png",
};

/**
 * Uploads a file to Supabase Storage and saves metadata to the 'documents' table.
 * @param {File} file
 * @param {Object} metadata
 * @returns {Promise<{ success: boolean, error?: string, document?: any }>}
 */
export async function uploadFile(file, metadata) {
  try {
    // ✅ 1. Get current user (modern Supabase v2+ way)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return { error: "Vous devez être connecté pour téléverser un fichier." };
    }
    const user = session.user;

    // ✅ 2. Validate file
    if (file.size > MAX_SIZE_BYTES) {
      return {
        error: `La taille du fichier ne doit pas dépasser ${MAX_SIZE_BYTES / (1024 * 1024)} Mo.`,
      };
    }

    if (!ALLOWED_MIMES.includes(file.type)) {
      return { error: `Type de fichier non supporté : ${file.type}` };
    }

    // ✅ 3. Upload to Storage
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const uniqueId = uuidv4();
    const filePath = `${user.id}/${uniqueId}.${fileExtension}`;

 
    const BUCKET_NAME = "file bucket for digital Library"; // ← must match your actual bucket name

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload failed:", uploadError);
      return { error: "Échec de téléversement du fichier." };
    }

    // ✅ 4. Get public URL
    const { data: { publicUrl }, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    if (urlError || !publicUrl) {
      // Clean up orphaned file
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      return { error: "Impossible de générer l'URL publique du fichier." };
    }

    // ✅ 5. Insert into DATABASE TABLE (not bucket!)
    const documentMetadata = {
      author_id: user.id,
      title: metadata.title.trim(),
      description: (metadata.description || "").trim(),
      category: metadata.category,
      year: metadata.year ? parseInt(metadata.year, 10) : null,
      tags: metadata.tags || [],
      level: metadata.level,
      file_url: publicUrl,
      file_type: fileExtension.toUpperCase(),
      file_size_bytes: file.size,
      thumbnail_url: THUMBNAIL_FALLBACKS[file.type] || null,
    };

    // ⚠️ IMPORTANT: Table name must be 'documents' (or whatever you created in DB)
    const { error: dbError } = await supabase
      .from("documents") // ← this is your POSTGRES TABLE name
      .insert(documentMetadata);

    if (dbError) {
      console.error("DB insert failed:", dbError);
      
      // Attempt cleanup
      try {
        const { error: deleteError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([filePath]);
          
        if (deleteError) {
          console.error("Orphaned file cleanup failed:", deleteError);
          // Consider alerting admins or logging to monitoring
        } else {
          console.log("Orphaned file deleted successfully");
        }
      } catch (cleanupErr) {
        console.error("Unexpected cleanup error:", cleanupErr);
      }
      
      return { error: "Échec de l'enregistrement des métadonnées." };
    }
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in uploadFile:", err);
    return { error: "Erreur inattendue lors du téléversement." };
  }
}




// Update document metadata (title, description, etc.)
export async function updateDocument(documentId, updates) {
  const {  user: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session?.user) {
    throw new Error("Authentification requise");
  }

  // Verify ownership
  const {  doc } = await supabase
    .from("documents")
    .select("author_id")
    .eq("id", documentId)
    .single();

  if (!doc || doc.author_id !== session.user.id) {
    throw new Error("Non autorisé");
  }

  const cleanUpdates = {};
  if (updates.title !== undefined) cleanUpdates.title = updates.title.trim();
  if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
  if (updates.category !== undefined) cleanUpdates.category = updates.category;
  if (updates.year !== undefined) cleanUpdates.year = parseInt(updates.year, 10);
  if (updates.tags !== undefined) cleanUpdates.tags = updates.tags;
  if (updates.level !== undefined) cleanUpdates.level = updates.level;

  const { error } = await supabase
    .from("documents")
    .update(cleanUpdates)
    .eq("id", documentId);

  if (error) throw new Error("Échec de la mise à jour");
}

// Delete document (file + metadata)
export async function deleteDocument(documentId) {
  const {  user: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session?.user) {
    throw new Error("Authentification requise");
  }

  // Get document to verify ownership + get file path
  const {  doc } = await supabase
    .from("documents")
    .select("author_id, file_url")
    .eq("id", documentId)
    .single();

  if (!doc || doc.author_id !== session.user.id) {
    throw new Error("Non autorisé");
  }

  // Extract file path from URL (e.g., "https://.../user-id/uuid.pdf" → "user-id/uuid.pdf")
  const filePath = doc.file_url.split('/').slice(-2).join('/');

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from("file bucket for digital Library")
    .remove([filePath]);

  if (storageError) {
    console.error("Storage delete failed:", storageError);
    // Don't throw — delete DB record anyway to avoid orphaned metadata
  }

  // Delete from DB
  const { error: dbError } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (dbError) throw new Error("Échec de la suppression");
}

// Fetch user's documents
export async function fetchUserDocuments() {
  const {  user: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session?.user) {
    throw new Error("Authentification requise");
  }

  const { data, error } = await supabase
    .from("documents")
    .select(`
      id,
      title,
      description,
      category,
      year,
      tags,
      level,
      file_url,
      file_type,
      file_size_bytes,
      created_at
    `)
    .eq("author_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Échec du chargement des documents");
  return data;
}