// VK API Integration для NewsHub
// Получение постов из публичных групп ВКонтакте

class VKApiClient {
    constructor() {
        // Версия VK API
        this.apiVersion = '5.131';
        
        // Базовый URL для API запросов
        this.baseUrl = 'https://api.vk.com/method';
        
        // Список групп для мониторинга (публичные паблики ВК)
        this.groups = [
            { id: 'habr', name: 'Habr', category: 'tech', url: 'https://vk.com/habr' },
            { id: 'techrush', name: 'TechRush', category: 'tech', url: 'https://vk.com/techrush' },
            { id: 'proglib', name: 'Библиотека программиста', category: 'tech', url: 'https://vk.com/proglib' },
            { id: 'devby', name: 'Dev.by', category: 'tech', url: 'https://vk.com/devby' },
            { id: 'tproger', name: 'Типичный программист', category: 'tech', url: 'https://vk.com/tproger' },
            { id: 'vcru', name: 'VC.ru', category: 'business', url: 'https://vk.com/vcru' },
            { id: 'netology', name: 'Нетология', category: 'education', url: 'https://vk.com/netology' },
            { id: 'designpub', name: 'Дизайн', category: 'design', url: 'https://vk.com/designpub' },
            { id: 'yandex', name: 'Яндекс', category: 'tech', url: 'https://vk.com/yandex' },
        ];
        
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 минут
        this.isLoading = false;
        
        // Service Token для VK API
        this.serviceToken = localStorage.getItem('vk_service_token') || 'b497266db497266db497266d25b7ac2746bb497b497266ddc4a0f620a0b8b417e9dc4aa';
    }
    
    /**
     * Получение постов из группы
     * @param {string} groupId - ID или screen_name группы (например, 'habr')
     * @param {number} count - Количество постов (максимум 100)
     * @param {number} offset - Смещение для пагинации
     * @returns {Promise<Array>} Массив постов
     */
    async getGroupPosts(groupId, count = 20, offset = 0) {
        try {
            // ВАЖНО: Для работы с VK API без сервера нужен Service Token
            // или использовать JSONP callback
            // Здесь используем публичный доступ через CORS proxy
            
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
                console.error('VK API Error:', response.error);
                return [];
            }
            
            const posts = response.response?.items || [];
            return this.transformPosts(posts, groupId);
            
        } catch (error) {
            console.error(`Ошибка получения постов из ${groupId}:`, error);
            return [];
        }
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
            
            // Получаем первое изображение если есть
            let image = null;
            if (post.attachments && post.attachments.length > 0) {
                const photoAttachment = post.attachments.find(a => a.type === 'photo');
                if (photoAttachment && photoAttachment.photo) {
                    // Берем максимальное качество
                    const sizes = photoAttachment.photo.sizes || [];
                    const maxSize = sizes.reduce((max, size) => 
                        size.width > (max?.width || 0) ? size : max, null);
                    image = maxSize?.url || null;
                }
            }
            
            // Получаем ссылку на пост
            const postUrl = `https://vk.com/${group.id}?w=wall${post.owner_id}_${post.id}`;
            
            return {
                id: `vk_${group.id}_${post.id}`,
                title: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
                description: text.substring(0, 300) + (text.length > 300 ? '...' : ''),
                link: postUrl,
                image: image,
                publishedAt: new Date(post.date * 1000),
                source: { name: group.name, category: group.category, priority: 99, type: 'vk' },
                category: group.category,
                readingTime: Math.ceil(text.length / 1000), // примерное время чтения
                likes: post.likes?.count || 0,
                views: post.views?.count || 0,
                comments: post.comments?.count || 0,
                isVKPost: true // Флаг для стилизации
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
