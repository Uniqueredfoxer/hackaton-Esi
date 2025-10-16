const DocumentDetailPage = () => {
    const docData = {
      id: 1,
      titre: 'Titre du document',
      auteur: 'Auteur du document',
      description: 'React is a JavaScript library for rendering user interfaces (UI). UI is built from small units like buttons, text, and images. React lets you combine them into reusable, nestable components. From web sites to phone apps, everything on the screen can be broken down into components. In this chapter, you’ll learn to create, customize, and conditionally display React components.',
      type: 'Cours',
      module: 'Algorith et SDD',
      isSolved: false,
      fileType: 'PDF',
      language: 'Fr',
      year: 2024,
      level: 'L1',
      size: '3.2 MB',
      downloadCounts: 5023,
      thumbnailLink: 'string',
      fileUrl: 'string',
      tags: ['tag1', 'tag2', 'tag3'],
      similarDocument: ['doc1', 'doc2', 'doc3', 'doc4', 'doc5'],
  }
    return (
        <>

          <div class="thumbnail-container">
              <img class="thumbnail" src="./assets/images/thumbnail.png" alt=""/>
          </div>

          <div class="meta-container">
              <div class="titreEtAuteur">
                  <h2>${docData.titre}</h2>
                  <a class="auteur" href="#">${document.author}</a>
              </div>
              <div class="description">
                  <p>DESCRIPTION:</p>
                  <p>${docData.description}</p>
              </div>
              <div class="metaDonnees">
                  <div class="languageAndFileType">
                      <div class="langue">
                          <p>Langue</p>
                          <p>${docData.language}</p>
                      </div>
                      <div class="fileType">
                          <p>Type</p>
                          <p>${docData.fileType} (${docData.size})</p>
                      </div>
                  </div>
                  <div class="publisherAndYear">
                      <div class="publisher">
                          <p>niveau</p>
                          <p>${docData.level}</p>
                      </div>
                      <div class="year">
                          <p>Annee</p>
                          <p>${docData.year}</p>
                      </div>
                  </div>
              </div>
          </div>
          
            <button class="download">
                <img src="assets/icons/download.svg" alt=""/>
                <p> Telecharger</p>
            </button>
            <button class="read">
                <img src="assets/icons/read.svg" alt=""/>
                <p>Lire</p>
            </button>
            <button class="share">
                <img src="assets/icons/share.svg" alt=""/>
                <p>Partager</p>
              </button>
              <button class="favorite">
                <img src="assets/icons/favorite.png" alt=""/>
                <p>Favoris</p>
            </button>
        
          
            <h1>Resources Similaires</h1>
            <div>
            </div>
        </>
    );
};
export default DocumentDetailPage;