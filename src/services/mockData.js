// Simule les données formatées prêtes à être transmises à <DocumentCard />
// Le format est ajusté pour correspondre à la déstructuration interne de la carte.

export const mockDocuments = [
    {
        // Champs directs
        id: '12a3b4c5-67d8-90e1-f2g3-h4i5j6k7l8m9',
        title: 'Algorithmes et Structures de Données : TP 1 (Listes Chaînées)',
        description: 'Introduction aux listes chaînées simples, doubles et circulaires. Exercices pratiques de manipulation, insertion, et suppression en C.',
        
        // Champs mappés
        author: 'Prof. Dubois', // Mappé depuis document.users.username
        fileType: 'PDF',         // Mappé depuis document.file_type
        level: 'L3',             // Mappé depuis document.level
        year: 2025,
        downloads: 120,
        
        // Nouveaux champs inclus
        tags: ['C', 'Pointeur', 'TP'], 
        category: 'Cours',
        fileSize: 32, // en MB
        
        // (Autres données Supabase si besoin, comme thumbnail_url, etc.)
    },
    {
        id: '98z7y6x5-4w3v-2u1t-0s9r-q8p7o6n5m4l3',
        title: 'Introduction à la Cryptographie Moderne : Sécurité des Systèmes',
        description: 'Synthèse du cours sur les chiffrements symétriques (AES) et asymétriques (RSA). Focus sur les attaques par force brute et la robustesse des clés.',
        
        author: 'Sophie.M',
        fileType: 'PDF',
        level: 'M1',
        year: 2024,
        downloads: 45,
        
        tags: ['Sécurité', 'Chiffrement', 'Rapport'],
        category: 'Cybersécurité',
        fileSize: 8, // en MB
    },
    {
        id: '2l3k4j5i-6h7g-8f9e-0d1c-b2a3z4y5x6w7',
        title: 'Principes des Bases de Données Relationnelles (Modélisation MCD/MLD)',
        description: 'Rapport détaillé sur la normalisation des bases de données (formes normales 1NF, 2NF, 3NF). Inclut des exercices corrigés de passage MCD vers MLD.',
        
        author: 'Alex_DBA',
        fileType: 'DOCX',
        level: 'L2',
        year: 2025,
        downloads: 78,
        
        tags: ['SQL', 'MLD', 'Normalisation'],
        category: 'Bases de Données',
        fileSize: 1, // en MB
    },
];