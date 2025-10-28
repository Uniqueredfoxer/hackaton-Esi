// src/services/voteService.js
// @ts-nocheck
import supabase from "./supabase";

// Vote on a post (+1 or -1)
export async function votePost(postId, voteValue) {
  if (![-1, 1].includes(voteValue)) {
    throw new Error("Vote doit être +1 ou -1");
  }

  const {user:{ session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Connectez-vous pour voter");

  const userId = session.user.id;

  // Check existing vote
  const {  existingVote } = await supabase
    .from("post_votes")
    .select("vote_value")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (existingVote) {
    if (existingVote.vote_value === voteValue) {
      // Already voted → return current score
      const {  post } = await supabase.from("posts").select("scores").eq("id", postId).single();
      return post?.scores || 0;
    } else {
      // Change vote
      await supabase
        .from("post_votes")
        .update({ vote_value: voteValue })
        .eq("post_id", postId)
        .eq("user_id", userId);
      
      const adjustment = voteValue - existingVote.vote_value;
      const {  post } = await supabase.from("posts").select("scores").eq("id", postId).single();
      const newScore = (post?.scores || 0) + adjustment;
      await supabase.from("posts").update({ scores: newScore }).eq("id", postId);
      return newScore;
    }
  } else {
    // New vote
    await supabase.from("post_votes").insert({ post_id: postId, user_id: userId, vote_value: voteValue });
    const {  post } = await supabase.from("posts").select("scores").eq("id", postId).single();
    const newScore = (post?.scores || 0) + voteValue;
    await supabase.from("posts").update({ scores: newScore }).eq("id", postId);
    return newScore;
  }
}

// Get user's current vote on a post (for UI state)
export async function getUserVote(postId) {
  const {  user:{ session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const {  vote } = await supabase
    .from("post_votes")
    .select("vote_value")
    .eq("post_id", postId)
    .eq("user_id", session.user.id)
    .single();

  return vote ? vote.vote_value : null;
}

export default {
  votePost,
  getUserVote
};