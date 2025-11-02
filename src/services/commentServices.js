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
      replies: comment.replies
        ? comment.replies.map((reply) => ({
            id: reply.id,
            postId: reply.post_id,
            parentComment: reply.parent_comment,
            content: reply.content,
            scores: reply.scores || 0,
            date: reply.posted_at,
            author_id: reply.author_id,
            author: reply.profiles?.username || "Utilisateur",
          }))
        : [],
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

// Fetch comment replies separately
export async function fetchCommentReplies(commentId) {
  const { data: replies, error } = await supabase
    .from("comments")
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
        username,
      )
    `,
    )
    .eq("parent_comment_id", commentId)
    .order("posted_at", { ascending: true });

  if (error) {
    console.error("Fetch replies error:", error);
    throw new Error("Impossible de charger les réponses");
  }

  return replies.map((reply) => ({
    id: reply.id,
    postId: reply.post_id,
    parentComment: reply.parent_comment,
    content: reply.content,
    scores: reply.scores || 0,
    postedAt: reply.posted_at,
    author_id: reply.author_id,
    author: reply.profiles?.username || "Utilisateur",
  }));
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
    parent_comment_id: parentCommentId, // ← FIXED: Use parent_comment_id
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
  if (!parentCommentId) {
    // Only increment for top-level comments
    const { error: updateError } = await supabase
      .from("posts")
      .update({
        comments_number: supabase.raw("comments_number + 1"),
      })
      .eq("id", postId);

    if (updateError) {
      console.error("Failed to update comments count:", updateError);
    }
  }

  // Update user's contribution score for making a comment
  await supabase.rpc("increment_user_contribution", {
    user_id: session.user.id,
    points: 1,
  });

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

// Mark comment as best answer
export async function markAsBestAnswer(commentId, postId) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Authentification requise");

  // Check if user is the post author
  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (post.author_id !== session.user.id) {
    throw new Error("Seul l'auteur de la question peut marquer une réponse");
  }

  // Unmark any existing best answers for this post
  await supabase
    .from("comments")
    .update({ is_best_answer: false })
    .eq("post_id", postId)
    .eq("is_best_answer", true);

  // Mark new best answer
  const { error } = await supabase
    .from("comments")
    .update({ is_best_answer: true })
    .eq("id", commentId);

  if (error) throw new Error("Échec de la mise à jour");

  // Mark post as resolved and reward the answer author
  const { data: comment } = await supabase
    .from("comments")
    .select("author_id")
    .eq("id", commentId)
    .single();

  await supabase.from("posts").update({ is_resolved: true }).eq("id", postId);

  // Reward the user who provided the best answer
  await supabase.rpc("increment_user_contribution", {
    user_id: comment.author_id,
    points: 10, // Significant points for best answer
  });

  return true;
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
  fetchCommentReplies,
  voteOnComment,
  markAsBestAnswer,
  updateComment,
  deleteComment,
};
