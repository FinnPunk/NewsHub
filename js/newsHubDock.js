// NewsHub Dock - Оптимизированная версия
class NewsHubDock {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            baseSize: 50,
            maxSize: 70,
            items: [],
            activeItem: null,
            onItemClick: null,
            ...options
        };
        
        this.items = [];
        this.init();
    }
    
    init() {
        this.container.innerHTML = '<div class="dock-panel" role="toolbar"></div>';
        this.panel = this.container.querySelector('.dock-panel');
        this.setupEvents();
        this.render();
    }
    
    setupEvents() {
        this.panel.addEventListener('mousemove', (e) => this.updateHover(e));
        this.panel.addEventListener('mouseleave', () => this.resetHover());
    }
    
    updateHover(e) {
        this.items.forEach(item => {
            const rect = item.element.getBoundingClientRect();
            const distance = Math.abs(e.clientX - (rect.left + rect.width / 2));
            const scale = Math.max(0, 1 - distance / 100);
            const size = this.options.baseSize + (this.options.maxSize - this.options.baseSize) * scale;
            
            item.element.style.width = `${size}px`;
            item.element.style.height = `${size}px`;
            item.element.style.transform = scale > 0.5 ? 'translateY(-4px)' : 'translateY(0)';
        });
    }
    
    resetHover() {
        this.items.forEach(item => {
            item.element.style.width = `${this.options.baseSize}px`;
            item.element.style.height = `${this.options.baseSize}px`;
            item.element.style.transform = 'translateY(0)';
        });
    }
    
    render() {
        this.panel.innerHTML = '';
        this.items = [];
        
        this.options.items.forEach(data => {
            const item = this.createItem(data);
            this.panel.appendChild(item.container);
            this.items.push(item);
        });
        
        this.updateActive();
    }
    
    createItem(data) {
        const container = document.createElement('div');
        container.className = 'dock-item-container';
        
        const element = document.createElement('button');
        element.className = `dock-item ${data.className || ''}`;
        element.style.cssText = `width: ${this.options.baseSize}px; height: ${this.options.baseSize}px;`;
        element.setAttribute('aria-label', data.label);
        element.innerHTML = `<span class="dock-icon">${data.icon}</span>`;
        
        if (data.count > 0) {
            element.innerHTML += `<span class="dock-badge">${data.count}</span>`;
        }
        
        const label = document.createElement('div');
        label.className = 'dock-label';
        label.textContent = data.label;
        
        // События
        element.onclick = () => this.options.onItemClick?.(data.id);
        element.onmouseenter = () => label.style.opacity = '1';
        element.onmouseleave = () => label.style.opacity = '0';
        
        container.append(element, label);
        return { element, label, container, data };
    }
    
    setActiveItem(itemId) {
        this.options.activeItem = itemId;
        this.updateActive();
    }
    
    updateActive() {
        this.items.forEach(item => {
            item.element.classList.toggle('active', item.data.id === this.options.activeItem);
        });
    }
    
    updateItemCount(itemId, count) {
        const item = this.options.items.find(i => i.id === itemId);
        if (item) {
            item.count = count;
            this.render();
        }
    }
}

// Утилиты и инициализация
const createDockItem = (id, icon, label, count = 0) => ({ id, icon, label, count });

const defaultItems = [
    createDockItem('feed', '📰', 'Лента'),
    createDockItem('favorites', '⭐', 'Избранное'),
    createDockItem('profile', '👤', 'Профиль')
];

// Навигация между страницами
const navigateToPage = (itemId, dock) => {
    dock.setActiveItem(itemId);
    
    const pageMap = { feed: 'feedPage', favorites: 'favoritesPage', profile: 'profilePage' };
    const labels = { feed: 'Лента', favorites: 'Избранное', profile: 'Профиль' };
    
    // Переключение страниц
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageMap[itemId])?.classList.add('active');
    
    // Обновление breadcrumb
    document.querySelectorAll('.breadcrumb-item').forEach(item => {
        item.classList.toggle('active', item.textContent.trim() === labels[itemId]);
    });
    
    // Специальная логика для каждой страницы
    if (itemId === 'favorites') {
        // Загружаем избранные статьи
        setTimeout(() => {
            if (typeof loadFavorites === 'function') {
                loadFavorites();
            } else if (window.loadFavorites) {
                window.loadFavorites();
            }
        }, 100);
    }
    
    // Уведомление
    console.log(`🧭 Переход: ${labels[itemId]}`);
};

// Переключатель темы
const addThemeToggle = () => {
    // Проверяем, не существует ли уже переключатель
    if (document.getElementById('themeToggle')) return;
    
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;
    
    const toggle = document.createElement('button');
    toggle.className = 'btn btn--icon';
    toggle.id = 'themeToggle';
    toggle.title = 'Переключить тему';
    
    const icons = {
        dark: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"/></svg>',
        light: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z"/></svg>'
    };
    
    const getCurrentTheme = () => document.documentElement.getAttribute('data-theme') || 'light';
    
    const updateTheme = () => {
        const currentTheme = getCurrentTheme();
        toggle.innerHTML = icons[currentTheme];
        toggle.title = currentTheme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему';
    };
    
    updateTheme();
    
    toggle.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Обновляем атрибут темы
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Обновляем класс body
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim() + ` theme-${newTheme}`;
        
        // Сохраняем в localStorage
        localStorage.setItem('theme', newTheme);
        
        // Обновляем иконку
        updateTheme();
        
        // Показываем уведомление
        window.showToast?.(`Тема: ${newTheme === 'dark' ? 'темная' : 'светлая'}`, 'info');
    };
    
    headerActions.appendChild(toggle);
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.dock-container, #dock, nav.dock-bar');
    if (container) {
        const dock = new NewsHubDock(container, {
            items: defaultItems,
            activeItem: 'feed',
            onItemClick: (itemId) => navigateToPage(itemId, dock)
        });
        
        window.newsHubDock = dock;
        
        // Добавляем переключатель темы с небольшой задержкой
        setTimeout(() => {
            addThemeToggle();
        }, 100);
    }
});

// Экспорт
window.NewsHubDock = NewsHubDock;
