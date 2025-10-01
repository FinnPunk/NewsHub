// Конфигурация NewsHub
// Все источники данных, настройки и константы

export const CONFIG = {
    // RSS источники
    rssSources: [
        // Технологические источники (проверенные, прямые RSS)
        { id: 'habr', name: 'Habr', url: 'https://habr.com/ru/rss/hub/programming/', category: 'tech', enabled: true, priority: 1, direct: true },
        { id: 'vc-tech', name: 'VC.ru', url: 'https://vc.ru/rss', category: 'tech', enabled: true, priority: 2, direct: true },
        
        // Международные IT источники
        { id: 'dev-to', name: 'Dev.to', url: 'https://dev.to/feed', category: 'tech', enabled: true, priority: 3 },
        { id: 'github-blog', name: 'GitHub Blog', url: 'https://github.blog/feed/', category: 'tech', enabled: true, priority: 4 },
        
        // Деловые новости
        { id: 'kommersant', name: 'Коммерсантъ', url: 'https://www.kommersant.ru/RSS/news.xml', category: 'business', enabled: true, priority: 5 },
        
        // Общие новости
        { id: 'lenta', name: 'Лента.ру', url: 'https://lenta.ru/rss', category: 'general', enabled: true, priority: 6 },
        { id: 'ria', name: 'РИА Новости', url: 'https://ria.ru/export/rss2/archive/index.xml', category: 'general', enabled: true, priority: 7 },
        
        // Дизайн и UX
        { id: 'smashing', name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', category: 'design', enabled: true, priority: 8 },
        { id: 'css-tricks', name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/', category: 'design', enabled: true, priority: 9 },
        
        // Дополнительные источники
        { id: 'freecodecamp', name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/rss/', category: 'tech', enabled: true, priority: 10 },
        { id: 'hashnode', name: 'Hashnode', url: 'https://hashnode.com/rss', category: 'tech', enabled: true, priority: 11 },
        
        // Отключенные проблемные источники
        { id: 'techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'tech', enabled: false },
        { id: 'wired', name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'tech', enabled: false },
        { id: 'rbc', name: 'РБК', url: 'https://rssexport.rbc.ru/rbcnews/news/20/full.rss', category: 'business', enabled: false },
    ],
    
    // VK группы для мониторинга
    vkGroups: [
        { id: 'habr', name: 'Habr', category: 'tech', url: 'https://vk.com/habr', enabled: true },
        { id: 'techrush', name: 'TechRush', category: 'tech', url: 'https://vk.com/techrush', enabled: true },
        { id: 'proglib', name: 'Библиотека программиста', category: 'tech', url: 'https://vk.com/proglib', enabled: true },
        { id: 'devby', name: 'Dev.by', category: 'tech', url: 'https://vk.com/devby', enabled: true },
        { id: 'tproger', name: 'Типичный программист', category: 'tech', url: 'https://vk.com/tproger', enabled: true },
        { id: 'vcru', name: 'VC.ru', category: 'business', url: 'https://vk.com/vcru', enabled: true },
        { id: 'netology', name: 'Нетология', category: 'education', url: 'https://vk.com/netology', enabled: true },
        { id: 'designpub', name: 'Дизайн', category: 'design', url: 'https://vk.com/designpub', enabled: true },
        { id: 'yandex', name: 'Яндекс', category: 'tech', url: 'https://vk.com/yandex', enabled: true },
    ],
    
    // CORS прокси для обхода блокировок
    corsProxies: [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/',
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://thingproxy.freeboard.io/fetch/'
    ],
    
    // Города для поиска вакансий (HH.ru)
    cities: [
        { id: '1', name: 'Москва' },
        { id: '2', name: 'Санкт-Петербург' },
        { id: '4', name: 'Новосибирск' },
        { id: '88', name: 'Казань' },
        { id: '66', name: 'Нижний Новгород' },
        { id: '78', name: 'Самара' },
        { id: '54', name: 'Екатеринбург' },
        { id: '1146', name: 'Краснодар' },
        { id: '113', name: 'Вся Россия' },
    ],
    
    // Опыт работы
    experienceLevels: [
        { id: 'noExperience', name: 'Нет опыта' },
        { id: 'between1And3', name: 'От 1 до 3 лет' },
        { id: 'between3And6', name: 'От 3 до 6 лет' },
        { id: 'moreThan6', name: 'Более 6 лет' },
    ],
    
    // График работы
    schedules: [
        { id: 'fullDay', name: 'Полный день' },
        { id: 'shift', name: 'Сменный график' },
        { id: 'flexible', name: 'Гибкий график' },
        { id: 'remote', name: 'Удаленная работа' },
        { id: 'flyInFlyOut', name: 'Вахтовый метод' },
    ],
    
    // Тип занятости
    employmentTypes: [
        { id: 'full', name: 'Полная занятость' },
        { id: 'part', name: 'Частичная занятость' },
        { id: 'project', name: 'Проектная работа' },
        { id: 'volunteer', name: 'Волонтерство' },
        { id: 'probation', name: 'Стажировка' },
    ],
    
    // Категории новостей
    categories: [
        { id: 'tech', name: 'Технологии', icon: '💻' },
        { id: 'business', name: 'Бизнес', icon: '💼' },
        { id: 'design', name: 'Дизайн', icon: '🎨' },
        { id: 'education', name: 'Образование', icon: '📚' },
        { id: 'general', name: 'Общее', icon: '📰' },
    ],
    
    // API ключи и токены
    api: {
        vkServiceToken: 'b497266db497266db497266d25b7ac2746bb497b497266ddc4a0f620a0b8b417e9dc4aa',
        vkApiVersion: '5.131',
        vkAppId: 54198571,
        vkRedirectUrl: 'https://newshubforever.netlify.app/',
    },
    
    // Настройки кэширования
    cache: {
        rssTimeout: 15 * 60 * 1000, // 15 минут
        vkTimeout: 10 * 60 * 1000,  // 10 минут
        jobsTimeout: 15 * 60 * 1000, // 15 минут
    },
    
    // Настройки приложения
    app: {
        name: 'NewsHub',
        version: '2.0.0',
        maxArticles: 50,
        defaultUpdateFrequency: 3600000, // 1 час
    }
};

export default CONFIG;
