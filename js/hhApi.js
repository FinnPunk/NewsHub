// HeadHunter API Integration для NewsHub
// Получение вакансий из hh.ru через их Open API

class HHApiClient {
    constructor() {
        // Базовый URL API
        this.baseUrl = 'https://api.hh.ru';
        
        // User-Agent обязателен для HH API
        this.userAgent = 'NewsHub/1.0 (kostapogrebnakov@example.com)';
        
        // Популярные IT специальности для быстрого доступа
        this.popularProfessions = [
            { id: 'developer', name: 'Разработчик', keywords: ['developer', 'программист', 'software engineer'] },
            { id: 'frontend', name: 'Frontend разработчик', keywords: ['frontend', 'react', 'vue', 'angular'] },
            { id: 'backend', name: 'Backend разработчик', keywords: ['backend', 'node.js', 'python', 'java'] },
            { id: 'fullstack', name: 'Fullstack разработчик', keywords: ['fullstack', 'full stack', 'full-stack'] },
            { id: 'designer', name: 'Дизайнер', keywords: ['designer', 'дизайнер', 'UI/UX'] },
            { id: 'qa', name: 'Тестировщик', keywords: ['qa', 'tester', 'тестировщик'] },
            { id: 'devops', name: 'DevOps инженер', keywords: ['devops', 'kubernetes', 'docker'] },
            { id: 'analyst', name: 'Аналитик данных', keywords: ['data analyst', 'аналитик данных'] },
            { id: 'pm', name: 'Менеджер проектов', keywords: ['project manager', 'менеджер проектов'] },
            { id: 'marketing', name: 'Маркетолог', keywords: ['marketing', 'маркетолог', 'smm'] }
        ];
        
        // Кэш запросов
        this.cache = new Map();
        this.cacheTimeout = 15 * 60 * 1000; // 15 минут
        
        this.isLoading = false;
    }
    
    /**
     * Поиск вакансий
     * @param {Object} params - Параметры поиска
     * @returns {Promise<Object>} Результаты поиска
     */
    async searchVacancies(params = {}) {
        try {
            // Параметры по умолчанию
            const defaultParams = {
                text: '',                    // Поисковый запрос
                area: 1,                     // 1 = Москва, 2 = Санкт-Петербург
                per_page: 20,                // Количество вакансий на странице (макс 100)
                page: 0,                     // Номер страницы
                period: 30,                  // За сколько дней (1-30)
                order_by: 'publication_time', // Сортировка: publication_time, salary_desc, salary_asc
                search_field: 'name',        // Где искать: name, company_name, description
                employment: undefined,       // full, part, project, volunteer, probation
                experience: undefined,       // noExperience, between1And3, between3And6, moreThan6
                schedule: undefined          // fullDay, shift, flexible, remote, flyInFlyOut
            };
            
            const searchParams = { ...defaultParams, ...params };
            
            // Проверяем кэш
            const cacheKey = JSON.stringify(searchParams);
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheTimeout) {
                    console.log('HH API: Используем кэш');
                    return cached.data;
                }
            }
            
            // Формируем URL
            const queryString = new URLSearchParams(
                Object.entries(searchParams).filter(([_, v]) => v !== undefined)
            ).toString();
            
            const url = `${this.baseUrl}/vacancies?${queryString}`;
            
            // Делаем запрос
            const response = await fetch(url, {
                headers: {
                    'User-Agent': this.userAgent
                }
            });
            
            if (!response.ok) {
                throw new Error(`HH API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Сохраняем в кэш
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
            
        } catch (error) {
            console.error('Ошибка поиска вакансий HH:', error);
            throw error;
        }
    }
    
    /**
     * Получение детальной информации о вакансии
     * @param {string} vacancyId - ID вакансии
     * @returns {Promise<Object>} Детали вакансии
     */
    async getVacancyDetails(vacancyId) {
        try {
            const cacheKey = `vacancy_${vacancyId}`;
            
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheTimeout) {
                    return cached.data;
                }
            }
            
            const url = `${this.baseUrl}/vacancies/${vacancyId}`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': this.userAgent
                }
            });
            
            if (!response.ok) {
                throw new Error(`HH API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
            
        } catch (error) {
            console.error(`Ошибка получения вакансии ${vacancyId}:`, error);
            throw error;
        }
    }
    
    /**
     * Трансформация вакансий в формат NewsHub
     */
    transformVacancies(vacancies) {
        return vacancies.map(vacancy => {
            // Форматируем зарплату
            let salary = 'Не указана';
            if (vacancy.salary) {
                const { from, to, currency } = vacancy.salary;
                const currencySymbol = this.getCurrencySymbol(currency);
                
                if (from && to) {
                    salary = `${from.toLocaleString('ru-RU')}–${to.toLocaleString('ru-RU')} ${currencySymbol}`;
                } else if (from) {
                    salary = `от ${from.toLocaleString('ru-RU')} ${currencySymbol}`;
                } else if (to) {
                    salary = `до ${to.toLocaleString('ru-RU')} ${currencySymbol}`;
                }
            }
            
            // Получаем требования
            const requirements = vacancy.snippet?.requirement 
                ? this.cleanHtml(vacancy.snippet.requirement)
                : 'Не указаны';
            
            // Получаем обязанности
            const responsibility = vacancy.snippet?.responsibility
                ? this.cleanHtml(vacancy.snippet.responsibility)
                : '';
            
            return {
                id: `hh_${vacancy.id}`,
                title: vacancy.name,
                company: vacancy.employer?.name || 'Не указана',
                companyLogo: vacancy.employer?.logo_urls?.['90'] || null,
                salary: salary,
                salaryFrom: vacancy.salary?.from || null,
                salaryTo: vacancy.salary?.to || null,
                location: vacancy.area?.name || 'Не указано',
                experience: vacancy.experience?.name || 'Не указан',
                employment: vacancy.employment?.name || 'Не указана',
                schedule: vacancy.schedule?.name || 'Не указан',
                requirements: requirements,
                responsibility: responsibility,
                description: `${requirements} ${responsibility}`.trim(),
                url: vacancy.alternate_url,
                publishedAt: vacancy.published_at,
                category: 'jobs',
                sourceType: 'hh',
                source: 'HeadHunter'
            };
        });
    }
    
    /**
     * Символ валюты
     */
    getCurrencySymbol(currency) {
        const symbols = {
            'RUR': '₽',
            'RUB': '₽',
            'USD': '$',
            'EUR': '€',
            'KZT': '₸',
            'UAH': '₴',
            'BYR': 'Br'
        };
        return symbols[currency] || currency;
    }
    
    /**
     * Очистка HTML тегов
     */
    cleanHtml(html) {
        return html
            .replace(/<highlighttext>/g, '')
            .replace(/<\/highlighttext>/g, '')
            .replace(/<[^>]*>/g, '')
            .trim();
    }
    
    /**
     * Поиск вакансий по профессии
     */
    async searchByProfession(professionKeywords, area = 1, page = 0) {
        // Формируем поисковый запрос из ключевых слов
        const text = Array.isArray(professionKeywords) 
            ? professionKeywords.join(' OR ')
            : professionKeywords;
        
        const results = await this.searchVacancies({
            text: text,
            area: area,
            per_page: 20,
            page: page,
            period: 7, // За последнюю неделю
            order_by: 'publication_time'
        });
        
        return {
            ...results,
            items: this.transformVacancies(results.items || [])
        };
    }
    
    /**
     * Получение вакансий для всех популярных профессий
     */
    async fetchPopularVacancies(perProfession = 5) {
        if (this.isLoading) {
            console.log('HH API: Загрузка уже идет');
            return [];
        }
        
        this.isLoading = true;
        const allVacancies = [];
        
        try {
            // Загружаем вакансии для каждой профессии
            for (const profession of this.popularProfessions) {
                try {
                    const results = await this.searchByProfession(
                        profession.keywords,
                        1, // Москва
                        0
                    );
                    
                    // Берем первые N вакансий
                    const vacancies = results.items.slice(0, perProfession);
                    allVacancies.push(...vacancies);
                    
                    // Небольшая задержка между запросами (good practice)
                    await this.delay(100);
                    
                } catch (error) {
                    console.error(`Ошибка загрузки вакансий для ${profession.name}:`, error);
                }
            }
            
            // Сортируем по дате публикации
            allVacancies.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );
            
            return allVacancies;
            
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * Получение вакансий с удаленной работой
     */
    async searchRemoteVacancies(text = '', page = 0) {
        const results = await this.searchVacancies({
            text: text,
            per_page: 20,
            page: page,
            schedule: 'remote',
            period: 7,
            order_by: 'publication_time'
        });
        
        return {
            ...results,
            items: this.transformVacancies(results.items || [])
        };
    }
    
    /**
     * Получение вакансий для начинающих (без опыта)
     */
    async searchJuniorVacancies(text = '', page = 0) {
        const results = await this.searchVacancies({
            text: text,
            per_page: 20,
            page: page,
            experience: 'noExperience',
            period: 7,
            order_by: 'publication_time'
        });
        
        return {
            ...results,
            items: this.transformVacancies(results.items || [])
        };
    }
    
    /**
     * Получение списка регионов
     */
    async getAreas() {
        try {
            const url = `${this.baseUrl}/areas`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': this.userAgent
                }
            });
            
            if (!response.ok) {
                throw new Error(`HH API Error: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Ошибка получения регионов HH:', error);
            return [];
        }
    }
    
    /**
     * Получение справочников (словарей)
     */
    async getDictionaries() {
        try {
            const url = `${this.baseUrl}/dictionaries`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': this.userAgent
                }
            });
            
            if (!response.ok) {
                throw new Error(`HH API Error: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Ошибка получения справочников HH:', error);
            return null;
        }
    }
    
    /**
     * Задержка для rate limiting
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Получение статистики
     */
    getStats() {
        return {
            cacheSize: this.cache.size,
            isLoading: this.isLoading,
            popularProfessions: this.popularProfessions.length
        };
    }
    
    /**
     * Очистка кэша
     */
    clearCache() {
        this.cache.clear();
        console.log('HH API: Кэш очищен');
    }
}

export default HHApiClient;
