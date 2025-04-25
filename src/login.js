// URL base da API (endereço do nosso servidor backend)
const API_URL = 'http://localhost:3000/api/users';

// Quando o documento HTML estiver completamente carregado, vamos executar a função abaixo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de login carregada!');
    
    // Encontramos o formulário de login pelo ID
    const loginForm = document.getElementById('login-form');
    
    // Encontramos a div que vai mostrar mensagens de erro
    const errorMessage = document.getElementById('error-message');
    
    // Adicionamos um "ouvinte" para o evento de envio do formulário
    loginForm.addEventListener('submit', function(event) {
        // Impedimos que o formulário seja enviado de forma tradicional
        // (que recarregaria a página)
        event.preventDefault();
        
        console.log('Formulário enviado!');
        
        // Pegamos os valores dos campos de email e senha
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        console.log('Tentando login com:', email);
        
        // Escondemos qualquer mensagem de erro anterior
        errorMessage.style.display = 'none';
        
        // Chamamos a função que tentará fazer o login
        fazerLogin(email, senha);
    });
});

// Função para tentar fazer login com o email e senha fornecidos
function fazerLogin(email, senha) {
    console.log('Iniciando processo de login...');
    
    // Preparamos os dados para enviar ao servidor
    const dados = {
        email: email,
        senha: senha
    };
    
    console.log('Dados a serem enviados:', dados);
    
    // Fazemos uma requisição POST para a API
    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        console.log('Resposta recebida:', response.status);
        
        // Verificamos se a resposta foi bem-sucedida
        if (!response.ok) {
            // Se não foi bem-sucedida, lançamos um erro
            return response.text().then(text => {
                throw new Error(text || 'Email ou senha incorretos');
            });
        }
        return response.json();
    })
    .then(data => {
        // Se chegamos aqui, o login foi bem-sucedido
        console.log('Login bem-sucedido:', data);
        
        // Guardamos os dados do usuário no localStorage
        // (para poder usar em outras páginas)
        localStorage.setItem('usuario', JSON.stringify(data.user));
        
        // Mostramos uma mensagem de sucesso
        alert('Login realizado com sucesso!');
        
        // Redirecionamos para a página de listagem de filmes
        window.location.href = 'index.html';
    })
    .catch(error => {
        // Se ocorreu algum erro, mostramos a mensagem
        console.error('Erro no login:', error);
        
        // Encontramos a div de mensagem de erro
        const errorMessage = document.getElementById('error-message');
        
        // Colocamos a mensagem de erro e mostramos a div
        errorMessage.textContent = error.message || 'Erro ao fazer login. Tente novamente.';
        errorMessage.style.display = 'block';
    });
}

// Função para verificar se o usuário já está logado
function verificarLogin() {
    // Tentamos pegar os dados do usuário do localStorage
    const usuario = localStorage.getItem('usuario');
    
    // Se encontramos dados do usuário, consideramos que ele está logado
    if (usuario) {
        console.log('Usuário já está logado:', JSON.parse(usuario));
        // Redirecionamos para a página de listagem de filmes
        window.location.href = 'index.html';
    }
}

// Verificamos se o usuário já está logado assim que a página carregar
verificarLogin();