const sample = Array.from({ length: 18 }).map((_, i) => {
  const types = ["Cours", "TD", "Devoir", "Livre", "Vidéo"];
  const type = types[i % types.length];
  return {
    id: `res_${i}`,
    title: `${type} Exemple ${i + 1}`,
    author: `Étudiant${i % 5}`,
    description: `Une courte description pour ${type} Exemple ${i + 1}. Contient le sujet et l'année.`,
    type,
    format: "PDF",
    level: i % 3 === 0 ? "L1" : i % 3 === 1 ? "L2" : "L3",
    year: 2018 + (i % 6),
    size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
    downloads: Math.floor(Math.random() * 200),
  };
});

export async function fetchResources({ page = 1, pageSize = 6, tag = 'Tout', q = '' } = {}) {
  
  await new Promise((r) => setTimeout(r, 350));

  let list = sample.slice();
  if (tag && tag !== 'All') list = list.filter((r) => r.type === tag);
  if (q) {
    const qq = q.toLowerCase();
    list = list.filter((r) => r.title.toLowerCase().includes(qq) || r.description.toLowerCase().includes(qq));
  }

  const start = (page - 1) * pageSize;
  return list.slice(start, start + pageSize);
}

export default { fetchResources };
