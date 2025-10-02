// RSS Aggregator для NewsHub
// Система агрегации новостей из множественных RSS источников

class RSSAggregator {
    constructor() {
        // Ссылка на VK API
        this.vkApi = null;
        
        this.sources = [
            // Технологические источники (проверенные, прямые RSS)
            { id: 'habr', name: 'Habr', url: 'https://habr.com/ru/rss/hub/programming/', category: 'tech', enabled: true, priority: 1, direct: true },
            { id: 'vc-tech', name: 'VC.ru', url: 'https://vc.ru/rss', category: 'tech', enabled: true, priority: 2, direct: true },
            
            // Международные IT источники (проверенные форматы)
            { id: 'dev-to', name: 'Dev.to', url: 'https://dev.to/feed', category: 'tech', enabled: true, priority: 3 },
            { id: 'github-blog', name: 'GitHub Blog', url: 'https://github.blog/feed/', category: 'tech', enabled: true, priority: 4 },
            
            // Деловые новости (только надежные)
            { id: 'kommersant', name: 'Коммерсантъ', url: 'https://www.kommersant.ru/RSS/news.xml', category: 'business', enabled: true, priority: 5 },
            
            // Общие новости (только работающие)
            { id: 'lenta', name: 'Лента.ру', url: 'https://lenta.ru/rss', category: 'general', enabled: true, priority: 6 },
            { id: 'ria', name: 'РИА Новости', url: 'https://ria.ru/export/rss2/archive/index.xml', category: 'general', enabled: true, priority: 7 },
            
            // Дизайн и UX (международные)
            { id: 'smashing', name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', category: 'design', enabled: true, priority: 8 },
            { id: 'css-tricks', name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/', category: 'design', enabled: true, priority: 9 },
            
            // Дополнительные проверенные источники
            { id: 'freecodecamp', name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/rss/', category: 'tech', enabled: true, priority: 10 },
            { id: 'hashnode', name: 'Hashnode', url: 'https://hashnode.com/rss', category: 'tech', enabled: true, priority: 11 },
            
            // Отключенные проблемные источники (для справки)
            { id: 'techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'tech', enabled: false },
            { id: 'wired', name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'tech', enabled: false },
            { id: 'rbc', name: 'РБК', url: 'https://rssexport.rbc.ru/rbcnews/news/20/full.rss', category: 'business', enabled: false },
            { id: 'vedomosti', name: 'Ведомости', url: 'https://www.vedomosti.ru/rss/news', category: 'business', enabled: false },
            { id: 'tass', name: 'ТАСС', url: 'https://tass.ru/rss/v2.xml', category: 'general', enabled: false },
            { id: 'gazeta', name: 'Газета.ру', url: 'https://www.gazeta.ru/export/rss/lenta.xml', category: 'general', enabled: false },
            { id: 'finam', name: 'Финам', url: 'https://www.finam.ru/analysis/conews/rsspoint/', category: 'finance', enabled: false },
            { id: 'investing', name: 'Investing.com', url: 'https://ru.investing.com/rss/news.rss', category: 'finance', enabled: false }
        ];
        
        // Несколько CORS прокси для надежности (из изученных проектов)
        this.corsProxies = [
            'https://api.allorigins.win/get?url=',
            'https://corsproxy.io/?',
            'https://cors-anywhere.herokuapp.com/',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        this.currentProxyIndex = 0;
        
        // Улучшенная система персонализации (из newshub-master-final)
        this.selectedProfessions = [];
        this.relevanceScoring = true;
        
        this.cache = new Map();
        this.cacheTimeout = 15 * 60 * 1000; // 15 минут
        this.articles = [];
        this.isLoading = false;
        this.failedSources = new Set(); // Отслеживаем неработающие источники
        
        this.init();
    }
    
    init() {
        this.loadSavedSources();
    }
    
    // Загрузка сохраненных источников
    loadSavedSources() {
        try {
            const saved = localStorage.getItem('rss_sources');
            if (saved) {
                const savedSources = JSON.parse(saved);
                this.sources = this.sources.map(source => {
                    const savedSource = savedSources.find(s => s.id === source.id);
                    return savedSource ? { ...source, ...savedSource } : source;
                });
            }
        } catch (error) {
            // Ошибка загрузки источников
        }
    }
    
    // Сохранение источников
    saveSources() {
        try {
            localStorage.setItem('rss_sources', JSON.stringify(this.sources));
        } catch (error) {
            // Ошибка сохранения источников
        }
    }
    
    // Получение активных источников
    getActiveSources() {
        return this.sources.filter(source => source.enabled);
    }
    
    // Добавление нового источника
    addSource(sourceData) {
        const newSource = {
            id: Date.now().toString(),
            name: sourceData.name,
            url: sourceData.url,
            category: sourceData.category || 'general',
            enabled: true
        };
        
        this.sources.push(newSource);
        this.saveSources();
        return newSource;
    }
    
    // Удаление источника
    removeSource(sourceId) {
        this.sources = this.sources.filter(s => s.id !== sourceId);
        this.saveSources();
    }
    
    // Переключение состояния источника
    toggleSource(sourceId, enabled) {
        const source = this.sources.find(s => s.id === sourceId);
        if (source) {
            source.enabled = enabled;
            this.saveSources();
        }
    }
    
    // Основной метод агрегации
    async aggregateNews(maxArticles = 50) {
        if (this.isLoading) {
            // Агрегация уже выполняется
            return this.articles;
        }
        
        this.isLoading = true;
        try {
            const activeSources = this.getActiveSources();
            
            const promises = activeSources.map(source => this.fetchFromSource(source));
            const results = await Promise.allSettled(promises);
            
            // Собираем все статьи
            let allArticles = [];
            let successfulSources = 0;
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value && result.value.length > 0) {
                    // Фильтруем fallback статьи
                    const realArticles = result.value.filter(article => !article.isFallback);
                    if (realArticles.length > 0) {
                        allArticles = allArticles.concat(realArticles);
                        successfulSources++;
                    }
                } else {
                    // Ошибка загрузки из источника
                }
            });
            
            // VK посты загружаются отдельно только при выборе типа вакансии
            // Это ускоряет загрузку основных новостей
            
            // Если ни один источник не сработал, возвращаем пустой массив
            if (allArticles.length === 0) {
                console.warn('⚠️ Нет статей из источников');
            }
            
            // Дедупликация и сортировка
            const uniqueArticles = this.deduplicateArticles(allArticles);
            const sortedArticles = this.sortArticles(uniqueArticles);
            
            this.articles = sortedArticles.slice(0, maxArticles);
            
            const statusMessage = successfulSources > 0 
                ? `✅ Загружено ${this.articles.length} статей из ${successfulSources}/${activeSources.length} источников`
                : `📋 Все RSS источники недоступны, показываем демо-контент (${this.articles.length} статей)`;
            
            // Показываем статус загрузки
            
            // Показываем уведомление пользователю
            if (typeof window.showToast === 'function') {
                if (successfulSources === 0) {
                    window.showToast('RSS источники недоступны, показываем демо-контент', 'warning');
                } else if (successfulSources < activeSources.length) {
                    window.showToast(`Загружено из ${successfulSources}/${activeSources.length} источников`, 'info');
                } else {
                    window.showToast(`Загружено ${this.articles.length} новых статей`, 'success');
                }
            }
            
            // Кэшируем результат
            this.cacheArticles();
            
            return this.articles;
            
        } catch (error) {
            // Критическая ошибка агрегации
            
            // В случае критической ошибки возвращаем пустой массив
            this.articles = [];
                
            // Уведомляем пользователя
            if (typeof window.showToast === 'function') {
                window.showToast('Ошибка загрузки новостей', 'error');
            }
            
            return this.articles;
        } finally {
            this.isLoading = false;
        }
    }
    
    // Загрузка из одного источника
    async fetchFromSource(source) {
        try {
            const cacheKey = `rss_${source.id}`;
            const cached = this.cache.get(cacheKey);
            
            // Проверяем кэш
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                // Используем кэш
                return cached.articles;
            }
                        // Загружаем источник
            
            // Проверяем, не в черном списке ли источник
            if (this.failedSources.has(source.id)) {
                // Пропускаем источник (в черном списке)
                return [];
            }
            
            let articles = [];
            let lastError = null;
            
            // Если источник поддерживает прямой доступ, пробуем сначала без прокси
            if (source.direct) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000);
                    
                    const response = await fetch(source.url, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/xml, text/xml, application/rss+xml',
                        },
                        signal: controller.signal,
                        mode: 'cors'
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (response.ok) {
                        const xmlText = await response.text();
                        articles = this.parseRSS(xmlText, source);
                        
                        if (articles.length > 0) {
                            console.log(`✅ Прямая загрузка ${source.name}: ${articles.length} статей`);
                            this.cache.set(cacheKey, { articles, timestamp: Date.now() });
                            return articles;
                        }
                    }
                } catch (error) {
                    console.log(`⚠️ Прямая загрузка ${source.name} не удалась, пробуем прокси`);
                }
            }
            
            // Пробуем все доступные прокси
            for (let i = 0; i < this.corsProxies.length; i++) {
                const proxyIndex = (this.currentProxyIndex + i) % this.corsProxies.length;
                const proxy = this.corsProxies[proxyIndex];
                
                try {
                    // Пробуем прокси
                    
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут
                    
                    const response = await fetch(`${proxy}${encodeURIComponent(source.url)}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json, text/xml, application/xml, text/plain',
                            'User-Agent': 'NewsHub/1.0'
                        },
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    let xmlText;
                    const contentType = response.headers.get('content-type') || '';
                    
                    if (contentType.includes('application/json')) {
                        const data = await response.json();
                        xmlText = data.contents || data.data || data;
                    } else {
                        xmlText = await response.text();
                    }
                    
                    if (!xmlText) {
                        throw new Error('Пустой ответ от источника');
                    }
                    
                    articles = this.parseRSS(xmlText, source);
                    
                    if (articles.length > 0) {
                        // Успешно загрузили - кэшируем и выходим
                        // Успешно загружены статьи
                        this.cache.set(cacheKey, {
                            articles,
                            timestamp: Date.now()
                        });
                        
                        // Обновляем рабочий прокси
                        this.currentProxyIndex = proxyIndex;
                        return articles;
                    }
                    
                } catch (error) {
                    lastError = error;
                    // Прокси не работает
                    
                    // Если это таймаут, пробуем следующий прокси быстрее
                    if (error.name === 'AbortError') {
                        // Таймаут для источника
                        continue;
                    }
                }
            }
            
            // Если все прокси не сработали, добавляем в черный список на время
            // Источник временно недоступен
            this.failedSources.add(source.id);
            
            // Убираем из черного списка через 15 минут (уменьшили время)
            setTimeout(() => {
                this.failedSources.delete(source.id);
                // Источник снова доступен для проверки
            }, 15 * 60 * 1000);
            
            // Возвращаем fallback данные только для важных источников
            if (source.priority && source.priority <= 5) {
                return this.getFallbackArticles(source);
            }
            
            return [];
            
        } catch (error) {
            // Критическая ошибка при загрузке источника
            return this.getFallbackArticles(source);
        }
    }
    
    // Fallback данные когда RSS не работает
    getFallbackArticles(source) {
        // Используем fallback данные
        
        const fallbackArticles = [
            {
                id: `fallback-${source.id}-1`,
                title: `Новости ${source.name} временно недоступны`,
                description: 'RSS-лента источника временно недоступна. Мы работаем над восстановлением доступа.',
                link: '#',
                publishedAt: new Date().toISOString(),
                source: {
                    name: source.name,
                    category: source.category
                },
                category: source.category,
                readingTime: 1,
                likes: 0,
                isFallback: true
            }
        ];
        
        return fallbackArticles;
    }
    
    
    // Парсинг RSS XML
    parseRSS(xmlText, source) {
        try {
            // Проверяем, что получили валидный XML
            if (!xmlText || typeof xmlText !== 'string') {
                throw new Error('Невалидный XML контент');
            }
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Проверяем на ошибки парсинга
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                // Ошибка парсинга XML
                throw new Error('Ошибка парсинга XML');
            }
            
            // Ищем элементы в разных форматах RSS/Atom
            let items = xmlDoc.querySelectorAll('item');
            if (items.length === 0) {
                items = xmlDoc.querySelectorAll('entry'); // Atom формат
            }
            
            if (items.length === 0) {
                // Не найдено статей в RSS
                return [];
            }
            
            const articles = [];
            
            items.forEach((item, index) => {
                if (index >= 10) return; // Ограничиваем количество статей с источника
                
                try {
                    const article = this.parseArticle(item, source);
                    if (article) {
                        articles.push(article);
                    }
                } catch (error) {
                    // Ошибка парсинга статьи
                }
            });
            
            // Успешно распарсены статьи
            return articles;
            
        } catch (error) {
            // Ошибка парсинга RSS
            return [];
        }
    }
    
    // Парсинг отдельной статьи
    parseArticle(item, source) {
        const getTextContent = (selector) => {
            const element = item.querySelector(selector);
            return element ? element.textContent.trim() : '';
        };
        
        const title = getTextContent('title');
        const link = getTextContent('link');
        const description = getTextContent('description');
        const pubDate = getTextContent('pubDate');
        const category = getTextContent('category') || source.category;
        
        if (!title || !link) {
            return null;
        }
        
        // Очищаем описание от HTML тегов
        const cleanDescription = description.replace(/<[^>]*>/g, '').trim();
        
        // Парсим дату
        let publishedAt = new Date();
        if (pubDate) {
            const parsedDate = new Date(pubDate);
            if (!isNaN(parsedDate.getTime())) {
                publishedAt = parsedDate;
            }
        }
        
        return {
            id: this.generateArticleId(link),
            title: this.cleanText(title),
            description: this.cleanText(cleanDescription),
            link,
            source: {
                id: source.id,
                name: source.name,
                category: source.category
            },
            category,
            publishedAt,
            timestamp: Date.now(),
            readingTime: this.estimateReadingTime(cleanDescription),
            isRead: false,
            isSaved: false
        };
    }
    
    // Генерация ID статьи
    generateArticleId(link) {
        return btoa(link).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }
    
    // Очистка текста
    cleanText(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim();
    }
    
    // Оценка времени чтения
    estimateReadingTime(text) {
        const wordsPerMinute = 200;
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return Math.max(1, minutes);
    }
    
    // Дедупликация статей
    deduplicateArticles(articles) {
        const seen = new Set();
        const unique = [];
        
        articles.forEach(article => {
            // Создаем ключ для дедупликации на основе заголовка
            const key = article.title.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(article);
            }
        });
        
        // Дедупликация статей
        return unique;
    }
    
    // Улучшенная сортировка статей с оценкой релевантности
    sortArticles(articles) {
        return articles.sort((a, b) => {
            // Если включена система релевантности, сортируем по релевантности
            if (this.relevanceScoring && this.selectedProfessions.length > 0) {
                const scoreA = this.calculateRelevanceScore(a);
                const scoreB = this.calculateRelevanceScore(b);
                if (scoreB !== scoreA) return scoreB - scoreA;
            }
            
            // Затем по дате (новые первыми)
            const dateCompare = new Date(b.publishedAt) - new Date(a.publishedAt);
            if (dateCompare !== 0) return dateCompare;
            
            // Затем по приоритету источника
            const aPriority = a.source.priority || 999;
            const bPriority = b.source.priority || 999;
            if (aPriority !== bPriority) return aPriority - bPriority;
            
            return 0;
        });
    }
    
    // Система оценки релевантности (из newshub-master-final)
    calculateRelevanceScore(article) {
        if (!this.selectedProfessions.length) return 0;
        
        let score = 0;
        const contentText = `${article.title} ${article.description}`.toLowerCase();
        
        // Проверяем соответствие выбранным профессиям
        this.selectedProfessions.forEach(professionId => {
            const profession = this.getProfessionById(professionId);
            if (!profession) return;
            
            // Прямое соответствие профессии
            if (article.relevantProfessions?.includes(professionId)) {
                score += 50;
            }
            
            // Соответствие ключевым словам
            if (profession.keywords) {
                profession.keywords.forEach(keyword => {
                    if (contentText.includes(keyword.toLowerCase())) {
                        score += 10;
                    }
                });
            }
        });
        
        // Бонус за свежесть
        const hoursAgo = (Date.now() - new Date(article.publishedAt)) / (1000 * 60 * 60);
        if (hoursAgo < 24) score += 5;
        if (hoursAgo < 6) score += 3;
        
        return score;
    }
    
    // Получение профессии по ID (заглушка, нужно будет интегрировать с системой профессий)
    getProfessionById(id) {
        // Базовые профессии для демонстрации
        const professions = {
            1: { name: "Frontend Developer", keywords: ["react", "vue", "angular", "javascript", "typescript", "css", "html"] },
            2: { name: "Backend Developer", keywords: ["python", "java", "nodejs", "php", "golang", "api"] },
            3: { name: "Fullstack Developer", keywords: ["fullstack", "javascript", "python", "react", "nodejs"] }
        };
        return professions[id];
    }
    
    // Кэширование статей
    cacheArticles() {
        try {
            const cacheData = {
                articles: this.articles,
                timestamp: Date.now()
            };
            localStorage.setItem('cached_articles', JSON.stringify(cacheData));
        } catch (error) {
            // Ошибка кэширования статей
        }
    }
    
    // Получение кэшированных статей
    getCachedArticles() {
        try {
            const cached = localStorage.getItem('cached_articles');
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < this.cacheTimeout * 2) {
                    // Используем кэшированные статьи
                    return data.articles || [];
                }
            }
        } catch (error) {
            // Ошибка загрузки кэшированных статей
        }
        return [];
    }
    
    // Фильтрация статей
    filterArticles(filters = {}) {
        let filtered = [...this.articles];
        
        // Фильтр по категории
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(article => article.category === filters.category);
        }
        
        // Фильтр по источнику
        if (filters.sources && filters.sources.length > 0) {
            filtered = filtered.filter(article => filters.sources.includes(article.source.id));
        }
        
        // Фильтр по ключевым словам
        if (filters.keywords && filters.keywords.length > 0) {
            filtered = filtered.filter(article => {
                const text = `${article.title} ${article.description}`.toLowerCase();
                return filters.keywords.some(keyword => 
                    text.includes(keyword.toLowerCase())
                );
            });
        }
        
        // Фильтр по дате
        if (filters.dateRange) {
            const now = new Date();
            let cutoffDate;
            
            switch (filters.dateRange) {
                case 'today':
                    cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
            }
            
            if (cutoffDate) {
                filtered = filtered.filter(article => article.publishedAt >= cutoffDate);
            }
        }
        
        return filtered;
    }
    
    // Поиск по статьям
    searchArticles(query) {
        if (!query || query.trim().length < 2) {
            return this.articles;
        }
        
        const searchTerms = query.toLowerCase().trim().split(/\s+/);
        
        return this.articles.filter(article => {
            const searchText = `${article.title} ${article.description}`.toLowerCase();
            return searchTerms.every(term => searchText.includes(term));
        });
    }
    
    // Методы управления профессиями (из newshub-master-final)
    setSelectedProfessions(professionIds) {
        this.selectedProfessions = professionIds;
        // Обновление выбранных профессий
    }
    
    addProfession(professionId) {
        if (!this.selectedProfessions.includes(professionId)) {
            this.selectedProfessions.push(professionId);
        }
    }
    
    removeProfession(professionId) {
        this.selectedProfessions = this.selectedProfessions.filter(id => id !== professionId);
    }
    
    
    // Проверка доступности источников
    async checkSourcesHealth() {
        // Проверка доступности RSS источников
        
        const activeSources = this.getActiveSources();
        const healthCheck = {
            total: activeSources.length,
            available: 0,
            unavailable: 0,
            sources: {}
        };
        
        for (const source of activeSources) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const response = await fetch(`${this.corsProxies[0]}${encodeURIComponent(source.url)}`, {
                    method: 'HEAD',
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    healthCheck.available++;
                    healthCheck.sources[source.id] = 'available';
                    // Источник доступен
                } else {
                    healthCheck.unavailable++;
                    healthCheck.sources[source.id] = 'unavailable';
                    // Источник недоступен
                }
            } catch (error) {
                healthCheck.unavailable++;
                healthCheck.sources[source.id] = 'error';
                // Ошибка при проверке источника
            }
        }
        
        // Завершение проверки доступности
        return healthCheck;
    }

    // Очистка кэша и сброс ошибок
    clearCache() {
        this.cache.clear();
        this.failedSources.clear();
        console.log('🗑️ Кэш очищен, источники сброшены');
    }

    // Функция для загрузки VK постов при выборе типа вакансии
    async loadVKPostsForJobType(jobType) {
        if (!this.vkApi || !jobType) return [];
        
        console.log('📱 Загружаем VK посты для типа вакансии:', jobType);
        try {
            const vkArticles = await this.fetchFromVK(jobType);
            if (vkArticles && vkArticles.length > 0) {
                console.log(`✅ Загружено ${vkArticles.length} VK постов для ${jobType}`);
                return vkArticles;
            }
        } catch (error) {
            console.warn('⚠️ Ошибка загрузки VK постов:', error);
        }
        return [];
    }

    // Функция для загрузки VK постов с фильтрацией по типу вакансии
    async fetchFromVK(jobType = null) {
        if (!this.vkApi) {
            console.warn('VK API не инициализирован');
            return [];
        }
        try {
            console.log('📱 Загружаем посты из VK групп...');
            
            // Получаем группы с учетом фильтра по типу вакансии
            let vkGroups = this.vkApi.groups;
            
            // Добавляем пользовательские VK группы
            const customVkGroups = JSON.parse(localStorage.getItem('custom_vk_groups') || '[]');
            const enabledCustomGroups = customVkGroups.filter(group => group.enabled);
            
            if (enabledCustomGroups.length > 0) {
                vkGroups = [...vkGroups, ...enabledCustomGroups];
                console.log(`📱 Добавлено ${enabledCustomGroups.length} пользовательских VK групп`);
            }
            
            if (jobType && window.CONFIG?.vkGroups) {
                // Фильтруем группы по связанным вакансиям
                const relevantGroups = vkGroups.filter(group => 
                    group.relatedJobs && group.relatedJobs.includes(jobType)
                );
                
                if (relevantGroups.length > 0) {
                    vkGroups = relevantGroups;
                    console.log(`🎯 Фильтрация по типу "${jobType}": ${vkGroups.length} групп`);
                }
            }
            
            const allPosts = [];
            
            // Загружаем по 5 постов из каждой группы
            for (const group of vkGroups) {
                const groupId = group.id || group;
                try {
                    const posts = await this.vkApi.getGroupPosts(groupId, 5);
                    if (posts && posts.length > 0) {
                        const transformed = this.vkApi.transformPosts(posts, groupId);
                        allPosts.push(...transformed);
                        console.log(`✅ VK ${groupId}: ${posts.length} постов`);
                    }
                } catch (error) {
                    console.warn(`⚠️ Ошибка загрузки VK группы ${groupId}:`, error);
                }
            }
            
            console.log(`📱 Всего загружено ${allPosts.length} постов из VK`);
            return allPosts;
        } catch (error) {
            console.error('❌ Ошибка загрузки из VK:', error);
            return [];
        }
    }
    
    // Определение типа вакансии из поискового запроса
    detectJobTypeFromQuery(searchText) {
        if (!searchText || !window.CONFIG?.jobTypes) return null;
        
        const query = searchText.toLowerCase();
        
        // Ищем совпадения с ключевыми словами типов вакансий
        for (const jobType of window.CONFIG.jobTypes) {
            // Проверяем название типа
            if (query.includes(jobType.name.toLowerCase())) {
                return jobType.id;
            }
            
            // Проверяем ключевые слова
            for (const keyword of jobType.keywords) {
                if (query.includes(keyword.toLowerCase())) {
                    return jobType.id;
                }
            }
        }
        
        return null;
    }

    // Получение статистики
    getStats() {
        const stats = {
            totalArticles: this.articles.length,
            sources: this.getActiveSources().length,
            categories: {},
            selectedProfessions: this.selectedProfessions.length,
            failedSources: this.failedSources.size,
            lastUpdate: new Date()
        };
        
        this.articles.forEach(article => {
            const category = article.category || 'general';
            stats.categories[category] = (stats.categories[category] || 0) + 1;
        });
        
        return stats;
    }
}

// Инициализация при загрузке
if (typeof window !== 'undefined') {
    window.RSSAggregator = RSSAggregator;
}
