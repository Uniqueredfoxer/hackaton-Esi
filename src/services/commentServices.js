// src/services/commentService.js
// @ts-nocheck
import supabase from "./supabase";

// Create a comment
export async function createComment(postId, content) {
  const { user: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Authentification requise");

  const newComment = {
    post_id: postId,
    author_id: session.user.id,
    content: content.trim(),
  };

  const { data, error } = await supabase
    .from("comments")
    .insert(newComment)
    .select(`
      id,
      content,
      created_at,
      author_id
    `)
    .single();

  if (error) throw new Error("Échec de l'ajout du commentaire");

  // Increment comments_number in posts table
  await supabase.rpc('increment_comments', { post_id: postId });

  return {
    id: data.id,
    content: data.content,
    createdAt: data.created_at,
    author: { id: data.author_id }
  };
}

// Fetch comments for a post
export async function fetchComments(postId) {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      author_id
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return [];

  return data.map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.created_at,
    author: { id: comment.author_id }
  }));
}

// Update a comment (only author)
export async function updateComment(commentId, content) {
  const { user: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Authentification requise");

  const {  comment } = await supabase
    .from("comments")
    .select("author_id")
    .eq("id", commentId)
    .single();
  
  if (!comment || comment.author_id !== session.user.id) throw new Error("Non autorisé");

  const { error } = await supabase
    .from("comments")
    .update({ content: content.trim() })
    .eq("id", commentId);

  if (error) throw new Error("Échec de la mise à jour");
}

// Delete a comment (only author or post author)
export async function deleteComment(commentId) {
  const {  user: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Authentification requise");

  // Get comment + post author
  const {  data } = await supabase
    .from("comments")
    .select("author_id, post:posts(author_id)")
    .eq("id", commentId)
    .single();

  if (!data) throw new Error("Commentaire introuvable");

  const isCommentAuthor = data.author_id === session.user.id;
  const isPostAuthor = data.post.author_id === session.user.id;
  
  if (!isCommentAuthor && !isPostAuthor) throw new Error("Non autorisé");

  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) throw new Error("Échec de la suppression");

  // Decrement comments_number
  await supabase.rpc('decrement_comments', { post_id: data.post.id });
}

export default {
  createComment,
  fetchComments,
  updateComment,
  deleteComment
};