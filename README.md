# Star Wars Wiki - Frontend

Um aplicativo PWA (Progressive Web Application) para visualizar e gerenciar uma coleção de filmes Star Wars. Este projeto foi desenvolvido como parte de um trabalho acadêmico.

## Demo Online

Você pode acessar a versão online do projeto em:
[https://starwarswikiattgeraldo.netlify.app/login.html](https://starwarswikiattgeraldo.netlify.app/login.html)

## Funcionalidades

- Login de usuários
- Listagem de filmes
- Detalhes de cada filme com trailer
- Adição, edição e remoção de filmes
- Interface responsiva
- Funciona offline (PWA)

## Estrutura do Projeto

```
starwars-wiki/
├── img/
│   ├── LogoEmpire.png
│   └── icons/
│       ├── icon-192x192.png
│       ├── icon-256x256.png
│       └── icon-512x512.png
├── src/
│   ├── login.js        (Lógica da página de login)
│   └── main.js         (Lógica da listagem de filmes)
├── style/
│   ├── login.css       (Estilos da página de login)
│   └── main.css        (Estilos da página principal)
├── index.html          (Página principal - Listagem de filmes)
├── login.html          (Página de login)
├── manifest.webmanifest (Configuração do PWA)
└── service-worker.js   (Cache para funcionamento offline)
```

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- PWA (Progressive Web App)
- Fetch API para comunicação com o backend

## Como executar localmente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/starwars-wiki.git
cd starwars-wiki
```

2. Abra o arquivo `login.html` em um navegador web ou use um servidor local:
```bash
# Se você tem Python instalado:
python -m http.server 8000

# Se você tem Node.js instalado:
npx serve
```

3. Acesse o aplicativo em `http://localhost:8000` ou `http://localhost:5000` (no caso do serve)

## Configuração do Backend

Por padrão, o frontend está configurado para se conectar ao backend hospedado em:
```
https://starwars-api-5gzh.onrender.com
```

Se você deseja conectar a um backend local, altere as URLs nos arquivos:
- `src/login.js` 
- `src/main.js`

Substitua:
```javascript
const API_URL = 'https://starwars-api-5gzh.onrender.com/api/films';
```
Por:
```javascript
const API_URL = 'http://localhost:3000/api/films';
```

E também:
```javascript
const API_URL = 'https://starwars-api-5gzh.onrender.com/api/users';
```
Por:
```javascript
const API_URL = 'http://localhost:3000/api/users';
```

## Testando o aplicativo

Para testar o aplicativo, você pode criar uma conta ou usar as credenciais de teste:

```
Email: teste@email.com
Senha: senha123
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Autor

Seu Nome - [GitHub](https://github.com/seu-usuario)

## Licença
