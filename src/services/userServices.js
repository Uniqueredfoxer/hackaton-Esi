import supabase from "./supabase";

export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  console.log(data);

  if (error) throw error;

  return data;
}

export async function fetchUserDocuments(userId) {
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
      uploaded_at
    `,
    )
    .eq("author_id", userId)
    .order("uploaded_at", { ascending: false });

  console.log(data);

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

export async function fetchUserComments(userId) {
  const { data: comments, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      scores,
      posted_at,
      post_id,
      author_id,
      posts!inner(
        title,
        author_id
      )
    `,
    )
    .eq("author_id", userId)
    .order("posted_at", { ascending: false });

  if (error) {
    console.error("Error fetching user comments:", error);
    throw new Error("Erreur lors du chargement des commentaires");
  }

  return comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    scores: comment.scores || 0,
    posted_at: comment.posted_at,
    post_id: comment.post_id,
    post_title: comment.posts.title,
    author_id: comment.author_id,
  }));
}
