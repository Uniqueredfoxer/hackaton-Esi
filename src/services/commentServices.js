// src/services/commentService.js
// @ts-nocheck
import supabase from "./supabase";

// Create a comment
// Comments service optimized for your schema
export const COMMENTS_PAGE_SIZE = 20;

// Fetch comments with pagination and sorting
export async function fetchComments(postId, options = {}) {
  const {
    page = 1,
    sortBy = "posted_at", // 'posted_at', 'scores', 'is_best_answer'
    sortOrder = "desc",
    limit = COMMENTS_PAGE_SIZE,
    includeReplies = false,
  } = options;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("comments")
    .select(
      `
      id,
      author_id,
      content,
      scores,
      posted_at,
      profiles!inner(
        username
      )
    `,
      { count: "exact" },
    )
    .eq("post_id", postId)
    .is("parent_comment_id", null) // Only top-level comments by default
    .range(from, to);

  // Apply sorting
  switch (sortBy) {
    case "scores":
      query = query.order("scores", { ascending: sortOrder === "asc" });
      break;
    case "posted_at":
    default:
      query = query.order("posted_at", { ascending: sortOrder === "asc" });
      break;
  }

  const { data: comments, error, count } = await query;

  console.log("comments fetched:", comments);

  if (error) {
    console.error("Fetch comments error:", error);
    throw new Error("Impossible de charger les commentaires");
  }

  // If requested, fetch replies for each comment
  let commentsWithReplies = comments;
  if (includeReplies && comments.length > 0) {
    const commentIds = comments.map((c) => c.id);
    const { data: replies } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        scores,
        posted_at,
        profiles!inner(
          username
        )
      `,
      )
      .in("parent_comment_id", commentIds)
      .order("posted_at", { ascending: true });

    // Group replies by parent comment
    const repliesByParent = {};
    replies?.forEach((reply) => {
      if (!repliesByParent[reply.parent_comment_id]) {
        repliesByParent[reply.parent_comment_id] = [];
      }
      repliesByParent[reply.parent_comment_id].push(reply);
    });

    // Add replies to comments
    commentsWithReplies = comments.map((comment) => ({
      ...comment,
      replies: repliesByParent[comment.id] || [],
    }));
  }

  return {
    comments: commentsWithReplies.map((comment) => ({
      id: comment.id,
      postId: comment.post_id,
      parentComment: comment.parent_comment_id,
      content: comment.content,
      scores: comment.scores || 0,
      date: comment.posted_at,
      author: comment.profiles?.username || "Utilisateur",
    })),
    pagination: {
      page,
      limit,
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      hasNextPage: from + limit < (count || 0),
      hasPrevPage: page > 1,
    },
  };
}

export async function fetchCommentCount(postId) {
  console.log('🔍 [fetchCommentCount] Called with postId:', postId);
  
  if (!postId) {
    console.error("❌ fetchCommentCount: postId is required");
    throw new Error("ID de post invalide");
  }

  try {
    console.log('📡 [fetchCommentCount] Making Supabase query...');
    
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .is('parent_comment_id', null); // Only count top-level comments (not replies)

    console.log('📡 [fetchCommentCount] Query result:', { count, error });

    if (error) {
      console.error("❌ fetchCommentCount error:", error);
      throw error;
    }

    console.log('✅ [fetchCommentCount] Success! Count:', count);
    return count || 0;
    
  } catch (error) {
    console.error("💥 fetchCommentCount unexpected error:", error);
    throw error;
  }
}
// Fetch comment replies separately
export async function fetchCommentReplies(commentId) {
  // EXTENSIVE DEBUGGING
  console.log('🔍 [fetchCommentReplies] Called with commentId:', commentId);
  console.log('🔍 [fetchCommentReplies] commentId type:', typeof commentId);
  console.log('🔍 [fetchCommentReplies] commentId stringified:', JSON.stringify(commentId));
  
  // Enhanced input validation
  if (!commentId) {
    console.error("❌ Invalid commentId:", commentId);
    throw new Error("ID de commentaire invalide");
  }

  if (typeof commentId === 'object') {
    console.error("❌ commentId is an object, not a string!");
    console.error("❌ Full object:", commentId);
    console.error("❌ Object keys:", Object.keys(commentId));
    // Try to extract ID from object as fallback
    if (commentId.id) {
      console.log("🔄 Attempting to use commentId.id instead:", commentId.id);
      commentId = commentId.id; // Override with the ID
    } else {
      throw new Error("ID de commentaire invalide - objet reçu au lieu d'UUID");
    }
  }

  if (typeof commentId !== 'string') {
    console.error("❌ commentId is not a string:", commentId);
    throw new Error("ID de commentaire invalide - type incorrect");
  }

  try {
    console.log('📡 [fetchCommentReplies] Making Supabase query with commentId:', commentId);
    
    const { data: replies, error } = await supabase
      .from("comments")
      .select(
        `
        id,
        author_id,
        content,
        scores,
        posted_at,
        profiles!inner(username)
      `
      )
      .eq("parent_comment_id", commentId)
      .order("posted_at", { ascending: true });

    console.log('📡 [fetchCommentReplies] Query result:', { replies, error });

    if (error) {
      console.error("❌ Fetch replies error:", error);
      throw new Error("Impossible de charger les réponses");
    }

    // Handle empty results gracefully
    if (!replies || replies.length === 0) {
      console.log('✅ [fetchCommentReplies] No replies found');
      return [];
    }

    console.log('✅ [fetchCommentReplies] Success! Found', replies.length, 'replies');
    
    // Transform data with fallbacks
    return replies.map((reply) => ({
      id: reply.id,
      content: reply.content || "",
      score: reply.scores || 0,
      postedAt: reply.posted_at,
      author_id: reply.author_id,
      author: reply.profiles?.username || "Utilisateur inconnu",
    }));
  } catch (error) {
    console.error("💥 Unexpected error fetching replies:", error);
    throw new Error("Erreur inattendue lors du chargement des réponses");
  }
}


export async function fetchCommentReplyCount(commentId) {
  console.log('🔍 [fetchCommentReplyCount] Starting with commentId:', commentId);
  console.log('🔍 [fetchCommentReplyCount] commentId type:', typeof commentId);
  
  // Input validation
  if (!commentId) {
    console.warn("❌ [fetchCommentReplyCount] commentId is required or falsy:", commentId);
    return 0;
  }

  if (typeof commentId !== 'string') {
    console.warn("❌ [fetchCommentReplyCount] commentId is not a string:", commentId);
    return 0;
  }

  try {
    console.log('📡 [fetchCommentReplyCount] Making Supabase query...');
    
    const { count, error } = await supabase
      .from("comments")
      .select("*", { count: 'exact', head: true })
      .eq("parent_comment_id", commentId);

    console.log('📡 [fetchCommentReplyCount] Query result:', { count, error });

    if (error) {
      console.error("❌ [fetchCommentReplyCount] Supabase error:", error);
      console.error("❌ [fetchCommentReplyCount] Error details:", {
        message: error.message,
        code: error.code,
        details: error.details
      });
      return 0;
    }

    console.log('✅ [fetchCommentReplyCount] Success! Count:', count);
    return count || 0;
    
  } catch (error) {
    console.error("💥 [fetchCommentReplyCount] Unexpected error:", error);
    console.error("💥 [fetchCommentReplyCount] Stack trace:", error.stack);
    return 0;
  }
}


// Create comment (top-level or reply)
export async function createComment(postId, content, parentCommentId = null) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Authentification requise");

  const newComment = {
    post_id: postId,
    author_id: session.user.id,
    content: content.trim(),
    scores: 0,
    parent_comment_id: parentCommentId,
  };

  const { data, error } = await supabase
    .from("comments")
    .insert(newComment)
    .select(
      `
      id,
      post_id,
      parent_comment_id,
      author_id,
      content,
      scores,
      posted_at,
      profiles!inner(
        username
      )
    `,
    )
    .single();

  if (error) throw new Error("Échec de l'ajout du commentaire");

  // ✅ INCREMENT COMMENTS NUMBER IN POSTS TABLE
  try {
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("comments_number, author_id")
      .eq("id", postId)
      .single();

    if (!fetchError && post) {
      const newCount = (post.comments_number || 0) + 1;

      // Update comment count
      await supabase
        .from("posts")
        .update({ comments_number: newCount })
        .eq("id", postId);

      // ✅ UPDATE POST AUTHOR'S CONTRIBUTION POINTS
      if (post.author_id) {
        const { data: authorProfile, error: authorFetchError } = await supabase
          .from("profiles")
          .select("scores")
          .eq("id", post.author_id)
          .single();

        if (!authorFetchError && authorProfile) {
          const newPoints = (authorProfile.contribution_points || 0) + 1;

          await supabase
            .from("profiles")
            .update({ contribution_points: newPoints })
            .eq("id", post.author_id);
        }
      }
    }
  } catch (err) {
    console.log("⚠️ Couldn't update counts:", err);
  }

  return {
    id: data.id,
    postId: data.post_id,
    parentCommentId: data.parent_comment_id, // ← FIXED: Use parentCommentId
    content: data.content,
    scores: data.scores,
    author_id: data.author_id,
    date: data.posted_at,
    author: data.profiles?.username || "Utilisateur",
  };
}

// Vote on a comment (+1 for upvote, -1 for downvote)
export async function voteOnComment(commentId, voteValue) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Authentification requise");

  // Check if user already voted
  const { data: existingVote } = await supabase
    .from("user_votes")
    .select("id, vote_value")
    .eq("comment_id", commentId)
    .eq("user_id", session.user.id)
    .single();

  let scoreChange = voteValue;

  if (existingVote) {
    // If same vote, remove it (toggle)
    if (existingVote.vote_value === voteValue) {
      await supabase.from("comment_votes").delete().eq("id", existingVote.id);
      scoreChange = -voteValue; // Remove the previous vote
    } else {
      // Change vote
      await supabase
        .from("comment_votes")
        .update({ vote_value: voteValue })
        .eq("id", existingVote.id);
      scoreChange = voteValue * 2; // Remove old vote and add new one
    }
  } else {
    // New vote
    await supabase.from("comment_votes").insert({
      comment_id: commentId,
      user_id: session.user.id,
      vote_value: voteValue,
    });
  }

  // Update comment score
  const { data: updatedComment } = await supabase
    .from("comments")
    .update({ scores: supabase.raw(`scores + ${scoreChange}`) })
    .eq("id", commentId)
    .select("scores, author_id")
    .single();

  // Update author's contribution score based on vote
  if (scoreChange > 0) {
    await supabase.rpc("increment_user_contribution", {
      user_id: updatedComment.author_id,
      points: 1, // Points for receiving upvote
    });
  }

  return updatedComment.scores;
}

// Update a comment (only author)
export async function updateComment(commentId, content) {
  const {
    user: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Authentification requise");

  const { comment } = await supabase
    .from("comments")
    .select("author_id")
    .eq("id", commentId)
    .single();

  if (!comment || comment.author_id !== session.user.id)
    throw new Error("Non autorisé");

  const { error } = await supabase
    .from("comments")
    .update({ content: content.trim() })
    .eq("id", commentId);

  if (error) throw new Error("Échec de la mise à jour");
}

// Delete a comment (only author or post author)
export async function deleteComment(commentId) {
  const {
    user: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Authentification requise");

  // Get comment + post author
  const { data } = await supabase
    .from("comments")
    .select("author_id, post:posts(author_id)")
    .eq("id", commentId)
    .single();

  if (!data) throw new Error("Commentaire introuvable");

  const isCommentAuthor = data.author_id === session.user.id;
  const isPostAuthor = data.post.author_id === session.user.id;

  if (!isCommentAuthor && !isPostAuthor) throw new Error("Non autorisé");

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);
  if (error) throw new Error("Échec de la suppression");

  // Decrement comments_number
  await supabase.rpc("decrement_comments", { post_id: data.post.id });
}

export default {
  createComment,
  fetchComments,
  fetchCommentCount,
  fetchCommentReplies,
  voteOnComment,
  updateComment,
  deleteComment,
};
