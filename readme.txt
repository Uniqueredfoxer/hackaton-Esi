-

# 📚 AKA – Plateforme Académique Collaborative

AKA est une plateforme web moderne permettant aux étudiants de partager des ressources académiques, poser des questions et collaborer au sein d'une communauté sécurisée. Construite avec React, Supabase et Tailwind CSS, elle offre une expérience utilisateur fluide, responsive et sécurisée.



Installation et Configuration 

Prérequis :    Node.js 18+

Étapes 

 Cloner le dépôt  avec : Github: https://github.com/Uniqueredfoxer/hackaton-Esi.git
 
Installer les dépendances  avec: npm install
 
Vous trouverez les variables d'environnement dans le .env qui se trouverera dans le fichier zip.

Pour Lancer l'application, tapez dans la racine du projet :  npm run dev
     
     
     

 
  🌟 Fonctionnalités Principales

  🔐 Authentification Sécurisée
- Inscription avec confirmation par email
- Génération automatique de pseudos uniques
- Profil utilisateur

  📄 Gestion des Documents
- Téléversement de fichiers (PDF, DOCX, images – max 10 Mo)
- Métadonnées riches : titre, description, catégorie, niveau, tags, année
- Aperçu en ligne et téléchargement sécurisé
- Affichage dans une galerie filtrable

  💬 Communauté Interactive
- Poser des questions avec pièce jointe
- Système de voting (upvote/downvote) pour les publications
- Marquer les questions comme résolues
- Fil de commentaires en temps réel

  🔍 Recherche et Filtrage Avancé
- Recherche par titre, description, tags, auteur
- Filtres par : **année**, **niveau d'études**, **type de fichier**, **tags**
- Chargement infini ("Charger plus") au lieu de la pagination

 📱 Design Responsive
- Interface optimisée pour mobile, tablette et desktop
- Thème sombre moderne avec accents violets
- Composants accessibles et intuitifs

---

 🛠️ Stack Technique

Frontend: React + Tailwind CSS
Backend: Supabase (Authentification, Base de donnees, Stockage)
Hébergement: Vite (developpement), Vercel (production)
Base de données: PostgreSQL
Stockage: Supabase Storage (documents, images)




	Tests à Effectuer

1. Inscription : 
   - Génération de pseudo aléatoire
   - Confirmation par email
2. Téléversement : 
   - Fichier + métadonnées
   - Apparition dans la galerie
3. Communauté : 
   - Poser une question
   - Voter et commenter
   - Marquer comme résolue
4. Filtres : 
   - Recherche par tag/année/niveau
   - Chargement infini

---

🙏 Remerciements

-Supabase pour la plateforme backend tout-en-un
-Tailwind CSS** pour le design responsive
-Lucide React** pour les icônes élégantes
-La communauté open-source pour son inspiration



 Partagez, Apprenez, Grandissez ensemble** 🎓✨

