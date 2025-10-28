import supabase from "./supabase";

// ======================
// CREATE
// ======================
export async function createPost(postData) {
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session?.user) {
    throw new Error("Authentification requise");
  }

  const newPost = {
    title: postData.title.trim(),
    description: postData.description.trim(),
    tags: Array.isArray(postData.tags) ? postData.tags : [],
    image_url: postData.imageUrl || null,
    author_id: session.user.id,
  };

  const { data, error } = await supabase
    .from("posts")
    .insert(newPost)
    .select()
    .single();

  if (error) {
    console.error("Create post error:", error);
    throw new Error("Échec de la publication");
  }

  return data;
}

// ======================
// READ
// ======================
export async function fetchPosts(filters = {}) {
  const { q = "", tag = "", resolved = "Tout" } = filters;

  let query = supabase
    .from("posts")
    .select(`
      id,
      title,
      description,
      tags,
      is_resolved,
      scores,
      comments_number,
      posted_at,
      image_url,
      author_id
    `)
    .order("posted_at", { ascending: false });

  // Search in title/description
  if (q) {
    const term = `%${q}%`;
    query = query.or(`title.ilike.${term},description.ilike.${term}`);
  }

  // Filter by resolved
  if (resolved === "Résolues") {
    query = query.eq("is_resolved", true);
  } else if (resolved === "Non résolues") {sont-elles
    query = query.eq("is_resolved", false);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Fetch posts error:", error);
    return [];
  }

  // Client-side tag filter (simple & safe)
  let result = data;
  if (tag && tag !== "Tout") {
    result = data.filter(p => 
      Array.isArray(p.tags) && p.tags.includes(tag)
    );
  }

  return result.map(post => ({
    id: post.id,
    title: post.title,
    description: post.description,
    tags: post.tags || [],
    isResolved: post.is_resolved,
    score: post.scores || 0,
    commentsNumber: post.comments_number || 0,
    postedAt: post.posted_at,
    imageUrl: post.image_url || null,
    author: { id: post.author_id }
  }));
}

export async function fetchPost(postId) {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      description,
      tags,
      is_resolved,
      scores,
      comments_number,
      posted_at,
      image_url,
      author_id
    `)
    .eq("id", postId)
    .single();

  if (error) {
    console.error("Fetch single post error:", error);
    throw new Error("Publication introuvable");
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    tags: data.tags || [],
    isResolved: data.is_resolved,
    score: data.scores || 0,
    commentsNumber: data.comments_number || 0,
    postedAt: data.posted_at,
    imageUrl: data.image_url || null,
    author: { id: data.author_id }
  };
}

// ======================
// UPDATE
// ======================
export async function updatePost(postId, updates) {
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session?.user) {
    throw new Error("Authentification requise");
  }

  // Verify ownership
  const { data: existingPost } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (!existingPost || existingPost.author_id !== session.user.id) {
    throw new Error("Non autorisé");
  }

  const cleanUpdates = {
    title: updates.title?.trim(),
    description: updates.description?.trim(),
    tags: Array.isArray(updates.tags) ? updates.tags : undefined,
    is_resolved: updates.isResolved,
    // Do not allow updating author_id, scores, etc.
  };

  // Remove undefined fields
  Object.keys(cleanUpdates).forEach(key => {
    if (cleanUpdates[key] === undefined) delete cleanUpdates[key];
  });

  const { error } = await supabase
    .from("posts")
    .update(cleanUpdates)
    .eq("id", postId);

  if (error) {
    console.error("Update post error:", error);
    throw new Error("Échec de la mise à jour");
  }
}

// ======================
// DELETE
// ======================
export async function deletePost(postId) {
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session?.user) {
    throw new Error("Authentification requise");
  }

  // Verify ownership
  const { data: existingPost } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (!existingPost || existingPost.author_id !== session.user.id) {
    throw new Error("Non autorisé");
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId);

  if (error) {
    console.error("Delete post error:", error);
    throw new Error("Échec de la suppression");
  }
}


export default {
  createPost,
  fetchPosts,
  fetchPost,
  updatePost,
  deletePost,
};