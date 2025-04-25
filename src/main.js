// URL base da API
const API_URL = 'https://starwars-api-5gzh.onrender.com/api/films';

// Estado atual: armazena o ID do filme em edição
let currentFilmId = null;

// Função que executa quando a página é carregada
window.onload = function() {
    // Verificar se o usuário está logado
    verificarLogin();
    
    // Carregar a lista de filmes da API
    loadFilms();
};

// Função para verificar se o usuário está logado
function verificarLogin() {
    // Tentamos pegar os dados do usuário do localStorage
    const usuario = localStorage.getItem('usuario');
    
    // Se não encontrarmos dados do usuário, consideramos que ele não está logado
    if (!usuario) {
        // Redirecionamos para a página de login
        window.location.href = 'login.html';
    } else {
        console.log('Usuário logado:', JSON.parse(usuario));
    }
}

// Função para carregar todos os filmes da API
function loadFilms() {
    fetch(API_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then((films) => {
            displayFilms(films);
        })
        .catch((error) => {
            console.error('Erro ao carregar os filmes:', error);
            alert('Erro ao carregar os filmes. Verifique se a API está funcionando.');
        });
}

// Função para exibir os filmes na página
function displayFilms(films) {
    const listElement = document.getElementById("films-list");
    listElement.innerHTML = ''; // Limpa a lista

    if (films.length === 0) {
        listElement.innerHTML = '<p class="no-films">Nenhum filme cadastrado. Adicione um novo filme!</p>';
        return;
    }

    films.forEach(film => {
        // Criar card do filme
        const filmCard = document.createElement("div");
        filmCard.className = "film-card";
        
        // Configurar imagem de fundo
        if (film.image_url) {
            filmCard.style.backgroundImage = `url(${film.image_url})`;
        } else {
            filmCard.style.backgroundColor = "#333"; // Cor de fundo caso não tenha imagem
        }

        // Adicionar informações do filme
        const filmInfo = document.createElement("div");
        filmInfo.className = "film-info";
        
        const title = document.createElement("h3");
        title.textContent = film.title;
        
        const subtitle = document.createElement("p");
        subtitle.textContent = film.subtitle || "";
        
        filmInfo.appendChild(title);
        filmInfo.appendChild(subtitle);
        filmCard.appendChild(filmInfo);
        
        // Configurar evento de clique
        filmCard.onclick = () => showFilmDetails(film);
        
        // Adicionar card à lista
        listElement.appendChild(filmCard);
    });
}

// Função para mostrar detalhes do filme no modal
function showFilmDetails(film) {
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modal-content");
    
    // Limpar o modal
    modalContent.innerHTML = '';
    
    // Botão de fechar
    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.innerHTML = "×";
    closeButton.onclick = function(event) {
        event.stopPropagation();
        hideModal();
    };
    
    // Título
    const titleElement = document.createElement("h1");
    titleElement.textContent = film.title;
    
    // Subtítulo (se existir)
    let subtitleElement = null;
    if (film.subtitle && film.subtitle !== "Sem subtítulo") {
        subtitleElement = document.createElement("h3");
        subtitleElement.textContent = film.subtitle;
    }
    
    // Descrição
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = film.description;
    
    // Trailer (se existir)
    let trailerElement = null;
    if (film.trailer_url) {
        trailerElement = document.createElement("div");
        trailerElement.className = "trailer";
        
        // Verificar se é um link do YouTube e converter para embed
        let trailerSrc = film.trailer_url;
        if (trailerSrc.includes('youtube.com/watch')) {
            trailerSrc = trailerSrc.replace('watch?v=', 'embed/');
        } else if (trailerSrc.includes('youtu.be')) {
            trailerSrc = trailerSrc.replace('youtu.be/', 'youtube.com/embed/');
        }
        
        // Criar iframe para o trailer
        const iframe = document.createElement("iframe");
        iframe.src = trailerSrc;
        iframe.allowFullscreen = true;
        
        trailerElement.appendChild(iframe);
    }
    
    // Botões de controle (editar e excluir)
    const controlsElement = document.createElement("div");
    controlsElement.className = "film-controls";
    
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.onclick = function(event) {
        event.stopPropagation();
        hideModal();
        showEditModal(film);
    };
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.style.backgroundColor = "#FF3333";
    deleteButton.onclick = function(event) {
        event.stopPropagation();
        if (confirm(`Tem certeza que deseja excluir o filme "${film.title}"?`)) {
            deleteFilm(film._id);
        }
    };
    
    controlsElement.appendChild(editButton);
    controlsElement.appendChild(deleteButton);
    
    // Adicionar elementos ao modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(titleElement);
    if (subtitleElement) modalContent.appendChild(subtitleElement);
    modalContent.appendChild(descriptionElement);
    if (trailerElement) modalContent.appendChild(trailerElement);
    modalContent.appendChild(controlsElement);
    
    // Mostrar o modal
    modal.style.visibility = 'visible';
}

// Função para esconder o modal de detalhes
function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.visibility = 'hidden';
}

// Função para mostrar o modal de adicionar/editar filme
function showAddModal() {
    currentFilmId = null; // Novo filme
    const modal = document.getElementById("edit-modal");
    const formTitle = document.getElementById("form-title");
    const form = document.getElementById("film-form");
    
    formTitle.textContent = "Adicionar Novo Filme";
    form.reset(); // Limpar formulário
    
    modal.style.visibility = 'visible';
    
    // Configurar o formulário para salvar
    form.onsubmit = saveFilm;
}

// Função para mostrar o modal de edição
function showEditModal(film) {
    currentFilmId = film._id; // Filme existente
    const modal = document.getElementById("edit-modal");
    const formTitle = document.getElementById("form-title");
    const form = document.getElementById("film-form");
    
    formTitle.textContent = "Editar Filme";
    
    // Preencher o formulário com os dados do filme
    document.getElementById("title").value = film.title || "";
    document.getElementById("subtitle").value = film.subtitle || "";
    document.getElementById("description").value = film.description || "";
    document.getElementById("image_url").value = film.image_url || "";
    document.getElementById("trailer_url").value = film.trailer_url || "";
    
    modal.style.visibility = 'visible';
    
    // Configurar o formulário para salvar
    form.onsubmit = saveFilm;
}

// Função para esconder o modal de edição
function hideEditModal() {
    const modal = document.getElementById("edit-modal");
    modal.style.visibility = 'hidden';
}

// Função para salvar um filme (adicionar novo ou atualizar existente)
function saveFilm(event) {
    event.preventDefault();
    
    // Coletar dados do formulário
    const formData = {
        title: document.getElementById("title").value,
        subtitle: document.getElementById("subtitle").value || "Sem subtítulo",
        description: document.getElementById("description").value,
        image_url: document.getElementById("image_url").value,
        trailer_url: document.getElementById("trailer_url").value
    };
    
    // Determinar se é uma adição ou atualização
    const url = currentFilmId ? `${API_URL}/${currentFilmId}` : API_URL;
    const method = currentFilmId ? 'PUT' : 'POST';
    
    // Fazer a requisição à API
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        // Verifique se a resposta está no intervalo de sucesso (200-299)
        if (response.ok) {
            return response.text().then(text => {
                // Esconder o modal de edição
                hideEditModal();
                // Recarregar a lista de filmes
                loadFilms();
                // Mostrar mensagem de sucesso
                alert(currentFilmId ? "Filme atualizado com sucesso!" : "Filme adicionado com sucesso!");
                return text; // Retorna o texto para a próxima etapa se necessário
            });
        } else {
            // Se a resposta não estiver no intervalo de sucesso
            return response.text().then(text => {
                throw new Error(text || `Erro na requisição: ${response.status}`);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao salvar filme:', error);
        alert('Erro ao salvar filme. Verifique o console para mais detalhes.');
    });
}

// Função para excluir um filme
function deleteFilm(id) {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        hideModal();
        loadFilms(); // Recarregar a lista de filmes
        alert("Filme excluído com sucesso!");
    })
    .catch(error => {
        console.error('Erro ao excluir filme:', error);
        alert('Erro ao excluir filme. Verifique o console para mais detalhes.');
    });
}

// Função para fazer logout
function logout() {
    // Remover os dados do usuário do localStorage
    localStorage.removeItem('usuario');
    // Redirecionar para a página de login
    window.location.href = 'login.html';
}