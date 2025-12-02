import { FaDiagramSuccessor } from "react-icons/fa6";
import supabase from "./supabase";

// ======================
// CREATE
// ======================
export async function createPost(postData) {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();
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
export async function fetchPosts(options = {}) {
  const {
    search = "",
    tags = [],
    author,
    isResolved,
    limit = 20,
    offset = 0,
    sortBy = "posted_at",
    sortOrder = "desc",
  } = options;

  try {
    // Start building the query
    let query = supabase.from("posts").select(
      `
        id,
        title,
        description,
        profiles!posts_author_id_fkey(username),
        tags,
        scores,
        posted_at,
        image_url

      `,
      { count: "exact" },
    ); // Get total count for pagination

    // Apply filters at database level (much more efficient)
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (tags.length > 0) {
      query = query.overlaps("tags", tags);
    }

    if (author) {
      query = query.eq("profiles.username", author);
    }

    if (isResolved !== undefined) {
      query = query.eq("is_resolved", isResolved);
    }

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    // Execute the query
    const { data: posts, error, count } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    // Transform the data
    const transformedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      tags: post.tags || [],
      score: post.scores || 0,
      date: post.posted_at,
      imageUrl: post.image_url || null,
      author: post.profiles?.username,
    }));

    return {
      posts: transformedPosts,
      totalCount: count || 0,
      hasMore: count ? count > offset + limit : false,
    };
  } catch (error) {
    console.error("Error in fetchPosts:", error);
    return {
      posts: [],
      totalCount: 0,
      hasMore: false,
    };
  }
}

export async function fetchPost(postId) {
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      description,
      profiles!posts_author_id_fkey(username),
      tags,
      scores,
      views,
      comments_number,
      is_resolved,
      posted_at,
      image_url
    `,
    )
    .eq("id", postId)
    .single();

  if (error) {
    console.error("Fetch single post error:", error);
    throw new Error("Publication introuvable");
  }

  return {
    id: post.id,
    title: post.title,
    description: post.description,
    tags: post.tags || [],
    isResolved: post.is_resolved,
    score: post.scores || 0,
    views: post.views || 0,
    commentsNumber: post.comments_number || 0,
    date: post.posted_at,
    imageUrl: post.image_url,
    author: post.profiles?.username,
  };
}

// ======================
// UPDATE
// ======================
export async function updatePost(postId, updates) {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();
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
  Object.keys(cleanUpdates).forEach((key) => {
    if (cleanUpdates[key] === undefined) delete cleanUpdates[key];
  });

  const { data, error } = await supabase
    .from("posts")
    .update(cleanUpdates)
    .eq("id", postId);

  if (error) {
    console.error("Update post error:", error);
    throw new Error("Échec de la mise à jour");
  }
  return data;
}

// ======================
// DELETE
// ======================
export async function deletePost(postId) {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();
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

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    console.error("Delete post error:", error);
    throw new Error("Échec de la suppression");
  }
  return { success: true };
}


export async function markPostAsSolved(postId) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("Vous devez être connecté pour marquer comme résolu");
  }

  const { data: post, error } = await supabase
    .from("posts")
    .update({
      is_solved: true,
    })
    .eq("id", postId)
    .eq("author_id", session.user.id) // Only post author can mark as solved
    .select("*")
    .single();

  if (error) {
    console.error("Error marking post as solved:", error);
    throw new Error("Erreur lors du marquage comme résolu");
  }

  return post;
}

export async function unmarkPostAsSolved(postId) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("Vous devez être connecté pour cette action");
  }

  const { data: post, error } = await supabase
    .from("posts")
    .update({
      is_solved: false,
    })
    .eq("id", postId)
    .eq("author_id", session.user.id) // Only post author can unmark
    .select("*")
    .single();

  if (error) {
    console.error("Error unmarking post as solved:", error);
    throw new Error("Erreur lors du changement de statut");
  }

  return post;
}

export default {
  createPost,
  fetchPosts,
  fetchPost,
  updatePost,
  deletePost,
  markPostAsSolved,
  unmarkPostAsSolved,
};
