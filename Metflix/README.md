# 🎬 Metflix - Plataforma de Streaming de Filmes

Uma aplicação web moderna de streaming de filmes, inspirada em plataformas como Netflix e Star+, desenvolvida com HTML, CSS e JavaScript puro. Consome dados da API do The Movie Database (TMDb) para exibir filmes populares, melhores avaliados, lançamentos e muito mais.

## ✨ Funcionalidades

- 🎯 **Página Inicial**: Grade responsiva com pôsteres de filmes
- 🔍 **Busca em Tempo Real**: Pesquise filmes pelo nome com atualização instantânea
- 📱 **Design Responsivo**: Compatível com desktop, tablet e mobile
- 🎨 **Tema Claro/Escuro**: Alternância entre modos de visualização
- ⭐ **Sistema de Favoritos**: Salve seus filmes favoritos no localStorage
- 🎭 **Modal de Detalhes**: Visualize informações completas dos filmes
- 📊 **Categorias**: 
  - Filmes Populares
  - Melhores Avaliados
  - Lançamentos
  - Favoritos
- 🎬 **Paginação**: Botão "Carregar Mais" para ver mais filmes
- ✨ **Animações Suaves**: Transições e efeitos visuais modernos

## 🚀 Como Usar

### 1. Obter Chave da API do TMDb

1. Acesse [The Movie Database](https://www.themoviedb.org/)
2. Crie uma conta gratuita (se ainda não tiver)
3. Vá em **Configurações** → **API**
4. Solicite uma chave de API (é gratuita)
5. Copie sua chave de API

### 2. Configurar a Aplicação

1. Abra o arquivo `script.js`
2. Localize a linha que contém:
   ```javascript
   const API_KEY = 'SUA_CHAVE_API_AQUI';
   ```
3. Substitua `'SUA_CHAVE_API_AQUI'` pela sua chave da API:
   ```javascript
   const API_KEY = 'sua_chave_aqui_123456789';
   ```

### 3. Executar Localmente

#### Opção 1: Servidor HTTP Simples (Python)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Depois acesse: `http://localhost:8000`

#### Opção 2: Servidor HTTP Simples (Node.js)

```bash
# Instalar o http-server globalmente
npm install -g http-server

# Executar o servidor
http-server -p 8000
```

Depois acesse: `http://localhost:8000`

#### Opção 3: Live Server (VS Code)

1. Instale a extensão "Live Server" no VS Code
2. Clique com o botão direito no arquivo `index.html`
3. Selecione "Open with Live Server"

#### Opção 4: Abrir Diretamente

⚠️ **Nota**: Alguns navegadores podem bloquear requisições CORS ao abrir arquivos diretamente. É recomendado usar um servidor HTTP.

## 📁 Estrutura de Arquivos

```
Metflix/
│
├── index.html      # Estrutura HTML da aplicação
├── style.css       # Estilos e design da aplicação
├── script.js       # Lógica JavaScript e integração com API
└── README.md       # Este arquivo
```

## 🎨 Características do Design

- **Cores**: Paleta escura inspirada em Netflix (modo escuro padrão)
- **Fonte**: Poppins (Google Fonts)
- **Layout**: Grid responsivo que se adapta a diferentes tamanhos de tela
- **Efeitos**: Hover effects, transições suaves e animações
- **Modal**: Design moderno para exibição de detalhes dos filmes

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com variáveis CSS, Grid e Flexbox
- **JavaScript (ES6+)**: Lógica da aplicação, consumo de API, manipulação do DOM
- **TMDb API**: API pública para dados de filmes
- **LocalStorage**: Armazenamento local de favoritos

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 📱 **Mobile**: 320px+
- 📱 **Tablet**: 768px+
- 💻 **Desktop**: 1024px+

## 🎯 Funcionalidades Detalhadas

### Busca de Filmes
- Digite o nome do filme na barra de pesquisa
- A busca é realizada automaticamente após 500ms de inatividade (debounce)
- Os resultados são atualizados em tempo real

### Sistema de Favoritos
- Clique no ícone de coração para adicionar/remover favoritos
- Os favoritos são salvos no localStorage do navegador
- Acesse a seção "Favoritos" para ver todos os filmes salvos

### Modal de Detalhes
- Clique em qualquer filme para ver informações detalhadas
- Exibe: sinopse, data de lançamento, gêneros, duração, avaliação
- Botão para adicionar/remover dos favoritos diretamente do modal

### Tema Claro/Escuro
- Clique no botão de tema no header para alternar
- A preferência é salva no localStorage
- Suporte completo a ambos os modos

## 🐛 Solução de Problemas

### Erro: "Erro ao carregar filmes"
- Verifique se a chave da API está configurada corretamente
- Certifique-se de que está usando um servidor HTTP (não abra o arquivo diretamente)
- Verifique sua conexão com a internet

### Imagens não aparecem
- Alguns filmes podem não ter pôster disponível
- A aplicação usa uma imagem placeholder quando o pôster não está disponível

### CORS Error
- Certifique-se de estar usando um servidor HTTP local
- Não abra o arquivo HTML diretamente no navegador

## 📝 Notas Importantes

- A API do TMDb é gratuita, mas tem limites de requisições
- Os dados são fornecidos pelo TMDb e podem variar
- Os favoritos são armazenados localmente no navegador
- A aplicação funciona offline apenas para visualizar favoritos já carregados

## 🔗 Links Úteis

- [The Movie Database (TMDb)](https://www.themoviedb.org/)
- [Documentação da API do TMDb](https://developers.themoviedb.org/3)
- [Poppins Font (Google Fonts)](https://fonts.google.com/specimen/Poppins)

## 📄 Licença

Este projeto é de código aberto e está disponível para uso pessoal e educacional.

## 👨‍💻 Desenvolvido com

- ❤️ HTML, CSS e JavaScript puro
- 🎨 Design inspirado em Netflix/Star+
- 🚀 API do The Movie Database

---

**Desfrute do Metflix! 🎬🍿**


