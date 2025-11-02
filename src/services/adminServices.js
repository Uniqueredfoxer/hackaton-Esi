// src/services/adminService.js
import supabase from "./supabase";

// Check if user is admin
export async function isUserAdmin() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  return profile?.role === "admin";
}

// Get dashboard statistics
export async function getDashboardStats() {
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id", { count: "exact" });

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id", { count: "exact" });

  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select("id", { count: "exact" });

  const { data: documents, error: docsError } = await supabase
    .from("documents")
    .select("id", { count: "exact" });

  // Get recent activity (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", oneWeekAgo.toISOString());

  if (usersError || postsError || commentsError || docsError) {
    throw new Error("Erreur lors du chargement des statistiques");
  }

  return {
    totalUsers: users?.length || 0,
    totalPosts: posts?.length || 0,
    totalComments: comments?.length || 0,
    totalDocuments: documents?.length || 0,
    newUsersThisWeek: recentUsers?.length || 0,
  };
}

// Get reported content
export async function getReportedContent() {
  const { data: reports, error } = await supabase
    .from("reports") // You'll need to create this table
    .select(
      `
      id,
      reason,
      created_at,
      status,
      reporter:profiles!reports_reporter_id_fkey(username),
      reported_post:posts(id, title, author_id),
      reported_comment:comments(id, content, author_id),
      reported_user:profiles!reports_reported_user_id_fkey(username)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error("Erreur lors du chargement des signalements");
  return reports || [];
}

// Get all users with pagination
export async function getUsers(page = 1, limit = 20) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {
    data: users,
    error,
    count,
  } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Erreur lors du chargement des utilisateurs");

  return {
    users: users || [],
    totalCount: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

// Update user role or ban status
export async function updateUser(userId, updates) {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) throw new Error("Erreur lors de la mise à jour");
}

// Delete content (post, comment, or document)
export async function deleteContent(type, id) {
  let tableName;
  switch (type) {
    case "post":
      tableName = "posts";
      break;
    case "comment":
      tableName = "comments";
      break;
    case "document":
      tableName = "documents";
      break;
    default:
      throw new Error("Type de contenu invalide");
  }

  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) throw new Error("Erreur lors de la suppression");
}

// Get recent activity
export async function getRecentActivity(limit = 20) {
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      posted_at,
      author:profiles!posts_author_id_fkey(username)
    `,
    )
    .order("posted_at", { ascending: false })
    .limit(limit);

  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      posted_at,
      author:profiles!comments_author_id_fkey(username),
      post:posts!comments_post_id_fkey(title)
    `,
    )
    .order("posted_at", { ascending: false })
    .limit(limit);

  if (postsError || commentsError) {
    throw new Error("Erreur lors du chargement des activités");
  }

  const activities = [
    ...(posts?.map((post) => ({
      type: "post",
      id: post.id,
      content: post.title,
      date: post.posted_at,
      author: post.author?.username,
      description: "Nouvelle question publiée",
    })) || []),
    ...(comments?.map((comment) => ({
      type: "comment",
      id: comment.id,
      content: comment.content,
      date: comment.posted_at,
      author: comment.author?.username,
      description: "Nouveau commentaire",
      postTitle: comment.posts?.title,
    })) || []),
  ];

  return activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}
