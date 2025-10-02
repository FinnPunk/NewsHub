// NewsHub - Основной модуль приложения
// Версия: 2.1.8

import CONFIG from './config.js';

// Глобальные переменные
window.jobsApiReady = false;
window.cachedNewsHTML = '';

// Система управления состоянием загрузки
window.loadingState = {
    rss: false,
    vk: false,
    jobs: false,
    
    setLoading(type, isLoading) {
        this[type] = isLoading;
        this.updateUI();
    },
    
    isAnyLoading() {
        return this.rss || this.vk || this.jobs;
    },
    
    updateUI() {
        const feedContainer = document.getElementById('feedContainer');
        if (!feedContainer) return;
        
        // Показываем статус загрузки только если что-то загружается
        if (this.isAnyLoading()) {
            const loadingTypes = [];
            if (this.rss) loadingTypes.push('RSS новости');
            if (this.vk) loadingTypes.push('VK посты');
            if (this.jobs) loadingTypes.push('Вакансии');
            
            const loadingText = loadingTypes.join(' + ');
            
            // Обновляем только если контент пустой или уже показывается загрузка
            if (feedContainer.innerHTML.includes('spinner') || feedContainer.children.length === 0) {
                feedContainer.innerHTML = `
                    <div style="text-align: center; padding: 3rem;">
                        <div class="spinner"></div>
                        <h3>Загружаем ${loadingText}...</h3>
                        <p>Пожалуйста, подождите</p>
                    </div>
                `;
            }
        }
    }
};

// Функция обновления версии приложения
function updateAppVersion() {
    const versionElement = document.getElementById('appVersion');
    if (versionElement && CONFIG?.app?.version) {
        versionElement.textContent = `v${CONFIG.app.version}`;
        versionElement.title = `NewsHub версия ${CONFIG.app.version}`;
    }
}

// Функция инициализации селектов из CONFIG
function initializeJobFiltersFromConfig() {
    if (!CONFIG) return;
    
    // Типы вакансий с группировкой по категориям
    const jobTypeSelect = document.getElementById('jobType');
    if (jobTypeSelect && CONFIG.jobTypes && CONFIG.jobCategories) {
        // Группируем вакансии по категориям
        const jobsByCategory = {};
        CONFIG.jobTypes.forEach(jobType => {
            const category = jobType.category || 'other';
            if (!jobsByCategory[category]) {
                jobsByCategory[category] = [];
            }
            jobsByCategory[category].push(jobType);
        });

        // Очищаем селект
        jobTypeSelect.innerHTML = '<option value="">Любая</option>';

        // Добавляем группы
        Object.keys(jobsByCategory).forEach(categoryKey => {
            const category = CONFIG.jobCategories.find(cat => cat.id === categoryKey);
            const categoryName = category ? category.name : 'Другое';
            
            const optgroup = document.createElement('optgroup');
            optgroup.label = categoryName;
            
            jobsByCategory[categoryKey].forEach(jobType => {
                const option = document.createElement('option');
                option.value = jobType.id;
                option.textContent = jobType.name;
                optgroup.appendChild(option);
            });
            
            jobTypeSelect.appendChild(optgroup);
        });
    }

    // Города
    const citySelect = document.getElementById('jobCity');
    if (citySelect && CONFIG.cities) {
        citySelect.innerHTML = '';
        CONFIG.cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
    }
}

// Кеширование данных
function setCachedData(key, data) {
    try {
        const cacheData = {
            data: data,
            timestamp: Date.now(),
            version: CONFIG.app.version
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
        console.warn('Ошибка сохранения в кеш:', error);
    }
}

function getCachedData(key, maxAge = 15 * 60 * 1000) { // 15 минут по умолчанию
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        
        const cacheData = JSON.parse(cached);
        const age = Date.now() - cacheData.timestamp;
        
        // Проверяем версию и возраст
        if (cacheData.version !== CONFIG.app.version || age > maxAge) {
            localStorage.removeItem(key);
            return null;
        }
        
        return cacheData.data;
    } catch (error) {
        console.warn('Ошибка чтения кеша:', error);
        return null;
    }
}

// Оптимизированная загрузка начального контента
async function loadInitialContent(forceRefresh = false) {
    const feedContainer = document.getElementById('feedContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Проверяем кеш если не принудительное обновление
    if (!forceRefresh) {
        const cachedArticles = getCachedData('news_cache');
        if (cachedArticles && cachedArticles.length > 0) {
            window.newsRenderer.renderCards(cachedArticles, feedContainer);
            window.cachedNewsHTML = feedContainer.innerHTML;
            console.log('📰 Новости загружены из кеша');
            return;
        }
    }
    
    // Устанавливаем состояние загрузки RSS
    window.loadingState.setLoading('rss', true);
    
    try {
        // Показываем skeleton loading
        feedContainer.innerHTML = window.newsRenderer.renderSkeleton(5);
        if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        
        // Загружаем новости
        console.log('📰 Загружаем RSS новости...');
        let articles = await window.rssAggregator.aggregateNews(50);
        console.log('✅ Получено статей:', articles.length);
        
        // Фильтруем новости по типу вакансии из фильтров
        const jobFilters = JSON.parse(localStorage.getItem('job_filters') || '{}');
        if (jobFilters.jobType && forceRefresh) {
            // Получаем название типа вакансии для фильтрации
            const jobTypeName = CONFIG?.jobTypes?.find(j => j.id === jobFilters.jobType)?.name;
            if (jobTypeName) {
                const searchTerms = jobTypeName.toLowerCase().split(' ');
                articles = articles.filter(article => {
                    const content = (article.title + ' ' + article.description).toLowerCase();
                    return searchTerms.some(term => content.includes(term));
                });
            }
        }
        
        if (articles && articles.length > 0) {
            window.newsRenderer.renderCards(articles, feedContainer);
            window.cachedNewsHTML = feedContainer.innerHTML;
            
            // Сохраняем в кеш
            setCachedData('news_cache', articles);
            
            // Проверяем, есть ли fallback данные
            const hasFallbackData = articles.some(article => article.isFallback);
            if (hasFallbackData) {
                showDemoDataNotification();
            }
        } else {
            feedContainer.innerHTML = window.newsRenderer.renderEmptyState();
        }
        
    } catch (error) {
        feedContainer.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>Ошибка загрузки новостей</h3>
                <p>Попробуйте обновить страницу</p>
                <button class="btn btn--primary" onclick="loadInitialContent(true)">
                    Повторить
                </button>
            </div>
        `;
    } finally {
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
        window.loadingState.setLoading('rss', false);
    }
}

// Экспорт функций для глобального доступа
window.updateAppVersion = updateAppVersion;
window.initializeJobFiltersFromConfig = initializeJobFiltersFromConfig;
window.loadInitialContent = loadInitialContent;
window.setCachedData = setCachedData;
window.getCachedData = getCachedData;

export {
    updateAppVersion,
    initializeJobFiltersFromConfig,
    loadInitialContent,
    setCachedData,
    getCachedData
};
