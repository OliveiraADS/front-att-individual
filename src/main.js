window.onload = function() {   // Quando toda a pagina for carregada, irá chamar a função abaixo..
    fetch('http://localhost:3000/api/films') // esta responsavel por realizar a requisição da API dentro da URL
        .then((data) => data.json()) // transforma o dado da API em JSON
        .then((response) => { 
            console.log({ response }); // Exibe os filmes no console

            const list = document.getElementById("films-list"); // criar uma variavel de nome LIST - referenciando o ID = films-list da div films-list onde sera criar as fulturas divs com os nomes do filmes listados da API

            response.forEach(film => { // método ForEach (Por cada.. 1 a 1) pega a resposta da API, e percorre de 1 a 1, onde será passado como parametro para a função LIST criada.
                const filmCard = document.createElement("div"); // Criando uma DIV, onde o FilmCard é onde gardamos a informação do HtmlDivElement.
                filmCard.style.backgroundImage = `url(${film.image_url})`; // Coloca a imagem do filme na DIV filmCard como Background.
                console.log(film.image_url); // Verifique a URL da imagem
                filmCard.className = "film-card"; // FilmCard é a DIV, onde colocamos uma classe no CSS .film-card para podermos estilizar esta DIV que sera criado via Back-and
                
                filmCard.onclick = function() { //função que ao clicar na Div filmcard (DIV que contem os banners) irá aparecer a DIV modal, contem a DIV modal-content que contem o card branco, onde irá aparecer informações do filme.
                    const modal = document.getElementById("modal");  //criando const modal que vai pegar o document de ID = MODAL.
                    modal.style.visibility = 'visible'; // Atualiza o atribulo visibility que se encontra ('hidden' para  'visible'), assim aparecendo a DIV modal-content(quadrado branco). 
                    
                    const modalContent = document.getElementById("modal-content");
                    modalContent.innerHTML = ''; // Limpa a DIV modal-content para não haver repetições de informações.


                    const filmTitle = document.createTextNode(film.title); // Cria um (nó de texto) que nada mais é que um pedaço de texto, que pegamos da API, que nesse caso foi o TEXTO do TITULO do filme, de acordo com a API 
                    const filmTitleElement = document.createElement("h1"); // Cria uma elemetro para receber o titulo que esta dentro da Const "FilmTitle"
                    filmTitleElement.appendChild(filmTitle); // coloca o titulo dentro do elemento criado para como H1
                    modalContent.appendChild(filmTitleElement); // coloca o elemetro criado como H1, dentro da DIV "modal-content"
                    

                    const filmSubtitle = document.createTextNode(film.description); // Cria um (nó de texto) que nada mais é que um pedaço de texto, que pegamos da API, que nesse caso foi o TEXTO do Descrição do filme, de acordo com a API   
                    

                };
                list.appendChild(filmCard); // Pega a DIV - Model-Content ( TITULO - TEXT) pronta com o titulo dentro, e adiciona dentro da outra div chamada Film-list com o ID = "Film-list", fazendo com oque cada filme, tenha uma DIV, com seu resptivio titulo dentro. 
            });
        })
        .catch((erro) => {
            console.log({ erro });
            alert('Erro ao carregar os filmes');
        });
};

function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.visibility = 'hidden'; // Atualiza o atribulo visibility que se encontra ('visible' para  'hidden'), assim escondendo a DIV modal-content(quadrado branco).
};