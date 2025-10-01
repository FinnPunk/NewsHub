// News Card Renderer для NewsHub
// Компонент для рендеринга карточек новостей в стиле LinkedIn

class NewsCardRenderer {
    constructor() {
        this.savedItems = new Set(this.loadSavedItems());
        this.readItems = new Set(this.loadReadItems());
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Делегирование событий для карточек
        document.addEventListener('click', (e) => {
            if (e.target.closest('.save-btn')) {
                e.preventDefault();
                const articleId = e.target.closest('.news-card').dataset.articleId;
                this.toggleSave(articleId);
            }
            
            if (e.target.closest('.share-btn')) {
                e.preventDefault();
                const articleId = e.target.closest('.news-card').dataset.articleId;
                this.shareArticle(articleId);
            }
            
            // Клик по содержимому карточки - открываем модальное окно
            if (e.target.closest('.news-card-clickable') || e.target.closest('.news-title')) {
                e.preventDefault();
                const card = e.target.closest('.news-card');
                const articleId = card ? card.dataset.articleId : null;
                if (articleId) {
                    this.openArticleModal(articleId);
                }
            }
        });
        
        // Обработка клавиатурной навигации
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('news-card-clickable') && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                const card = e.target.closest('.news-card');
                const articleId = card ? card.dataset.articleId : null;
                if (articleId) {
                    this.openArticleModal(articleId);
                }
            }
        });
    }
    
    // Рендеринг одной карточки новости
    renderCard(article) {
        const isRead = this.readItems.has(article.id);
        const isSaved = this.savedItems.has(article.id);
        const timeAgo = this.formatTimeAgo(article.publishedAt);
        
        return `
            <article class="news-card ${isRead ? 'read' : ''}" data-article-id="${article.id}">
                <div class="news-card-header">
                    <div class="source-info">
                        <div class="source-avatar">
                            <span class="source-icon">${this.getSourceIcon(article.source.category)}</span>
                        </div>
                        <div class="source-details">
                            <span class="source-name">${article.source.name}</span>
                            <span class="publish-time">${timeAgo}</span>
                        </div>
                    </div>
                    <div class="article-actions">
                        <button class="action-btn like-btn" title="Лайк" data-article-id="${article.id}" data-likes="${article.likes || 0}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <span class="like-count">${article.likes || 0}</span>
                        </button>
                        <button class="action-btn save-btn ${isSaved ? 'saved' : ''}" 
                                title="${isSaved ? 'Убрать из избранного' : 'Добавить в избранное'}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                            </svg>
                        </button>
                        <button class="action-btn share-btn" title="Поделиться">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                            </svg>
                        </button>
                        <button class="action-btn read-more-btn" title="Читать полностью" data-article-id="${article.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="news-card-content" data-article-url="${article.link}">
                    <div class="news-card-clickable" role="button" tabindex="0">
                        <h3 class="news-title">${this.escapeHtml(article.title)}</h3>
                        ${article.description ? `
                            <p class="news-description">${this.escapeHtml(this.truncateText(article.description, 150))}</p>
                        ` : ''}
                    </div>
                </div>
                
                <div class="news-card-footer">
                    <div class="article-meta">
                        <span class="category-tag ${article.category}">${this.getCategoryName(article.category)}</span>
                        <span class="reading-time">${article.readingTime} мин чтения</span>
                        ${article.aiSummary ? '<span class="ai-badge">AI</span>' : ''}
                        ${article.isFallback ? '<span class="demo-badge">DEMO</span>' : ''}
                    </div>
                    <div class="engagement-stats">
                        <span class="stat-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            <span class="stat-count">${this.generateViewCount()}</span>
                        </span>
                    </div>
                </div>
                
                ${!isRead ? '<div class="unread-indicator"></div>' : ''}
            </article>
        `;
    }
    
    // Рендеринг списка карточек
    renderCards(articles, container) {
        if (!container) {
            return;
        }
        
        if (!articles || articles.length === 0) {
            container.innerHTML = this.renderEmptyState();
        }
        
        const cardsHTML = articles.map(article => this.renderCard(article)).join('');
        container.innerHTML = cardsHTML;
        
        // Добавляем обработчики событий
        articles.forEach((article, index) => {
            const card = container.children[index];
            this.attachEventListeners(card, article);
        });
        
        return card;
    }
        
    // Добавление новых карточек (для infinite scroll)
    appendCards(articles, container) {
        if (!articles || articles.length === 0) return;
        
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');
// Создаем временный контейнер для рендеринга
        
        articles.forEach(article => {
            tempDiv.innerHTML = this.renderCard(article);
            const cardElement = tempDiv.firstElementChild;
            fragment.appendChild(cardElement);
        });
        
        container.appendChild(fragment);
        
        // Анимируем новые карточки
        const newCards = container.querySelectorAll('.news-card:not(.animated)');
        this.animateNewCards(newCards);
    }
    
    // Рендеринг пустого состояния
    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon">📰</div>
                <h3>Новостей пока нет</h3>
                <p>Попробуйте изменить фильтры или обновить страницу</p>
                <button class="btn btn--primary" onclick="location.reload()">
                    Обновить
                </button>
            </div>
        `;
    }
    
    // Рендеринг skeleton loading
    renderSkeleton(count = 5) {
        const skeletons = Array(count).fill(null).map(() => `
            <div class="news-card skeleton">
                <div class="news-card-header">
                    <div class="source-info">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-text skeleton-source"></div>
                    </div>
                </div>
                <div class="news-card-content">
                    <div class="skeleton-text skeleton-title"></div>
                    <div class="skeleton-text skeleton-title short"></div>
                    <div class="skeleton-text skeleton-description"></div>
                    <div class="skeleton-text skeleton-description short"></div>
                </div>
                <div class="news-card-footer">
                    <div class="skeleton-text skeleton-meta"></div>
                </div>
            </div>
        `).join('');
        
        return skeletons;
    }
    
    // Анимация карточек
    animateCards(container) {
        const cards = container.querySelectorAll('.news-card:not(.skeleton)');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.classList.add('animated');
            }, index * 50);
        });
    }
    
    // Анимация новых карточек
    animateNewCards(cards) {
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.classList.add('animated');
            }, index * 100);
        });
    }
    
    // Получение иконки источника
    getSourceIcon(category) {
        const icons = {
            tech: '💻',
            business: '💼',
            general: '📰',
            startup: '🚀',
            design: '🎨',
            marketing: '📈',
            finance: '💰'
        };
        return icons[category] || '📰';
    }
    
    // Получение названия категории
    getCategoryName(category) {
        const names = {
            tech: 'Технологии',
            business: 'Бизнес',
            general: 'Общее',
            startup: 'Стартапы',
            design: 'Дизайн',
            marketing: 'Маркетинг',
            finance: 'Финансы'
        };
        return names[category] || 'Новости';
    }
    
    // Форматирование времени
    formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'только что';
        if (diffMins < 60) return `${diffMins} мин назад`;
        if (diffHours < 24) return `${diffHours} ч назад`;
        if (diffDays < 7) return `${diffDays} дн назад`;
        
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short'
        });
    }
    
    // Обрезка текста
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }
    
    // Открытие модального окна статьи
    openArticleModal(articleId) {
        // Вызываем глобальную функцию если она существует
        if (typeof window.openArticleModal === 'function') {
            window.openArticleModal(articleId);
        } else {
            // Fallback - создаем простое модальное окно
            this.createSimpleModal(articleId);
        }
        
        // Отмечаем как прочитанное
        this.markAsRead(articleId);
    }
    
    // Создание простого модального окна
    createSimpleModal(articleId) {
        const card = document.querySelector(`[data-article-id="${articleId}"]`);
        if (!card) return;
        
        const title = card.querySelector('.news-title').textContent;
        const description = card.querySelector('.news-description')?.textContent || '';
        const articleUrl = card.querySelector('.news-card-content').dataset.articleUrl;
        const source = card.querySelector('.source-name').textContent;
        
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${this.escapeHtml(title)}</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="article-meta">
                        <span class="source-name">${this.escapeHtml(source)}</span>
                    </div>
                    <div class="article-content">
                        <p>${this.escapeHtml(description)}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn--outline modal-close">Закрыть</button>
                    <button class="btn btn--primary" onclick="window.open('${articleUrl}', '_blank')">
                        Перейти к статье
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Обработчики закрытия
        modal.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
            el.addEventListener('click', () => {
                modal.remove();
            });
        });
        
        // Закрытие по Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    // Утилиты
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    // Генерация количества просмотров (заглушка)
    generateViewCount() {
        return Math.floor(Math.random() * 1000) + 50;
    }
    
    // Переключение сохранения
    toggleSave(articleId) {
        if (this.savedItems.has(articleId)) {
            this.savedItems.delete(articleId);
            if (typeof window.showToast === 'function') {
                window.showToast('Убрано из избранного', 'info');
            }
        } else {
            this.savedItems.add(articleId);
            if (typeof window.showToast === 'function') {
                window.showToast('Добавлено в избранное', 'success');
            }
        }
        
        this.saveSavedItems();
        this.updateSaveButton(articleId);
        this.updateSavedCount();
    }
    
    // Отметка как прочитанное
    markAsRead(articleId) {
        if (!this.readItems.has(articleId)) {
            this.readItems.add(articleId);
            this.saveReadItems();
            
            const card = document.querySelector(`[data-article-id="${articleId}"]`);
            if (card) {
                card.classList.add('read');
                const indicator = card.querySelector('.unread-indicator');
                if (indicator) {
                    indicator.remove();
                }
            }
        }
    }
    
    // Поделиться статьей
    shareArticle(articleId) {
        const card = document.querySelector(`[data-article-id="${articleId}"]`);
        if (!card) return;
        
        const title = card.querySelector('.news-title').textContent;
        const link = card.querySelector('.news-card-link').href;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                url: link
            }).catch(() => {});
        } else {
            // Fallback: копирование в буфер обмена
            navigator.clipboard.writeText(link).then(() => {
                this.showToast('Ссылка скопирована в буфер обмена', 'success');
            }).catch(() => {
                this.showToast('Не удалось скопировать ссылку', 'error');
            });
        }
    }
    
    // Обновление кнопки сохранения
    updateSaveButton(articleId) {
        const card = document.querySelector(`[data-article-id="${articleId}"]`);
        if (!card) return;
        
        const saveBtn = card.querySelector('.save-btn');
        const isSaved = this.savedItems.has(articleId);
        
        saveBtn.classList.toggle('saved', isSaved);
        saveBtn.title = isSaved ? 'Убрать из избранного' : 'Добавить в избранное';
    }
    
    // Обновление счетчика сохраненных
    updateSavedCount() {
        const countElement = document.getElementById('savedCount');
        if (countElement) {
            const count = this.savedItems.size;
            countElement.textContent = count;
            countElement.classList.toggle('hidden', count === 0);
        }
    }
    
    // Сохранение избранных статей
    saveSavedItems() {
        try {
            localStorage.setItem('saved_articles', JSON.stringify([...this.savedItems]));
        } catch (error) {
            // Ошибка сохранения избранных статей
        }
    }
    
    // Загрузка избранных статей
    loadSavedItems() {
        try {
            const saved = localStorage.getItem('saved_articles');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            // Ошибка загрузки избранных статей
            return [];
        }
    }
    
    // Сохранение прочитанных статей
    saveReadItems() {
        try {
            localStorage.setItem('read_articles', JSON.stringify([...this.readItems]));
        } catch (error) {
            // Ошибка сохранения прочитанных статей
        }
    }
    
    // Загрузка прочитанных статей
    loadReadItems() {
        try {
            const read = localStorage.getItem('read_articles');
            return read ? JSON.parse(read) : [];
        } catch (error) {
            // Ошибка загрузки прочитанных статей
            return [];
        }
    }
    
    // Показ уведомления
    showToast(message, type = 'info') {
        if (window.filterSystem && window.filterSystem.showToast) {
            window.filterSystem.showToast(message, type);
        } else {
            // Показываем сообщение в консоли только в режиме разработки
        }
    }
    
    // Получение сохраненных статей
    getSavedArticles(allArticles) {
        return allArticles.filter(article => this.savedItems.has(article.id));
    }
    
    // Получение непрочитанных статей
    getUnreadArticles(allArticles) {
        return allArticles.filter(article => !this.readItems.has(article.id));
    }
    
    // Очистка прочитанных статей (старше 30 дней)
    cleanupReadItems() {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        // Здесь нужна более сложная логика с датами статей
        // Пока оставляем простую реализацию
        if (this.readItems.size > 1000) {
            const itemsArray = [...this.readItems];
            this.readItems = new Set(itemsArray.slice(-500));
            this.saveReadItems();
        }
    }
}

// Инициализация при загрузке
if (typeof window !== 'undefined') {
    window.NewsCardRenderer = NewsCardRenderer;
}
