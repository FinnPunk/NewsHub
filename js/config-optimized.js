// NewsHub - Оптимизированная конфигурация
// Убраны дублирования, сжаты структуры данных

export const CONFIG = {
    // Только активные RSS источники
    rssSources: [
        { id: 'habr', name: 'Habr', url: 'https://habr.com/ru/rss/hub/programming/', category: 'tech', enabled: true, priority: 1 },
        { id: 'vc-tech', name: 'VC.ru', url: 'https://vc.ru/rss', category: 'tech', enabled: true, priority: 2 }
    ],
    
    // Сжатые VK группы (только используемые)
    vkGroups: [
        { id: 'habr', name: 'Habr', category: 'tech', relatedJobs: ['frontend_developer', 'backend_developer', 'full_stack_developer', 'devops_engineer'] },
        { id: 'tproger', name: 'Типичный программист', category: 'tech', relatedJobs: ['frontend_developer', 'backend_developer', 'full_stack_developer'] },
        { id: 'proglib', name: 'Библиотека программиста', category: 'tech', relatedJobs: ['frontend_developer', 'backend_developer', 'copywriter'] },
        { id: 'designpub', name: 'Designpub', category: 'design', relatedJobs: ['ui_ux_designer', 'graphic_designer'] },
        { id: 'netology', name: 'Нетология', category: 'education', relatedJobs: ['teacher', 'mentor'] }
    ],
    
    // Основные города
    cities: [
        { id: '1', name: 'Москва' },
        { id: '2', name: 'Санкт-Петербург' },
        { id: '4', name: 'Новосибирск' },
        { id: '88', name: 'Казань' }
    ],
    
    // Сжатые типы вакансий
    jobTypes: [
        { id: 'frontend_developer', name: 'Frontend разработчик', category: 'it' },
        { id: 'backend_developer', name: 'Backend разработчик', category: 'it' },
        { id: 'full_stack_developer', name: 'Fullstack разработчик', category: 'it' },
        { id: 'ui_ux_designer', name: 'UI/UX дизайнер', category: 'design' },
        { id: 'graphic_designer', name: 'Графический дизайнер', category: 'design' },
        { id: 'project_manager', name: 'Project Manager', category: 'management' },
        { id: 'marketing_manager', name: 'Маркетинг менеджер', category: 'marketing' }
    ],
    
    // Категории
    jobCategories: [
        { id: 'it', name: '💻 IT & Технологии' },
        { id: 'design', name: '🎨 Дизайн' },
        { id: 'management', name: '👔 Менеджмент' },
        { id: 'marketing', name: '📢 Маркетинг' }
    ],
    
    // API настройки
    api: {
        hhBaseUrl: 'https://api.hh.ru',
        vkApiVersion: '5.131',
        vkServiceToken: 'vk1.a.your_service_token_here'
    },
    
    // Кеширование
    cache: {
        rssTimeout: 900000, // 15 минут
        vkTimeout: 600000,  // 10 минут
        jobsTimeout: 900000 // 15 минут
    },
    
    // Приложение
    app: {
        name: 'NewsHub',
        version: '2.1.8',
        maxArticles: 50
    }
};

export default CONFIG;
