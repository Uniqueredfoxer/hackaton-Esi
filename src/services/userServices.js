import supabase from "./supabase";

export async function fetchUserProfile() {
  const {
    user: { session },
    error: authError,
  } = await supabase.auth.getSession();
  if (authError || !session?.user) {
    throw new Error("Vous devez être connecté pour accéder à votre profil.");
  }

  const userId = session.user.id;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      username,
      role,
      scores,
      profile_picture,
      bio,
      created_at
    `,
    )
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}

//fetch user documents
export async function fetchUserDocuments() {
  const {
    user: { session },
    error: authError,
  } = await supabase.auth.getSession();
  if (authError || !session?.user) {
    throw new Error("Authentification requise");
  }

  const { data, error } = await supabase
    .from("documents")
    .select(
      `
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
    `,
    )
    .eq("author_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Échec du chargement des documents");
  return data;
}

export async function fetchUserPosts(userId) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      description,
      tags,
      is_resolved,
      scores,
      comments_number,
      posted_at,
      image_url
    `,
    )
    .eq("author_id", userId)
    .order("posted_at", { ascending: false });

  if (error) throw error;
  return data;
}
