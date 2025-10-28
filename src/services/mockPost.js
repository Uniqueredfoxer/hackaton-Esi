// src/services/mockPosts.js
export const mockPosts = [
  {
    id: "post_1",
    title: "Comment résoudre une équation différentielle du second ordre ?",
    description: "J'essaie de résoudre y'' + 3y' + 2y = 0 avec les conditions initiales y(0)=1 et y'(0)=0, mais je bloque sur la partie homogène. Quelqu'un peut m'aider ?",
    author: { id: "user_1", name: "Marie L." },
    tags: ["Mathématiques", "Mathematical Analysis", "L2"],
    score: 12,
    commentsNumber: 5,
    isResolved: true,
    imageUrl: null,
    postedAt: "2025-04-10T14:30:00Z"
  },
  {
    id: "post_2",
    title: "Problème de segmentation fault en C++",
    description: "Mon programme plante avec 'segmentation fault' quand j'essaie d'accéder à un tableau dynamique. Voici le code : [code snippet]. Qu'est-ce que je fais mal ?",
    author: { id: "user_2", name: "Thomas D." },
    tags: ["C++", "Programmation", "L1"],
    score: -2,
    commentsNumber: 8,
    isResolved: false,
    imageUrl: "https://placehold.co/600x400/1a1a1a/6953FF?text=Code+Screenshot",
    postedAt: "2025-04-12T09:15:00Z"
  },
  {
    id: "post_3",
    title: "Différence entre TCP et UDP ?",
    description: "Je prépare mon examen de réseaux et je ne comprends pas quand utiliser TCP vs UDP. Est-ce que quelqu'un peut m'expliquer avec des exemples concrets ?",
    author: { id: "user_3", name: "Amina K." },
    tags: ["Networks", "OS", "L2"],
    score: 24,
    commentsNumber: 12,
    isResolved: true,
    imageUrl: null,
    postedAt: "2025-04-13T16:45:00Z"
  },
  {
    id: "post_4",
    title: "Aide pour un TD sur les automates finis",
    description: "Je dois construire un automate qui reconnaît le langage L = {a^n b^m | n,m ≥ 1}. J'ai essayé plusieurs approches mais rien ne marche. Voici mon brouillon.",
    author: { id: "user_4", name: "Lucas M." },
    tags: ["ADS", "Programmation", "L1"],
    score: 7,
    commentsNumber: 3,
    isResolved: false,
    imageUrl: "https://placehold.co/600x400/1a1a1a/6953FF?text=Automate+Diagram",
    postedAt: "2025-04-14T11:20:00Z"
  },
  {
    id: "post_5",
    title: "Comment configurer un environnement Python pour le machine learning ?",
    description: "Je débute en ML et je suis perdu avec tous les outils : Anaconda, pip, virtualenv, Jupyter... Quelle est la meilleure façon de configurer mon PC (Windows) ?",
    author: { id: "user_5", name: "Chloé R." },
    tags: ["Python", "AI", "ML", "L2"],
    score: 18,
    commentsNumber: 9,
    isResolved: true,
    imageUrl: null,
    postedAt: "2025-04-15T08:50:00Z"
  },
  {
    id: "post_6",
    title: "Exercice de comptabilité : calcul du résultat net",
    description: "Voici les données de mon entreprise : CA = 50k€, charges = 35k€, impôts = 3k€. Quel est le résultat net ? Je trouve 12k€ mais mon prof dit que c'est faux.",
    author: { id: "user_6", name: "Antoine B." },
    tags: ["Accounting", "Economics", "L1"],
    score: 3,
    commentsNumber: 4,
    isResolved: false,
    imageUrl: "https://placehold.co/600x400/1a1a1a/6953FF?text=Financial+Table",
    postedAt: "2025-04-16T13:10:00Z"
  }
];