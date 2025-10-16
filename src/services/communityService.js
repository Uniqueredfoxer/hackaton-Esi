// Mock community service. Replace with Supabase later.
const posts = Array.from({ length: 8 }).map((_, i) => ({
  id: `post_${i}`,
  title: `Question d'exemple ${i + 1}`,
  content: `Contenu de la question d'exemple ${i + 1}. Donne suffisamment de contexte pour une réponse.`,
  author: `Utilisateur${i % 4}`,
  comments: Math.floor(Math.random() * 12),
  score: Math.floor(Math.random() * 50) - 10,
  course: i % 2 === 0 ? 'Programmation' : 'Mathématiques',
}));

export async function fetchPosts() {
  await new Promise((r) => setTimeout(r, 300));
  return posts;
}

export async function votePost(postId, vote) {
  // vote: -1|0|1
  // TODO: persist vote via Supabase
  await new Promise((r) => setTimeout(r, 150));
  const p = posts.find((x) => x.id === postId);
  if (!p) throw new Error('Post not found');
  p.score += vote;
  return p.score;
}

export default { fetchPosts, votePost };
