import supabase from "./supabase";

const formatFileSize = (sizeInBytes) => {
  if (typeof sizeInBytes !== "number" || sizeInBytes < 0) {
    return "0 KB";
  }

  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

export async function fetchDocuments(options = {}) {
  const {
    query = "",
    tag = "",
    year = "",
    level = "",
    fileType = "",
    limit = 10,
    offset = 0,
  } = options;

  try {
    let supabaseQuery = supabase
      .from("documents")
      .select(
        "id, title, description, category, year, tags, level, file_url, file_type, file_size_bytes, uploaded_at, author_id, downloads, profiles!inner(username)",
        { count: "exact" }, // Get total count for pagination
      )
      .order("uploaded_at", { ascending: false });

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%`,
      );
    }

    if (tag) {
      supabaseQuery = supabaseQuery.contains("tags", [tag]);
    }

    if (year) {
      supabaseQuery = supabaseQuery.eq("year", parseInt(year));
    }

    if (level) {
      supabaseQuery = supabaseQuery.eq("level", level);
    }

    if (fileType) {
      supabaseQuery = supabaseQuery.eq("file_type", fileType.toLowerCase());
    }

    // Apply pagination
    supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

    // Execute the query
    const { data: documents, error, count } = await supabaseQuery;

    if (error) {
      console.error("Error fetching documents:", error);
      return { data: [], count: 0 };
    }

    // Format data for UI
    const formattedDocuments = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      year: doc.year,
      tags: doc.tags || [],
      level: doc.level,
      file_url: doc.file_url,
      file_type: doc.file_type,
      file_size: formatFileSize(doc.file_size_bytes),
      postedAt: doc.uploaded_at,
      downloads: doc.downloads,
      author: doc.profiles?.username || "anonymous",
    }));

    return {
      data: formattedDocuments,
      count: count || 0,
    };
  } catch (error) {
    console.error("Unexpected error in fetchDocuments:", error);
    return { data: [], count: 0 };
  }
}

export async function fetchDocumentById(id) {
  const { data: document, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching Document by ID:", error);
    return null;
  }

  return document;
}

export async function updateDocument(documentId, updates) {
  const {
    user: { session },
    error: authError,
  } = await supabase.auth.getSession();
  if (authError || !session?.user) {
    throw new Error("Authentification requise");
  }

  // Verify ownership
  const { doc } = await supabase
    .from("documents")
    .select("author_id")
    .eq("id", documentId)
    .single();

  if (!doc || doc.author_id !== session.user.id) {
    throw new Error("Non autorisé");
  }

  const cleanUpdates = {};
  if (updates.title !== undefined) cleanUpdates.title = updates.title.trim();
  if (updates.description !== undefined)
    cleanUpdates.description = updates.description.trim();
  if (updates.category !== undefined) cleanUpdates.category = updates.category;
  if (updates.year !== undefined)
    cleanUpdates.year = parseInt(updates.year, 10);
  if (updates.tags !== undefined) cleanUpdates.tags = updates.tags;
  if (updates.level !== undefined) cleanUpdates.level = updates.level;

  const { error } = await supabase
    .from("documents")
    .update(cleanUpdates)
    .eq("id", documentId);

  if (error) throw new Error("Échec de la mise à jour");
}

export async function deleteDocument(documentId) {
  const {
    user: { session },
    error: authError,
  } = await supabase.auth.getSession();
  if (authError || !session?.user) {
    throw new Error("Authentification requise");
  }

  // Get document to verify ownership + get file path
  const { doc } = await supabase
    .from("documents")
    .select("author_id, file_url")
    .eq("id", documentId)
    .single();

  if (!doc || doc.author_id !== session.user.id) {
    throw new Error("Non autorisé");
  }

  // Extract file path from URL (e.g., "https://.../user-id/uuid.pdf" → "user-id/uuid.pdf")
  const filePath = doc.file_url.split("/").slice(-2).join("/");

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

export async function getUsername(userId) {
  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId) // ✅ Correct column name
      .single();

    if (error || !data) {
      console.error("User not found:", error || "No data");
      return { success: false, error: "User not found" };
    }

    return { success: true, username: data.username };
  } catch (error) {
    console.error("Error fetching username:", error);
    return { success: false, error: error.message };
  }
}
