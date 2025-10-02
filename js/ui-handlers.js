// NewsHub - Обработчики UI событий
// Версия: 2.1.8

// Функция загрузки VK постов для выбранного типа вакансии
async function loadVKPostsForSelectedJobType(jobType) {
    if (!window.rssAggregator || !jobType) return;
    
    console.log(`📱 Загружаем VK посты для выбранного типа: ${jobType}`);
    
    // Устанавливаем состояние загрузки VK
    window.loadingState.setLoading('vk', true);
    
    try {
        const vkPosts = await window.rssAggregator.loadVKPostsForJobType(jobType);
        
        if (vkPosts.length > 0) {
            console.log(`✅ Загружено ${vkPosts.length} VK постов для ${jobType}`);
            
            // Если активна вкладка "VK новости", обновляем её
            const activeFilter = document.querySelector('.filter-chip.active')?.dataset.filter;
            if (activeFilter === 'vk-news') {
                const feedContainer = document.getElementById('feedContainer');
                const vkHTML = vkPosts.map(post => createNewsCard(post)).join('');
                feedContainer.innerHTML = vkHTML;
                
                // Анимация появления
                const cards = feedContainer.querySelectorAll('.news-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            }
            
            // Если активна вкладка "Всё", перезагружаем весь контент
            if (activeFilter === 'all') {
                loadAllContent();
            }
        } else {
            console.log(`ℹ️ Нет VK постов для типа ${jobType}`);
        }
    } catch (error) {
        console.warn('⚠️ Ошибка загрузки VK постов:', error);
    } finally {
        // Сбрасываем состояние загрузки VK
        window.loadingState.setLoading('vk', false);
    }
}

// Оптимизированная функция загрузки всего контента
async function loadAllContent() {
    const feedContainer = document.getElementById('feedContainer');
    const savedFilters = JSON.parse(localStorage.getItem('job_filters') || '{}');
    const jobType = savedFilters.jobType;
    
    let allContent = [];
    let hasRSS = false, hasVK = false, hasJobs = false;
    
    // Определяем что нужно загружать
    if (window.rssAggregator) hasRSS = true;
    if (jobType && window.rssAggregator) hasVK = true;
    if (window.hhApi) hasJobs = true;
    
    // Устанавливаем состояния загрузки
    window.loadingState.setLoading('rss', hasRSS);
    window.loadingState.setLoading('vk', hasVK);
    window.loadingState.setLoading('jobs', hasJobs);
    
    try {
        // 1. Загружаем RSS новости
        if (hasRSS) {
            console.log('📰 Загружаем RSS новости...');
            const rssNews = await window.rssAggregator.aggregateNews();
            allContent = [...allContent, ...rssNews];
            console.log(`✅ Загружено ${rssNews.length} RSS новостей`);
            window.loadingState.setLoading('rss', false);
        }
        
        // 2. Загружаем VK посты
        if (hasVK) {
            console.log(`📱 Загружаем VK посты для типа: ${jobType}`);
            const vkPosts = await window.rssAggregator.loadVKPostsForJobType(jobType);
            allContent = [...allContent, ...vkPosts];
            console.log(`✅ Загружено ${vkPosts.length} VK постов`);
            window.loadingState.setLoading('vk', false);
        }
        
        // 3. Загружаем вакансии
        if (hasJobs) {
            console.log('💼 Загружаем вакансии...');
            const jobsData = await window.hhApi.searchVacancies({
                text: jobType ? window.CONFIG.jobTypes.find(j => j.id === jobType)?.name || '' : '',
                area: savedFilters.city || '1',
                per_page: 20
            });
            const jobs = window.hhApi.transformVacancies(jobsData.items || []);
            allContent = [...allContent, ...jobs];
            console.log(`✅ Загружено ${jobs.length} вакансий`);
            window.loadingState.setLoading('jobs', false);
        }
        
        // Отображаем весь контент
        if (allContent.length > 0) {
            displayMixedContent(allContent);
            console.log(`🎉 Всего загружено ${allContent.length} элементов`);
        } else {
            feedContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <h3>😔 Нет контента</h3>
                    <p>Не удалось загрузить новости и вакансии</p>
                    <button class="btn btn--primary" onclick="loadAllContent()">Повторить</button>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки контента:', error);
        window.loadingState.setLoading('rss', false);
        window.loadingState.setLoading('vk', false);
        window.loadingState.setLoading('jobs', false);
        
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h3>⚠️ Ошибка загрузки</h3>
                <p>Попробуйте еще раз</p>
                <button class="btn btn--primary" onclick="loadAllContent()">Повторить</button>
            </div>
        `;
    }
}

// Функция отображения смешанного контента
function displayMixedContent(items) {
    const feedContainer = document.getElementById('feedContainer');
    if (!feedContainer || !items.length) return;
    
    // Сортируем по дате (новые сначала)
    const sortedItems = items.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.published_at || 0);
        const dateB = new Date(b.publishedAt || b.published_at || 0);
        return dateB - dateA;
    });
    
    const html = sortedItems.map(item => {
        if (item.type === 'job') {
            return createJobCard(item);
        } else {
            return createNewsCard(item);
        }
    }).join('');
    
    feedContainer.innerHTML = html;
    
    // Анимация появления
    const cards = feedContainer.querySelectorAll('.news-card, .job-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Применение быстрого фильтра
function applyQuickFilter(filter) {
    const feedContainer = document.getElementById('feedContainer');
    
    console.log('🔄 Применение фильтра:', filter);
    
    // Для вакансий - загружаем через API
    if (filter === 'jobs') {
        console.log('💼 Загрузка вакансий...');
        
        // Сохраняем текущие новости перед загрузкой вакансий
        if (!window.cachedNewsHTML) {
            window.cachedNewsHTML = feedContainer.innerHTML;
        }
        
        // Вызываем loadJobsWithFilters
        if (typeof window.loadJobsWithFilters === 'function') {
            console.log('✅ loadJobsWithFilters найдена, вызываем');
            window.loadJobsWithFilters(false);
        } else {
            console.error('❌ loadJobsWithFilters не найдена!');
            feedContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <h3>⚠️ Ошибка</h3>
                    <p>Функция загрузки вакансий не инициализирована</p>
                    <button class="btn btn--primary" onclick="location.reload()">Перезагрузить</button>
                </div>
            `;
        }
        return;
    }
    
    // Для "Новости" - показываем только RSS новости
    if (filter === 'news') {
        if (window.cachedNewsHTML) {
            feedContainer.innerHTML = window.cachedNewsHTML;
        }
        // Показываем только RSS новости (не VK)
        const articles = feedContainer.querySelectorAll('.news-card');
        articles.forEach(article => {
            const sourceType = article.dataset.sourceType;
            if (sourceType !== 'vk' && !article.classList.contains('job-card')) {
                article.style.display = 'block';
                article.style.animation = 'fadeInUp 0.3s ease';
            } else {
                article.style.display = 'none';
            }
        });
        return;
    }
    
    // Для "Новости из ВК" - показываем только VK посты
    if (filter === 'vk-news') {
        if (window.cachedNewsHTML) {
            feedContainer.innerHTML = window.cachedNewsHTML;
        }
        // Показываем только VK новости
        const articles = feedContainer.querySelectorAll('.news-card');
        let vkCount = 0;
        articles.forEach(article => {
            const sourceType = article.dataset.sourceType;
            if (sourceType === 'vk') {
                article.style.display = 'block';
                article.style.animation = 'fadeInUp 0.3s ease';
                vkCount++;
            } else {
                article.style.display = 'none';
            }
        });
        
        // Если нет VK постов, показываем сообщение
        if (vkCount === 0) {
            feedContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <h3>📱 Новости из ВК загружаются...</h3>
                    <p>Посты из VK групп появятся автоматически при загрузке новостей</p>
                </div>
            `;
        }
        return;
    }
    
    // Для "Все" - показываем RSS, VK и вакансии поочередно
    if (filter === 'all') {
        loadAllContent();
        return;
    }
}

// Функция поиска (RSS новости + VK посты + вакансии)
async function performSearch(query) {
    const feedContainer = document.getElementById('feedContainer');
    
    // Показываем загрузку
    feedContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div class="spinner"></div>
            <h3>Поиск "${query}"...</h3>
            <p>Ищем в RSS новостях, VK постах и вакансиях</p>
        </div>
    `;
    
    let rssResults = [];
    let vkResults = [];
    let jobsResults = [];
    
    // Поиск в RSS новостях
    if (window.rssAggregator) {
        rssResults = window.rssAggregator.searchArticles(query);
    }
    
    // Поиск в VK постах (определяем тип вакансии из запроса)
    if (window.rssAggregator) {
        try {
            const jobType = window.rssAggregator.detectJobTypeFromQuery(query);
            if (jobType) {
                console.log(`🔍 Определен тип вакансии для поиска: ${jobType}`);
                const vkPosts = await window.rssAggregator.loadVKPostsForJobType(jobType);
                // Фильтруем VK посты по запросу
                vkResults = vkPosts.filter(post => 
                    post.title.toLowerCase().includes(query.toLowerCase()) ||
                    post.description.toLowerCase().includes(query.toLowerCase())
                );
            }
        } catch (error) {
            console.warn('Ошибка поиска в VK:', error);
        }
    }
    
    // Поиск вакансий на HH.ru
    if (window.hhApi) {
        try {
            const hhResults = await window.hhApi.searchVacancies({
                text: query,
                per_page: 20
            });
            jobsResults = window.hhApi.transformVacancies(hhResults.items || []);
        } catch (error) {
            console.error('Ошибка поиска вакансий:', error);
        }
    }
    
    const totalResults = rssResults.length + vkResults.length + jobsResults.length;
    
    if (totalResults > 0) {
        displaySearchResults([...rssResults, ...vkResults], jobsResults, query);
        console.log(`🔍 Найдено: ${rssResults.length} RSS, ${vkResults.length} VK, ${jobsResults.length} вакансий`);
    } else {
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h3>Ничего не найдено</h3>
                <p>По запросу "${query}" не найдено результатов</p>
                <button class="btn btn--primary" onclick="clearSearchResults()">Вернуться к ленте</button>
            </div>
        `;
    }
}

// Экспорт функций для глобального доступа
window.loadVKPostsForSelectedJobType = loadVKPostsForSelectedJobType;
window.loadAllContent = loadAllContent;
window.displayMixedContent = displayMixedContent;
window.applyQuickFilter = applyQuickFilter;
window.performSearch = performSearch;

export {
    loadVKPostsForSelectedJobType,
    loadAllContent,
    displayMixedContent,
    applyQuickFilter,
    performSearch
};
