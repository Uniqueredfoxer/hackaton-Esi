import supabase from "./supabase";

async function handleVote(tableName, targetId, voteValue, userId) {
  // Check existing vote
  const { data: existingVote, error: voteCheckError } = await supabase
    .from("user_votes")
    .select("*")
    .eq("user_id", userId)
    .eq("target_type", tableName.slice(0, -1)) // 'posts' → 'post', 'comments' → 'comment'
    .eq("target_id", targetId)
    .single();

  if (voteCheckError && voteCheckError.code !== "PGRST116") {
    console.error("Error checking existing vote:", voteCheckError);
    throw new Error("Erreur lors de la vérification du vote");
  }

  let scoreChange = 0;
  let finalVoteType = null;

  // CASE 1: No previous vote → INSERT
  if (!existingVote) {
    const { error } = await supabase.from("user_votes").insert([
      {
        user_id: userId,
        target_type: tableName.slice(0, -1),
        target_id: targetId,
        vote_type: voteValue,
      },
    ]);
    if (error) throw error;
    scoreChange = voteValue;
    finalVoteType = voteValue;
  }

  // CASE 2: Same vote clicked again → DELETE (toggle off)
  else if (existingVote.vote_type === voteValue) {
    const { error } = await supabase
      .from("user_votes")
      .delete()
      .eq("user_id", userId)
      .eq("target_type", tableName.slice(0, -1))
      .eq("target_id", targetId);
    if (error) throw error;
    scoreChange = -voteValue;
    finalVoteType = null;
  }

  // CASE 3: Opposite vote → UPDATE
  else {
    const { error } = await supabase
      .from("user_votes")
      .update({ vote_type: voteValue })
      .eq("user_id", userId)
      .eq("target_type", tableName.slice(0, -1))
      .eq("target_id", targetId);
    if (error) throw error;
    scoreChange = voteValue * 2; // Remove previous vote and add new one
    finalVoteType = voteValue;
  }

  // Update the post/comment score
  const { data: newScore, error: scoreError } = await supabase.rpc(
    "update_item_score",
    {
      item_id: targetId,
      table_name: tableName,
      score_change: scoreChange,
    },
  );

  if (scoreError) throw scoreError;

  return {
    newScore: newScore || 0,
    userVote: finalVoteType,
  };
}

export async function voteOnPost(postId, voteValue) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) throw new Error("Vous devez être connecté pour voter");

  return await handleVote("posts", postId, voteValue, userId);
}

export async function voteOnComment(commentId, voteValue) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) throw new Error("Vous devez être connecté pour voter");

  return await handleVote("comments", commentId, voteValue, userId);
}

export async function getUserVote(targetType, targetId) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) return null;

  const { data: vote } = await supabase
    .from("user_votes")
    .select("vote_type")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .single();

  return vote?.vote_type || null;
}

export async function fetchAllUserVotes(targetType = "post") {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.log("No user session found");
      return {};
    }

    const { data: votes, error } = await supabase
      .from("user_votes")
      .select("target_id, vote_type")
      .eq("user_id", userId)
      .eq("target_type", targetType);

    if (error) {
      console.error("Error fetching user votes:", error);
      return {};
    }

    const votesMap = {};
    votes.forEach((vote) => {
      votesMap[vote.target_id] = vote.vote_type;
    });

    console.log(`Fetched ${votes.length} votes for ${targetType}s`);
    return votesMap;
  } catch (error) {
    console.error("Unexpected error in fetchAllUserVotes:", error);
    return {};
  }
}

export async function getPostUserVote(postId) {
  return await getUserVote("post", postId);
}

export async function getCommentUserVote(commentId) {
  return await getUserVote("comment", commentId);
}

export async function fetchVoteCount(postId){
  const { data: { scores:voteCount }, error} = await supabase
    .from('post')
    .select('scores')
    .eq('id', postId)
    .single();

  if (error) {
    console.error("Error fetching vote count:", error);
    return null;
  }

  return voteCount || null;
}