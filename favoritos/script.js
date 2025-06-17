// Função para voltar à página anterior
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Se não há histórico, simula uma ação de voltar
        alert('Voltando para a página anterior...');
    }
}

// Função para alternar favorito
function toggleFavorite(button) {
    const card = button.closest('.event-card');
    const isActive = button.classList.contains('active');
    
    if (isActive) {
        // Remove dos favoritos com animação
        button.classList.remove('active');
        card.classList.add('removing');
        
        // Remove o card após a animação
        setTimeout(() => {
            card.remove();
            checkEmptyState();
        }, 300);
        
        // Feedback visual
        showToast('Evento removido dos favoritos');
    } else {
        // Adiciona aos favoritos
        button.classList.add('active');
        showToast('Evento adicionado aos favoritos');
    }
}

// Função para ver detalhes do evento
function viewDetails(eventId) {
    const eventTitles = {
        'rap-funk': 'DO RAP AO FUNK - ALEE E BAILE DO G',
        'mc-lele': 'Show Nacional - MC Lele JP',
        'standup': 'Show de Stand-Up Comedy',
        'palestra': 'Palestra Empreendedorismo - Online'
    };
    
    const eventTitle = eventTitles[eventId] || 'Evento';
    alert(`Abrindo detalhes do evento: ${eventTitle}`);
    
    // Aqui você poderia redirecionar para uma página de detalhes
    // window.location.href = `/evento/${eventId}`;
}

// Função para mostrar toast de feedback
function showToast(message) {
    // Remove toast existente se houver
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Cria novo toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Estilos do toast
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#333',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '25px',
        fontSize: '14px',
        zIndex: '1000',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Mostra o toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 100);
    
    // Remove o toast após 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// Função para verificar se não há mais eventos favoritos
function checkEmptyState() {
    const eventsGrid = document.querySelector('.events-grid');
    const eventCards = eventsGrid.querySelectorAll('.event-card');
    
    if (eventCards.length === 0) {
        eventsGrid.innerHTML = `
            <div class="empty-state">
                <h3>Nenhum evento favorito</h3>
                <p>Você ainda não tem eventos favoritos.<br>Explore nossa plataforma e adicione eventos que você gosta!</p>
            </div>
        `;
    }
}

// Funcionalidade de busca
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const eventCards = document.querySelectorAll('.event-card');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        eventCards.forEach(card => {
            const title = card.querySelector('.event-title').textContent.toLowerCase();
            const date = card.querySelector('.event-date').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || date.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    // Adiciona efeito de foco na busca
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Adiciona efeitos de hover nos cards
document.addEventListener('DOMContentLoaded', function() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Simula carregamento de dados (opcional)
function loadFavoriteEvents() {
    // Aqui você poderia fazer uma requisição para buscar os eventos favoritos do usuário
    // fetch('/api/favorite-events')
    //     .then(response => response.json())
    //     .then(events => {
    //         renderEvents(events);
    //     });
    
    console.log('Eventos favoritos carregados');
}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', function() {
    loadFavoriteEvents();
    console.log('App de eventos favoritos inicializado');
});