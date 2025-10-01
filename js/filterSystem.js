// Filter System для NewsHub
// Система фильтрации новостей и вакансий

class FilterSystem {
    constructor() {
        this.filters = {
            sources: new Set(),
            professions: new Set(),
            includeKeywords: [],
            excludeKeywords: [],
            dateRange: 'all',
            enableAI: true,
            enablePersonalization: false
        };
        
        this.availableSources = [
            { id: 'habr', name: 'Habr', url: 'https://habr.com/ru/rss/hub/programming/', enabled: true },
            { id: 'vc', name: 'VC.ru', url: 'https://vc.ru/rss', enabled: true },
            { id: 'tproger', name: 'Tproger', url: 'https://tproger.ru/feed/', enabled: true },
            { id: 'dev', name: 'Dev.to', url: 'https://dev.to/feed', enabled: false },
            { id: 'medium', name: 'Medium', url: 'https://medium.com/feed', enabled: false }
        ];
        
        this.allProfessions = [
            'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
            'Data Scientist', 'Machine Learning Engineer', 'Product Manager', 'UX/UI Designer',
            'QA Engineer', 'Mobile Developer', 'System Administrator', 'Database Administrator',
            'Security Engineer', 'Cloud Architect', 'Technical Writer', 'Scrum Master',
            'Business Analyst', 'Project Manager', 'Sales Manager', 'Marketing Manager',
            'HR Manager', 'Financial Analyst', 'Accountant', 'Lawyer', 'Doctor',
            'Teacher', 'Architect', 'Engineer', 'Designer', 'Photographer',
            'Journalist', 'Content Creator', 'Social Media Manager', 'SEO Specialist',
            'Digital Marketer', 'Brand Manager', 'Event Manager', 'Consultant',
            'Analyst', 'Researcher', 'Scientist', 'Pharmacist', 'Nurse',
            'Veterinarian', 'Psychologist', 'Therapist', 'Social Worker', 'Chef',
            'Barista', 'Waiter', 'Retail Manager', 'Sales Associate', 'Customer Service',
            'Support Specialist', 'Translator', 'Interpreter', 'Editor', 'Copywriter',
            'Graphic Designer', 'Web Designer', 'Interior Designer', 'Fashion Designer',
            'Industrial Designer', 'Game Developer', 'Game Designer', 'Animator',
            'Video Editor', 'Sound Engineer', 'Music Producer', 'Artist', 'Musician',
            'Actor', 'Director', 'Producer', 'Screenwriter', 'Cinematographer',
            'Photographer', 'Photo Editor', 'Illustrator', 'Art Director', 'Creative Director',
            'Brand Designer', 'Package Designer', 'Environmental Designer', 'Landscape Architect',
            'Urban Planner', 'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer',
            'Chemical Engineer', 'Biomedical Engineer', 'Aerospace Engineer', 'Software Engineer',
            'Hardware Engineer', 'Network Engineer', 'Security Analyst', 'Penetration Tester',
            'Ethical Hacker', 'IT Manager', 'CTO', 'CIO', 'CEO', 'COO', 'CFO',
            'VP of Engineering', 'VP of Product', 'VP of Marketing', 'VP of Sales',
            'Director of Operations', 'Operations Manager', 'Supply Chain Manager',
            'Logistics Coordinator', 'Warehouse Manager', 'Quality Assurance Manager',
            'Compliance Officer', 'Risk Manager', 'Investment Banker', 'Financial Advisor',
            'Insurance Agent', 'Real Estate Agent', 'Property Manager', 'Construction Manager',
            'Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Technician',
            'Maintenance Worker', 'Janitor', 'Security Guard', 'Driver', 'Delivery Person',
            'Pilot', 'Flight Attendant', 'Travel Agent', 'Tour Guide', 'Hotel Manager',
            'Restaurant Manager', 'Event Coordinator', 'Wedding Planner', 'Personal Trainer',
            'Fitness Instructor', 'Yoga Instructor', 'Massage Therapist', 'Beautician',
            'Hair Stylist', 'Makeup Artist', 'Fashion Stylist', 'Personal Shopper',
            'Life Coach', 'Career Coach', 'Executive Coach', 'Mentor', 'Tutor',
            'Librarian', 'Museum Curator', 'Archivist', 'Historian', 'Anthropologist',
            'Sociologist', 'Political Scientist', 'Economist', 'Statistician', 'Mathematician'
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedFilters();
        this.populateSourcesFilter();
    }
    
    setupEventListeners() {
        // Кнопка добавления RSS источника
        const addSourceBtn = document.getElementById('addSourceBtn');
        if (addSourceBtn) {
            addSourceBtn.addEventListener('click', () => this.showAddSourceModal());
        }
        
        // Поиск по профессиям
        const professionSearch = document.getElementById('professionFilterSearch');
        if (professionSearch) {
            professionSearch.addEventListener('input', (e) => this.searchProfessions(e.target.value));
        }
        
        // Ключевые слова
        const includeKeywords = document.getElementById('includeKeywords');
        if (includeKeywords) {
            includeKeywords.addEventListener('input', (e) => this.updateKeywords('include', e.target.value));
        }
        
        const excludeKeywords = document.getElementById('excludeKeywords');
        if (excludeKeywords) {
            excludeKeywords.addEventListener('input', (e) => this.updateKeywords('exclude', e.target.value));
        }
        
        // Кнопки применения и сброса фильтров
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        }
        
        const resetFiltersBtn = document.getElementById('resetFiltersBtn');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        }
        
        // Закрытие модального окна фильтров
        const closeFiltersModal = document.getElementById('closeFiltersModal');
        if (closeFiltersModal) {
            closeFiltersModal.addEventListener('click', () => this.closeFiltersModal());
        }
        
        // Радио кнопки для фильтра дат
        const dateFilters = document.querySelectorAll('input[name="dateFilter"]');
        dateFilters.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.dateRange = e.target.value;
            });
        });
        
        // Чекбоксы для AI настроек
        const enableAISummary = document.getElementById('enableAISummary');
        if (enableAISummary) {
            enableAISummary.addEventListener('change', (e) => {
                this.filters.enableAI = e.target.checked;
            });
        }
        
        const enablePersonalization = document.getElementById('enablePersonalization');
        if (enablePersonalization) {
            enablePersonalization.addEventListener('change', (e) => {
                this.filters.enablePersonalization = e.target.checked;
            });
        }
    }
    
    // Показать модальное окно добавления RSS источника
    showAddSourceModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'addSourceModal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📰 Добавить RSS источник</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="sourceName">Название источника:</label>
                        <input type="text" id="sourceName" class="form-control" placeholder="Например: TechCrunch">
                    </div>
                    <div class="form-group">
                        <label for="sourceUrl">RSS URL:</label>
                        <input type="url" id="sourceUrl" class="form-control" placeholder="https://example.com/rss">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="sourceEnabled" checked>
                            Включить источник
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn--secondary" onclick="this.closest('.modal').remove()">Отмена</button>
                    <button class="btn btn--primary" onclick="window.filterSystem.addNewSource()">Добавить</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // Фокус на первое поле
        setTimeout(() => {
            document.getElementById('sourceName').focus();
        }, 100);
    }
    
    // Добавить новый RSS источник
    addNewSource() {
        const name = document.getElementById('sourceName').value.trim();
        const url = document.getElementById('sourceUrl').value.trim();
        const enabled = document.getElementById('sourceEnabled').checked;
        
        if (!name || !url) {
            this.showToast('Заполните все поля', 'error');
            return;
        }
        
        // Проверка валидности URL
        try {
            new URL(url);
        } catch {
            this.showToast('Введите корректный URL', 'error');
            return;
        }
        
        const newSource = {
            id: Date.now().toString(),
            name,
            url,
            enabled
        };
        
        this.availableSources.push(newSource);
        this.saveFilters();
        this.populateSourcesFilter();
        
        // Закрыть модальное окно
        document.getElementById('addSourceModal').remove();
        
        this.showToast(`RSS источник "${name}" добавлен`, 'success');
    }
    
    // Поиск по профессиям
    searchProfessions(query) {
        const suggestions = document.getElementById('professionSuggestions');
        if (!suggestions) return;
        
        if (!query.trim()) {
            suggestions.innerHTML = '';
            suggestions.style.display = 'none';
            return;
        }
        
        const filtered = this.allProfessions.filter(profession => 
            profession.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);
        
        if (filtered.length === 0) {
            suggestions.innerHTML = '<div class="no-results">Профессии не найдены</div>';
        } else {
            suggestions.innerHTML = filtered.map(profession => `
                <div class="profession-suggestion" onclick="window.filterSystem.selectProfession('${profession}')">
                    ${profession}
                </div>
            `).join('');
        }
        
        suggestions.style.display = 'block';
    }
    
    // Выбрать профессию
    selectProfession(profession) {
        if (this.filters.professions.size >= 5) {
            this.showToast('Можно выбрать максимум 5 профессий', 'warning');
            return;
        }
        
        this.filters.professions.add(profession);
        this.updateSelectedProfessions();
        
        // Очистить поиск
        const searchInput = document.getElementById('professionFilterSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        
        const suggestions = document.getElementById('professionSuggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
    }
    
    // Обновить отображение выбранных профессий
    updateSelectedProfessions() {
        const container = document.getElementById('selectedProfessions');
        if (!container) return;
        
        container.innerHTML = Array.from(this.filters.professions).map(profession => `
            <div class="profession-chip">
                <span>${profession}</span>
                <button onclick="window.filterSystem.removeProfession('${profession}')">×</button>
            </div>
        `).join('');
    }
    
    // Удалить профессию
    removeProfession(profession) {
        this.filters.professions.delete(profession);
        this.updateSelectedProfessions();
    }
    
    // Обновить ключевые слова
    updateKeywords(type, value) {
        const keywords = value.split(',').map(k => k.trim()).filter(k => k);
        
        if (type === 'include') {
            this.filters.includeKeywords = keywords;
        } else {
            this.filters.excludeKeywords = keywords;
        }
    }
    
    // Заполнить фильтр источников
    populateSourcesFilter() {
        const container = document.getElementById('sourcesFilter');
        if (!container) return;
        
        container.innerHTML = this.availableSources.map(source => `
            <label class="source-checkbox">
                <input type="checkbox" value="${source.id}" ${source.enabled ? 'checked' : ''}>
                <span class="source-name">${source.name}</span>
                <button class="remove-source-btn" onclick="window.filterSystem.removeSource('${source.id}')" title="Удалить источник">×</button>
            </label>
        `).join('');
        
        // Добавить обработчики для чекбоксов
        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const sourceId = e.target.value;
                const source = this.availableSources.find(s => s.id === sourceId);
                if (source) {
                    source.enabled = e.target.checked;
                    if (e.target.checked) {
                        this.filters.sources.add(sourceId);
                    } else {
                        this.filters.sources.delete(sourceId);
                    }
                }
            });
        });
    }
    
    // Удалить источник
    removeSource(sourceId) {
        this.availableSources = this.availableSources.filter(s => s.id !== sourceId);
        this.filters.sources.delete(sourceId);
        this.populateSourcesFilter();
        this.saveFilters();
        this.showToast('RSS источник удален', 'info');
    }
    
    // Применить фильтры
    applyFilters() {
        // Сохранить фильтры
        this.saveFilters();
        
        // Закрыть модальное окно
        this.closeFiltersModal();
        
        // Показать индикатор активных фильтров
        this.updateFilterIndicator();
        
        // Применить фильтры к контенту (эмуляция)
        this.filterContent();
        
        this.showToast('Фильтры применены', 'success');
    }
    
    // Сбросить фильтры
    resetFilters() {
        this.filters = {
            sources: new Set(),
            professions: new Set(),
            includeKeywords: [],
            excludeKeywords: [],
            dateRange: 'all',
            enableAI: true,
            enablePersonalization: false
        };
        
        // Сбросить UI
        const form = document.querySelector('#filtersModal form, #filtersModal .modal-body');
        if (form) {
            // Сбросить чекбоксы и радио кнопки
            form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = cb.id === 'enableAISummary';
            });
            
            form.querySelectorAll('input[type="radio"][value="all"]').forEach(radio => {
                radio.checked = true;
            });
            
            // Очистить текстовые поля
            form.querySelectorAll('input[type="text"]').forEach(input => {
                input.value = '';
            });
        }
        
        // Обновить выбранные профессии
        this.updateSelectedProfessions();
        
        // Обновить источники
        this.availableSources.forEach(source => {
            source.enabled = ['habr', 'vc', 'tproger'].includes(source.id);
        });
        this.populateSourcesFilter();
        
        this.showToast('Фильтры сброшены', 'info');
    }
    
    // Закрыть модальное окно фильтров
    closeFiltersModal() {
        const modal = document.getElementById('filtersModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }
    
    // Обновить индикатор фильтров
    updateFilterIndicator() {
        const indicator = document.getElementById('filterIndicator');
        if (!indicator) return;
        
        const activeFiltersCount = this.getActiveFiltersCount();
        
        if (activeFiltersCount > 0) {
            indicator.textContent = activeFiltersCount;
            indicator.classList.remove('hidden');
        } else {
            indicator.classList.add('hidden');
        }
    }
    
    // Получить количество активных фильтров
    getActiveFiltersCount() {
        let count = 0;
        
        if (this.filters.sources.size > 0) count++;
        if (this.filters.professions.size > 0) count++;
        if (this.filters.includeKeywords.length > 0) count++;
        if (this.filters.excludeKeywords.length > 0) count++;
        if (this.filters.dateRange !== 'all') count++;
        if (!this.filters.enableAI) count++;
        if (this.filters.enablePersonalization) count++;
        
        return count;
    }
    
    // Фильтрация контента (заглушка)
    filterContent() {
        // Здесь должна быть логика фильтрации контента
    }
    
    // Сохранить фильтры в localStorage
    saveFilters() {
        const filtersToSave = {
            sources: Array.from(this.filters.sources),
            professions: Array.from(this.filters.professions),
            includeKeywords: this.filters.includeKeywords,
            excludeKeywords: this.filters.excludeKeywords,
            dateRange: this.filters.dateRange,
            enableAI: this.filters.enableAI,
            enablePersonalization: this.filters.enablePersonalization,
            availableSources: this.availableSources
        };
        
        try {
            localStorage.setItem('newshub_filters', JSON.stringify(filtersToSave));
        } catch (error) {
            // Ошибка сохранения фильтров
        }
    }
    
    // Загрузить сохраненные фильтры
    loadSavedFilters() {
        try {
            const saved = localStorage.getItem('newshub_filters');
            if (saved) {
                const data = JSON.parse(saved);
                
                this.filters.sources = new Set(data.sources || []);
                this.filters.professions = new Set(data.professions || []);
                this.filters.includeKeywords = data.includeKeywords || [];
                this.filters.excludeKeywords = data.excludeKeywords || [];
                this.filters.dateRange = data.dateRange || 'all';
                this.filters.enableAI = data.enableAI !== undefined ? data.enableAI : true;
                this.filters.enablePersonalization = data.enablePersonalization || false;
                
                if (data.availableSources) {
                    this.availableSources = data.availableSources;
                }
            }
        } catch (error) {
            // Ошибка загрузки фильтров
        }
    }
    
    // Показать уведомление
    showToast(message, type = 'info') {
        // Создать элемент уведомления
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Добавить в контейнер
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        // Автоматически удалить через 5 секунд
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.filterSystem = new FilterSystem();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterSystem;
}
