// ===== CONFIGURAÇÃO DA API =====
// IMPORTANTE: Substitua 'SUA_CHAVE_API_AQUI' pela sua chave da API do TMDb
// Obtenha sua chave gratuita em: https://www.themoviedb.org/settings/api
const API_KEY = 'YOU_API_KEY';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const IMG_BASE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';

// ===== ESTADO DA APLICAÇÃO =====
let currentPage = 1;
let currentCategory = 'popular';
let currentSearchQuery = '';
let isLoading = false;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// ===== ELEMENTOS DO DOM =====
const moviesGrid = document.getElementById('moviesGrid');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sectionTitle = document.getElementById('sectionTitle');
const navButtons = document.querySelectorAll('.nav-btn');
const movieModal = document.getElementById('movieModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const themeToggle = document.getElementById('themeToggle');
const heroSection = document.getElementById('heroSection');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadMovies('popular');
    setupEventListeners();
});

// ===== CONFIGURAÇÃO DE EVENTOS =====
function setupEventListeners() {
    // Navegação por categorias
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            switchCategory(category);
        });
    });

    // Pesquisa
    searchInput.addEventListener('input', debounce(handleSearch, 500));
    searchBtn.addEventListener('click', () => {
        handleSearch();
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Modal
    modalClose.addEventListener('click', closeModal);
    movieModal.addEventListener('click', (e) => {
        if (e.target === movieModal) {
            closeModal();
        }
    });

    // Botão carregar mais
    loadMoreBtn.addEventListener('click', loadMoreMovies);

    // Tema
    themeToggle.addEventListener('click', toggleTheme);

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && movieModal.classList.contains('show')) {
            closeModal();
        }
    });
}

// ===== FUNÇÕES DA API =====
async function fetchMovies(category = 'popular', page = 1, query = '') {
    try {
        let url;
        
        if (query) {
            // Busca por query
            url = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=pt-BR`;
        } else {
            // Busca por categoria
            const endpoints = {
                popular: '/movie/popular',
                top_rated: '/movie/top_rated',
                upcoming: '/movie/upcoming'
            };
            url = `${API_BASE_URL}${endpoints[category]}?api_key=${API_KEY}&page=${page}&language=pt-BR`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        throw error;
    }
}

async function fetchMovieDetails(movieId) {
    try {
        const url = `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
        throw error;
    }
}

// ===== CARREGAMENTO DE FILMES =====
async function loadMovies(category = 'popular', reset = true) {
    if (isLoading) return;
    
    isLoading = true;
    currentCategory = category;
    
    if (reset) {
        currentPage = 1;
        moviesGrid.innerHTML = '';
        hideError();
    }

    showLoading();
    hideLoadMoreBtn();

    try {
        let movies;
        
        if (category === 'favorites') {
            movies = await loadFavorites();
        } else if (currentSearchQuery) {
            // Se há uma query de busca, usar busca mesmo que category seja diferente
            const data = await fetchMovies('popular', currentPage, currentSearchQuery);
            movies = data.results;
        } else {
            const data = await fetchMovies(category, currentPage, currentSearchQuery);
            movies = data.results;
        }

        if (movies && movies.length > 0) {
            displayMovies(movies);
            if (currentSearchQuery) {
                updateSectionTitle('search', currentSearchQuery);
            } else {
                updateSectionTitle(category);
            }
            hideLoading();
            
            if (category !== 'favorites' && !currentSearchQuery) {
                showLoadMoreBtn();
            }
        } else {
            showError('Nenhum filme encontrado.');
            hideLoading();
        }
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        showError('Erro ao carregar filmes. Verifique sua conexão e a chave da API.');
        hideLoading();
    } finally {
        isLoading = false;
    }
}

async function loadMoreMovies() {
    if (isLoading) return;
    
    currentPage++;
    await loadMovies(currentCategory, false);
}

// ===== EXIBIÇÃO DE FILMES =====
function displayMovies(movies) {
    movies.forEach(movie => {
        if (movie.poster_path) {
            const movieCard = createMovieCard(movie);
            moviesGrid.appendChild(movieCard);
        }
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.movieId = movie.id;

    const isFavorite = favorites.includes(movie.id);
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    card.innerHTML = `
        <img 
            src="${IMG_BASE_URL}${movie.poster_path}" 
            alt="${movie.title}"
            class="movie-poster"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/300x450?text=Sem+Imagem'"
        >
        <div class="movie-actions">
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                    data-movie-id="${movie.id}"
                    title="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-rating">
                <span class="rating-star">⭐</span>
                <span>${rating}</span>
            </div>
        </div>
    `;

    // Event listeners
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-btn')) {
            openMovieModal(movie.id);
        }
    });

    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(movie.id, favoriteBtn);
    });

    return card;
}

// ===== MODAL DE DETALHES =====
async function openMovieModal(movieId) {
    showLoading();
    movieModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    try {
        const movie = await fetchMovieDetails(movieId);
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        modalBody.innerHTML = '<p>Erro ao carregar detalhes do filme.</p>';
    } finally {
        hideLoading();
    }
}

function displayMovieDetails(movie) {
    const isFavorite = favorites.includes(movie.id);
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString('pt-BR') : 'N/A';
    const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : 'N/A';
    const genreTags = movie.genres ? movie.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('') : '';

    modalBody.innerHTML = `
        <div class="movie-detail">
            <img 
                src="${IMG_BASE_URL_ORIGINAL}${movie.poster_path || movie.backdrop_path}" 
                alt="${movie.title}"
                class="movie-detail-poster"
                onerror="this.src='https://via.placeholder.com/300x450?text=Sem+Imagem'"
            >
            <div class="movie-detail-info">
                <h2>${movie.title}</h2>
                <div class="movie-detail-meta">
                    <div class="movie-detail-rating">
                        <span class="rating-star">⭐</span>
                        <span>${rating}</span>
                    </div>
                    <span>•</span>
                    <span>${releaseDate}</span>
                    <span>•</span>
                    <span>${movie.runtime ? movie.runtime + ' min' : 'N/A'}</span>
                </div>
                <div class="movie-detail-genres">
                    ${genreTags}
                </div>
                <p class="movie-detail-overview">${movie.overview || 'Sinopse não disponível.'}</p>
                <div class="movie-detail-actions">
                    <button class="detail-favorite-btn ${isFavorite ? 'active' : ''}" 
                            data-movie-id="${movie.id}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        ${isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                    </button>
                </div>
            </div>
        </div>
    `;

    // Event listener para o botão de favorito no modal
    const favoriteBtn = modalBody.querySelector('.detail-favorite-btn');
    favoriteBtn.addEventListener('click', () => {
        toggleFavorite(movie.id, favoriteBtn);
    });
}

function closeModal() {
    movieModal.classList.remove('show');
    document.body.style.overflow = '';
    modalBody.innerHTML = '';
}

// ===== FAVORITOS =====
function toggleFavorite(movieId, buttonElement) {
    const index = favorites.indexOf(movieId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        buttonElement.classList.remove('active');
        if (buttonElement.querySelector('svg')) {
            buttonElement.querySelector('svg').setAttribute('fill', 'none');
        }
    } else {
        favorites.push(movieId);
        buttonElement.classList.add('active');
        if (buttonElement.querySelector('svg')) {
            buttonElement.querySelector('svg').setAttribute('fill', 'currentColor');
        }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Atualizar todos os botões de favorito do mesmo filme
    document.querySelectorAll(`[data-movie-id="${movieId}"]`).forEach(btn => {
        if (index > -1) {
            btn.classList.remove('active');
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', 'none');
        } else {
            btn.classList.add('active');
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', 'currentColor');
        }
    });

    // Se estiver na página de favoritos, recarregar
    if (currentCategory === 'favorites') {
        loadMovies('favorites', true);
    }
}

async function loadFavorites() {
    if (favorites.length === 0) {
        return [];
    }

    try {
        const movies = await Promise.all(
            favorites.map(id => fetchMovieDetails(id))
        );
        return movies;
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        return [];
    }
}

// ===== PESQUISA =====
function handleSearch() {
    const query = searchInput.value.trim();
    currentSearchQuery = query;
    
    if (query) {
        currentCategory = 'search';
        currentPage = 1;
        moviesGrid.innerHTML = '';
        loadMovies('search', true);
        updateSectionTitle('search', query);
        updateActiveNavButton(null);
    } else {
        currentSearchQuery = '';
        switchCategory('popular');
    }
}

// ===== NAVEGAÇÃO =====
function switchCategory(category) {
    currentCategory = category;
    currentSearchQuery = '';
    searchInput.value = '';
    currentPage = 1;
    moviesGrid.innerHTML = '';
    updateActiveNavButton(category);
    loadMovies(category, true);
}

function updateActiveNavButton(category) {
    navButtons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateSectionTitle(category, query = '') {
    const titles = {
        popular: 'Filmes Populares',
        top_rated: 'Melhores Avaliados',
        upcoming: 'Lançamentos',
        favorites: 'Meus Favoritos',
        search: `Resultados para: "${query}"`
    };
    
    sectionTitle.textContent = titles[category] || 'Filmes';
}

// ===== TEMA =====
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('svg');
    if (theme === 'light') {
        // Ícone de lua para modo escuro
        icon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        `;
    } else {
        // Ícone de sol para modo claro
        icon.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    }
}

// ===== UTILITÁRIOS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading() {
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    loading.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showLoadMoreBtn() {
    loadMoreBtn.style.display = 'block';
}

function hideLoadMoreBtn() {
    loadMoreBtn.style.display = 'none';
}

// ===== VERIFICAÇÃO DA API KEY =====
if (API_KEY === 'SUA_CHAVE_API_AQUI') {
    console.warn('⚠️ ATENÇÃO: Configure sua chave da API do TMDb no arquivo script.js');
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            alert('⚠️ Configure sua chave da API do TMDb no arquivo script.js\n\nObtenha sua chave gratuita em: https://www.themoviedb.org/settings/api');
        }, 1000);
    });
}

