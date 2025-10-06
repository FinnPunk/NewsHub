// VK API Integration для NewsHub
// Получение постов из публичных групп ВКонтакте

class VKApiClient {
    constructor() {
        // Версия VK API
        this.apiVersion = '5.131';
        
        // Базовый URL для API запросов
        this.baseUrl = 'https://api.vk.com/method';
        
        // Список групп берется из CONFIG при инициализации
        // Если CONFIG еще не загружен, используем базовый набор
        this.groups = window.CONFIG?.vkGroups || [
            { id: 'habr', name: 'Habr', category: 'tech', url: 'https://vk.com/habr' },
            { id: 'tproger', name: 'Типичный программист', category: 'tech', url: 'https://vk.com/tproger' },
            { id: 'proglib', name: 'Библиотека программиста', category: 'tech', url: 'https://vk.com/proglib' },
        ];
        
        console.log(`📱 VK API инициализирован с ${this.groups.length} группами`);
        
        // Обновляем группы когда CONFIG загрузится
        this.updateGroupsFromConfig();
        
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 минут
        this.isLoading = false;
        
        // Управление частотой запросов
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.requestDelay = 350; // 350мс между запросами (VK лимит ~3 запроса в секунду)
        
        // Service Token для VK API
        this.serviceToken = localStorage.getItem('vk_service_token') || 'b497266db497266db497266d25b7ac2746bb497b497266ddc4a0f620a0b8b417e9dc4aa';
    }
    
    /**
     * Обновление групп из CONFIG
     */
    updateGroupsFromConfig() {
        // Проверяем каждые 100мс, загрузился ли CONFIG
        const checkConfig = () => {
            if (window.CONFIG?.vkGroups && window.CONFIG.vkGroups.length > this.groups.length) {
                console.log(`📱 Обновляем VK группы из CONFIG: ${this.groups.length} → ${window.CONFIG.vkGroups.length}`);
                this.groups = window.CONFIG.vkGroups;
                
                // Уведомляем RSS Aggregator об обновлении
                if (window.rssAggregator) {
                    window.rssAggregator.vkApi = this;
                }
            } else if (!window.CONFIG) {
                // CONFIG еще не загружен, проверяем снова
                setTimeout(checkConfig, 100);
            }
        };
        
        checkConfig();
    }
    
    /**
     * Добавление запроса в очередь для контроля частоты
     */
    async queueRequest(requestFunction) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                execute: requestFunction,
                resolve: resolve,
                reject: reject
            });
            
            this.processQueue();
        });
    }
    
    /**
     * Обработка очереди запросов с задержками
     */
    async processQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }
        
        this.isProcessingQueue = true;
        
        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            
            try {
                const result = await request.execute();
                request.resolve(result);
            } catch (error) {
                request.reject(error);
            }
            
            // Задержка между запросами для соблюдения лимитов VK API
            if (this.requestQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, this.requestDelay));
            }
        }
        
        this.isProcessingQueue = false;
    }
    
    /**
     * Получение постов из группы
     * @param {string} groupId - ID или screen_name группы (например, 'habr')
     * @param {number} count - Количество постов (максимум 100)
     * @param {number} offset - Смещение для пагинации
     * @returns {Promise<Array>} Массив постов
     */
    async getGroupPosts(groupId, count = 20, offset = 0) {
        // Проверяем кеш
        const cacheKey = `${groupId}_${count}_${offset}`;
        const cached = this.cache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            console.log(`📱 Используем кешированные данные для ${groupId}`);
            return cached.data;
        }
        
        // Добавляем запрос в очередь для контроля частоты
        return this.queueRequest(async () => {
            try {
                console.log(`📱 Запрашиваем посты из ${groupId} (очередь: ${this.requestQueue.length})`);
                
                const params = new URLSearchParams({
                    domain: groupId,          // screen_name группы
                    count: count,
                    offset: offset,
                    filter: 'owner',          // только посты владельца
                    access_token: this.serviceToken,  // Service Token
                    v: this.apiVersion
                });
                
                // Используем JSONP для обхода CORS
                const response = await this.jsonpRequest(
                    `${this.baseUrl}/wall.get?${params.toString()}`
                );
            
            if (response.error) {
                const errorCode = response.error.error_code;
                const errorMsg = response.error.error_msg;
                
                if (errorCode === 100) {
                    console.warn(`⚠️ Группа "${groupId}" не найдена или недоступна`);
                } else if (errorCode === 15) {
                    console.warn(`⚠️ Доступ к группе "${groupId}" запрещен`);
                } else {
                    console.error(`❌ VK API Error для "${groupId}":`, errorMsg);
                }
                return [];
            }
            
                const posts = response.response?.items || [];
                const transformedPosts = this.transformPosts(posts, groupId);
                
                // Кешируем результат
                this.cache.set(cacheKey, {
                    data: transformedPosts,
                    timestamp: Date.now()
                });
                
                return transformedPosts;
                
            } catch (error) {
                console.error(`❌ Ошибка получения постов из ${groupId}:`, error);
                return [];
            }
        });
    }
    
    /**
     * JSONP запрос для обхода CORS
     */
    jsonpRequest(url) {
        return new Promise((resolve, reject) => {
            const callbackName = `vk_callback_${Date.now()}`;
            
            window[callbackName] = (data) => {
                delete window[callbackName];
                document.body.removeChild(script);
                resolve(data);
            };
            
            const script = document.createElement('script');
            script.src = `${url}&callback=${callbackName}`;
            script.onerror = () => {
                delete window[callbackName];
                document.body.removeChild(script);
                reject(new Error('JSONP request failed'));
            };
            
            document.body.appendChild(script);
            
            // Timeout через 10 секунд
            setTimeout(() => {
                if (window[callbackName]) {
                    delete window[callbackName];
                    document.body.removeChild(script);
                    reject(new Error('JSONP request timeout'));
                }
            }, 10000);
        });
    }
    
    /**
     * Трансформация постов VK в формат NewsHub
     */
    transformPosts(posts, groupId) {
        const group = this.groups.find(g => g.id === groupId) || { name: groupId, category: 'general' };
        
        return posts.map(post => {
            // Получаем текст поста
            let text = post.text || '';
            
            // Получаем все изображения из поста
            let image = null;
            let images = [];
            try {
                if (post.attachments && Array.isArray(post.attachments) && post.attachments.length > 0) {
                    const photoAttachments = post.attachments.filter(a => a && a.type === 'photo');
                    
                    if (photoAttachments.length > 0) {
                        photoAttachments.forEach(photoAttachment => {
                            if (photoAttachment.photo) {
                                const photo = photoAttachment.photo;
                                let photoUrl = null;
                                
                                // Пробуем разные варианты получения изображения
                                if (photo.sizes && Array.isArray(photo.sizes) && photo.sizes.length > 0) {
                                    // Берем максимальное качество
                                    const maxSize = photo.sizes.reduce((max, size) => {
                                        if (!size || !size.width || !size.url) return max;
                                        return size.width > (max?.width || 0) ? size : max;
                                    }, null);
                                    photoUrl = maxSize?.url || null;
                                } else if (photo.photo_604) {
                                    photoUrl = photo.photo_604;
                                } else if (photo.photo_320) {
                                    photoUrl = photo.photo_320;
                                } else if (photo.photo_130) {
                                    photoUrl = photo.photo_130;
                                }
                                
                                if (photoUrl) {
                                    images.push(photoUrl);
                                    // Первое изображение становится основным
                                    if (!image) {
                                        image = photoUrl;
                                    }
                                }
                            }
                        });
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Ошибка обработки изображений для поста ${post.id}:`, error);
            }
            
            // Получаем ссылку на пост
            const postUrl = `https://vk.com/${group.id}?w=wall${post.owner_id}_${post.id}`;
            
            return {
                id: `vk_${group.id}_${post.id}`,
                title: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
                description: text.substring(0, 300) + (text.length > 300 ? '...' : ''),
                text: text, // Полный текст поста
                link: postUrl,
                url: postUrl, // Дублируем для совместимости
                image: image,
                photo: image, // Дублируем для совместимости
                images: images, // Массив всех изображений
                publishedAt: new Date(post.date * 1000),
                publishedDate: new Date(post.date * 1000).toISOString(), // Для совместимости
                date: new Date(post.date * 1000), // Для совместимости
                source: group.name,
                sourceType: 'vk',
                category: group.category,
                readingTime: Math.ceil(text.length / 1000),
                likes: post.likes?.count || 0,
                views: post.views?.count || 0,
                comments: post.comments?.count || 0,
                isVKPost: true,
                owner_id: post.owner_id, // Сохраняем оригинальные ID
                groupName: group.name
            };
        });
    }
    
    /**
     * Извлекаем заголовок из текста (первая строка или первые N символов)
     */
    extractTitle(text) {
        if (!text) return 'Без заголовка';
        
        // Берем первую строку до переноса
        const firstLine = text.split('\n')[0];
        
        // Ограничиваем длину
        return firstLine.length > 100 
            ? firstLine.substring(0, 100) + '...' 
            : firstLine || 'Без заголовка';
    }
    
    /**
     * Очищаем текст от лишних символов
     */
    cleanText(text) {
        return text
            .replace(/\[.*?\|.*?\]/g, '') // Удаляем VK mentions [id123|Name]
            .replace(/#\S+/g, '')         // Удаляем хештеги
            .substring(0, 300)            // Ограничиваем длину
            .trim();
    }
    
    /**
     * Получение постов из всех настроенных групп
     */
    async fetchAllPosts(count = 10) {
        if (this.isLoading) {
            console.log('VK API: Загрузка уже идет');
            return [];
        }
        
        this.isLoading = true;
        const allPosts = [];
        
        try {
            // Загружаем посты из каждой группы с задержкой (rate limiting)
            for (const group of this.groups) {
                try {
                    const posts = await this.getGroupPosts(group.id, count);
                    allPosts.push(...posts);
                    
                    // Задержка между запросами (VK ограничивает до 3 req/sec)
                    await this.delay(350);
                    
                } catch (error) {
                    console.error(`Ошибка загрузки из ${group.name}:`, error);
                }
            }
            
            // Сортируем по дате
            allPosts.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );
            
            return allPosts;
            
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * Задержка для rate limiting
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Поиск постов по ключевым словам
     */
    async searchPosts(query, count = 20) {
        // VK API метод wall.search (требует access_token)
        // Альтернатива: фильтровать локально полученные посты
        
        const allPosts = await this.fetchAllPosts(50);
        
        return allPosts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, count);
    }
    
    /**
     * Добавление пользовательской группы
     */
    addGroup(groupId, name, category = 'general') {
        this.groups.push({ id: groupId, name, category });
        this.saveGroups();
    }
    
    /**
     * Удаление группы
     */
    removeGroup(groupId) {
        this.groups = this.groups.filter(g => g.id !== groupId);
        this.saveGroups();
    }
    
    /**
     * Сохранение списка групп
     */
    saveGroups() {
        try {
            localStorage.setItem('vk_groups', JSON.stringify(this.groups));
        } catch (error) {
            console.error('Ошибка сохранения групп VK:', error);
        }
    }
    
    /**
     * Загрузка сохраненных групп
     */
    loadGroups() {
        try {
            const saved = localStorage.getItem('vk_groups');
            if (saved) {
                this.groups = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Ошибка загрузки групп VK:', error);
        }
    }
    
    /**
     * Получение статистики
     */
    getStats() {
        return {
            totalGroups: this.groups.length,
            enabledGroups: this.groups.length,
            categories: [...new Set(this.groups.map(g => g.category))]
        };
    }
}

export default VKApiClient;
