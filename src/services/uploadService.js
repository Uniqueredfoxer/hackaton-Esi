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
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
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
    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    if (urlError || !publicUrl) {
      // Clean up orphaned file
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      return { error: "Impossible de générer l'URL publique du fichier." };
    }

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

    const { error: dbError } = await supabase
      .from("documents")
      .insert(documentMetadata);

    if (dbError) {
      console.error("DB insert failed:", dbError);

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
