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
    
    // VK группы для мониторинга с привязкой к вакансиям (полная база из jobs_groups_updated.js)
    vkGroups: [
        // Универсальные IT группы
        { id: 'habr', name: 'Habr', category: 'tech', url: 'https://vk.com/habr', enabled: true, relatedJobs: ['frontend_developer', 'backend_developer', 'full_stack_developer', 'devops_engineer', 'mobile_developer', 'data_scientist', 'machine_learning_engineer', 'qa_engineer'] },
        { id: 'tproger', name: 'Типичный программист', category: 'tech', url: 'https://vk.com/tproger', enabled: true, relatedJobs: ['frontend_developer', 'backend_developer', 'full_stack_developer', 'mobile_developer', 'game_developer', 'software_engineer'] },
        { id: 'proglib', name: 'Библиотека программиста', category: 'tech', url: 'https://vk.com/proglib', enabled: true, relatedJobs: ['frontend_developer', 'backend_developer', 'full_stack_developer', 'copywriter', 'technical_writer'] },
        { id: 'bookflow', name: 'BookFlow', category: 'tech', url: 'https://vk.com/bookflow', enabled: true, relatedJobs: ['frontend_developer', 'backend_developer', 'full_stack_developer', 'business_analyst', 'retail_manager'] },
        { id: 'yandex', name: 'Яндекс', category: 'tech', url: 'https://vk.com/yandex', enabled: true, relatedJobs: ['frontend_developer', 'backend_developer', 'data_scientist', 'machine_learning_engineer', 'devops_engineer', 'support_specialist'] },
        
        // Frontend специфичные
        { id: 'webstandards_ru', name: 'Web Standards', category: 'tech', url: 'https://vk.com/webstandards_ru', enabled: true, relatedJobs: ['frontend_developer', 'web_designer', 'photographer'] },
        { id: 'css_live', name: 'CSS Live', category: 'tech', url: 'https://vk.com/css_live', enabled: true, relatedJobs: ['frontend_developer', 'accountant', 'psychologist'] },
        { id: 'loftblog', name: 'Loftblog', category: 'tech', url: 'https://vk.com/loftblog', enabled: true, relatedJobs: ['frontend_developer', 'event_manager', 'mathematician'] },
        { id: 'frontend_and_backend', name: 'Frontend & Backend', category: 'tech', url: 'https://vk.com/frontend_and_backend', enabled: true, relatedJobs: ['frontend_developer', 'backend_developer', 'graphic_designer'] },
        { id: 'verstka_html', name: 'Верстка HTML', category: 'tech', url: 'https://vk.com/verstka_html', enabled: true, relatedJobs: ['frontend_developer', 'journalist'] },
        { id: 'let_us_code', name: 'Let Us Code', category: 'tech', url: 'https://vk.com/let_us_code', enabled: true, relatedJobs: ['frontend_developer', 'web_designer'] },
        { id: 'webyroki_ru', name: 'Веб-уроки', category: 'education', url: 'https://vk.com/webyroki_ru', enabled: true, relatedJobs: ['frontend_developer', 'consultant'] },
        
        // Backend/DevOps/System
        { id: 'devnull', name: '/dev/null', category: 'tech', url: 'https://vk.com/devnull', enabled: true, relatedJobs: ['backend_developer', 'devops_engineer', 'system_administrator', 'veterinarian'] },
        { id: 'devops', name: 'DevOps', category: 'tech', url: 'https://vk.com/devops', enabled: true, relatedJobs: ['devops_engineer', 'system_administrator', 'interior_designer'] },
        { id: 'coders_stuff', name: 'Coders Stuff', category: 'tech', url: 'https://vk.com/coders_stuff', enabled: true, relatedJobs: ['backend_developer', 'video_editor'] },
        { id: 'devcolibri', name: 'DevColibri', category: 'tech', url: 'https://vk.com/devcolibri', enabled: true, relatedJobs: ['backend_developer', 'analyst'] },
        { id: 'it_town', name: 'IT Town', category: 'tech', url: 'https://vk.com/it_town', enabled: true, relatedJobs: ['backend_developer', 'sales_associate'] },
        { id: 'techiespro', name: 'TechiesPro', category: 'tech', url: 'https://vk.com/techiespro', enabled: true, relatedJobs: ['backend_developer', 'customer_service'] },
        
        // Data Science & ML & Analytics
        { id: 'data_science', name: 'Data Science', category: 'tech', url: 'https://vk.com/data_science', enabled: true, relatedJobs: ['data_scientist', 'machine_learning_engineer', 'devops_engineer'] },
        { id: 'ml_ai_bigdata', name: 'ML & AI & BigData', category: 'tech', url: 'https://vk.com/ml_ai_bigdata', enabled: true, relatedJobs: ['machine_learning_engineer', 'data_scientist', 'sound_engineer'] },
        { id: 'physics_math', name: 'Физика и математика', category: 'education', url: 'https://vk.com/physics_math', enabled: true, relatedJobs: ['data_scientist', 'therapist'] },
        
        // Design & Creative
        { id: 'designpub', name: 'Дизайн', category: 'design', url: 'https://vk.com/designpub', enabled: true, relatedJobs: ['ux_ui_designer', 'graphic_designer', 'animator'] },
        { id: 'web_design_club', name: 'Клуб веб-дизайнеров', category: 'design', url: 'https://vk.com/web_design_club', enabled: true, relatedJobs: ['web_designer', 'backend_developer'] },
        { id: 'artists_ru', name: 'Художники России', category: 'creative', url: 'https://vk.com/artists_ru', enabled: true, relatedJobs: ['artist', 'seo_specialist'] },
        { id: 'photographers_ru', name: 'Фотографы России', category: 'creative', url: 'https://vk.com/photographers_ru', enabled: true, relatedJobs: ['photographer', 'chef'] },
        { id: 'phototech', name: 'Фототехника', category: 'creative', url: 'https://vk.com/phototech', enabled: true, relatedJobs: ['photographer', 'scientist'] },
        
        // Game Development
        { id: 'gamedev_ru', name: 'GameDev', category: 'tech', url: 'https://vk.com/gamedev_ru', enabled: true, relatedJobs: ['game_developer', 'cloud_architect'] },
        { id: 'game_dev_memes', name: 'GameDev Memes', category: 'tech', url: 'https://vk.com/game_dev_memes', enabled: true, relatedJobs: ['game_developer', 'product_manager'] },
        
        // Business & Management
        { id: 'vc_ru', name: 'VC.ru', category: 'business', url: 'https://vk.com/vc_ru', enabled: true, relatedJobs: ['product_manager', 'project_manager', 'social_worker'] },
        { id: 'startup_vc', name: 'Startup VC', category: 'business', url: 'https://vk.com/startup_vc', enabled: true, relatedJobs: ['product_manager', 'hr_manager'] },
        { id: 'startup_club', name: 'Startup Club', category: 'business', url: 'https://vk.com/startup_club', enabled: true, relatedJobs: ['product_manager', 'teacher'] },
        
        // Marketing & SMM
        { id: 'smmrussia', name: 'SMM Russia', category: 'marketing', url: 'https://vk.com/smmrussia', enabled: true, relatedJobs: ['social_media_manager', 'digital_marketer'] },
        { id: 'smm_managers', name: 'SMM Менеджеры', category: 'marketing', url: 'https://vk.com/smm_managers', enabled: true, relatedJobs: ['social_media_manager', 'data_scientist'] },
        { id: 'digital_marketers', name: 'Digital Marketers', category: 'marketing', url: 'https://vk.com/digital_marketers', enabled: true, relatedJobs: ['digital_marketer', 'database_administrator'] },
        { id: 'seo_specialists', name: 'SEO Specialists', category: 'marketing', url: 'https://vk.com/seo_specialists', enabled: true, relatedJobs: ['seo_specialist', 'music_producer'] },
        { id: 'brand_managers', name: 'Brand Managers', category: 'marketing', url: 'https://vk.com/brand_managers', enabled: true, relatedJobs: ['brand_manager', 'sales_manager'] },
        { id: 'content_creators', name: 'Content Creators', category: 'marketing', url: 'https://vk.com/content_creators', enabled: true, relatedJobs: ['content_creator', 'fashion_designer'] },
        
        // Education & Learning
        { id: 'hexlet', name: 'Hexlet', category: 'education', url: 'https://vk.com/hexlet', enabled: true, relatedJobs: ['frontend_developer', 'backend_developer', 'scrum_master'] },
        { id: 'netology', name: 'Нетология', category: 'education', url: 'https://vk.com/netology', enabled: true, relatedJobs: ['frontend_developer', 'backend_developer', 'ux_ui_designer', 'data_scientist', 'researcher'] },
        { id: 'monsterlessons', name: 'MonsterLessons', category: 'education', url: 'https://vk.com/monsterlessons', enabled: true, relatedJobs: ['frontend_developer', 'qa_engineer'] },
        { id: 'education_community', name: 'Education Community', category: 'education', url: 'https://vk.com/education_community', enabled: true, relatedJobs: ['teacher', 'machine_learning_engineer'] },
        { id: 'teaching_jobs', name: 'Вакансии для учителей', category: 'education', url: 'https://vk.com/teaching_jobs', enabled: true, relatedJobs: ['teacher', 'ux_ui_designer', 'mathematician'] },
        { id: 'skillkit', name: 'SkillKit', category: 'education', url: 'https://vk.com/skillkit', enabled: true, relatedJobs: ['teacher', 'mobile_developer'] },
        
        // Security & Hacking
        { id: 'greyteam', name: 'Grey Team', category: 'tech', url: 'https://vk.com/greyteam', enabled: true, relatedJobs: ['security_engineer', 'penetration_tester', 'doctor'] },
        
        // Finance & Investment
        { id: 'investment_club', name: 'Investment Club', category: 'finance', url: 'https://vk.com/investment_club', enabled: true, relatedJobs: ['financial_analyst', 'investment_banker', 'barista'] },
        { id: 'excel_finance', name: 'Excel & Finance', category: 'finance', url: 'https://vk.com/excel_finance', enabled: true, relatedJobs: ['financial_analyst', 'accountant', 'pharmacist'] },
        { id: 'accounting_club', name: 'Accounting Club', category: 'finance', url: 'https://vk.com/accounting_club', enabled: true, relatedJobs: ['accountant', 'interpreter'] },
        
        // HR & Recruitment
        { id: 'hr_tech', name: 'HR Tech', category: 'management', url: 'https://vk.com/hr_tech', enabled: true, relatedJobs: ['hr_manager', 'engineer'] },
        
        // Legal & Law
        { id: 'legal_jobs', name: 'Юридические вакансии', category: 'professional', url: 'https://vk.com/legal_jobs', enabled: true, relatedJobs: ['lawyer', 'financial_analyst', 'mathematician'] },
        { id: 'law_community', name: 'Law Community', category: 'professional', url: 'https://vk.com/law_community', enabled: true, relatedJobs: ['lawyer', 'digital_marketer'] },
        
        // Healthcare & Medical
        { id: 'medical_jobs', name: 'Медицинские вакансии', category: 'healthcare', url: 'https://vk.com/medical_jobs', enabled: true, relatedJobs: ['doctor', 'nurse', 'pharmacist', 'mathematician'] },
        { id: 'medical_community', name: 'Medical Community', category: 'healthcare', url: 'https://vk.com/medical_community', enabled: true, relatedJobs: ['doctor', 'security_engineer'] },
        
        // Construction & Architecture
        { id: 'construction_jobs', name: 'Construction Jobs', category: 'engineering', url: 'https://vk.com/construction_jobs', enabled: true, relatedJobs: ['construction_manager', 'civil_engineer', 'nurse'] },
        { id: 'construction_club', name: 'Construction Club', category: 'engineering', url: 'https://vk.com/construction_club', enabled: true, relatedJobs: ['construction_manager', 'industrial_designer'] },
        { id: 'architects_ru', name: 'Архитекторы России', category: 'engineering', url: 'https://vk.com/architects_ru', enabled: true, relatedJobs: ['architect', 'artist'] },
        
        // Logistics & Supply Chain
        { id: 'logistics_ru', name: 'Логистика России', category: 'management', url: 'https://vk.com/logistics_ru', enabled: true, relatedJobs: ['logistics_coordinator', 'supply_chain_manager', 'brand_manager'] },
        { id: 'supplychain', name: 'Supply Chain', category: 'management', url: 'https://vk.com/supplychain', enabled: true, relatedJobs: ['supply_chain_manager', 'designer'] },
        
        // Real Estate
        { id: 'real_estate_ru', name: 'Недвижимость России', category: 'service', url: 'https://vk.com/real_estate_ru', enabled: true, relatedJobs: ['real_estate_agent', 'property_manager', 'waiter'] },
        
        // Hospitality & Service
        { id: 'hotel_business', name: 'Hotel Business', category: 'service', url: 'https://vk.com/hotel_business', enabled: true, relatedJobs: ['hotel_manager', 'editor'] },
        { id: 'food_service', name: 'Food Service', category: 'service', url: 'https://vk.com/food_service', enabled: true, relatedJobs: ['chef', 'restaurant_manager', 'game_developer'] },
        { id: 'chef_ru', name: 'Шеф-повара России', category: 'service', url: 'https://vk.com/chef_ru', enabled: true, relatedJobs: ['chef', 'musician'] },
        
        // Media & Journalism
        { id: 'journalists_ru', name: 'Журналисты России', category: 'media', url: 'https://vk.com/journalists_ru', enabled: true, relatedJobs: ['journalist', 'marketing_manager'] },
        { id: 'writers_ru', name: 'Писатели России', category: 'media', url: 'https://vk.com/writers_ru', enabled: true, relatedJobs: ['copywriter', 'translator'] },
        { id: 'journal_kod', name: 'Журнал КОД', category: 'media', url: 'https://vk.com/journal_kod', enabled: true, relatedJobs: ['journalist', 'system_administrator'] },
        
        // Music & Sound
        { id: 'musicians_ru', name: 'Музыканты России', category: 'creative', url: 'https://vk.com/musicians_ru', enabled: true, relatedJobs: ['musician', 'architect'] },
        { id: 'soundtracks_for_coding', name: 'Soundtracks for Coding', category: 'creative', url: 'https://vk.com/soundtracks_for_coding', enabled: true, relatedJobs: ['sound_engineer', 'lawyer'] },
        
        // Programming Communities
        { id: 'codeforces', name: 'Codeforces', category: 'tech', url: 'https://vk.com/codeforces', enabled: true, relatedJobs: ['software_engineer', 'project_manager'] },
        { id: 'hash', name: 'Hash', category: 'tech', url: 'https://vk.com/hash', enabled: true, relatedJobs: ['software_engineer', 'content_creator'] },
        
        // Miscellaneous
        { id: 'itmozg', name: 'IT Мозг', category: 'tech', url: 'https://vk.com/itmozg', enabled: true, relatedJobs: ['it_manager', 'full_stack_developer'] },
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
        { id: 'startup', name: 'Стартапы', icon: '🚀' },
        { id: 'science', name: 'Наука', icon: '🔬' },
        { id: 'design', name: 'Дизайн', icon: '🎨' },
        { id: 'education', name: 'Образование', icon: '📚' },
        { id: 'general', name: 'Общее', icon: '📰' },
    ],
    
    // Категории вакансий для группировки
    jobCategories: [
        { id: 'tech', name: '💻 IT & Технологии', icon: '💻' },
        { id: 'design', name: '🎨 Дизайн', icon: '🎨' },
        { id: 'management', name: '👔 Менеджмент', icon: '👔' },
        { id: 'marketing', name: '📢 Маркетинг', icon: '📢' },
        { id: 'finance', name: '💰 Финансы', icon: '💰' },
        { id: 'healthcare', name: '🏥 Медицина', icon: '🏥' },
        { id: 'education', name: '📚 Образование', icon: '📚' },
        { id: 'media', name: '📺 Медиа', icon: '📺' },
        { id: 'service', name: '🛎️ Сервис', icon: '🛎️' },
        { id: 'engineering', name: '⚙️ Инженерия', icon: '⚙️' },
        { id: 'creative', name: '🎭 Творчество', icon: '🎭' },
        { id: 'other', name: '📋 Другое', icon: '📋' },
    ],

    // Типы вакансий для фильтрации VK групп (полный список из jobs_groups_updated.js)
    jobTypes: [
        // IT & Технологии
        { id: 'frontend_developer', name: 'Frontend разработчик', category: 'tech', keywords: ['frontend', 'react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'веб'] },
        { id: 'backend_developer', name: 'Backend разработчик', category: 'tech', keywords: ['backend', 'python', 'java', 'nodejs', 'php', 'golang', 'api', 'database', 'бэкенд'] },
        { id: 'full_stack_developer', name: 'Fullstack разработчик', category: 'tech', keywords: ['fullstack', 'full stack', 'javascript', 'python', 'react', 'nodejs'] },
        { id: 'mobile_developer', name: 'Mobile разработчик', category: 'tech', keywords: ['mobile', 'android', 'ios', 'react native', 'flutter', 'swift', 'kotlin', 'мобильный'] },
        { id: 'devops_engineer', name: 'DevOps инженер', category: 'tech', keywords: ['devops', 'docker', 'kubernetes', 'aws', 'ci/cd', 'jenkins', 'terraform'] },
        { id: 'qa_engineer', name: 'QA инженер', category: 'tech', keywords: ['qa', 'testing', 'тестирование', 'automation', 'selenium', 'cypress', 'тестировщик'] },
        { id: 'data_scientist', name: 'Data Scientist', category: 'tech', keywords: ['data science', 'data scientist', 'python', 'machine learning', 'pandas', 'tensorflow', 'данные'] },
        { id: 'machine_learning_engineer', name: 'ML инженер', category: 'tech', keywords: ['machine learning', 'ml', 'ai', 'tensorflow', 'pytorch', 'neural networks', 'искусственный интеллект'] },
        { id: 'system_administrator', name: 'Системный администратор', category: 'tech', keywords: ['sysadmin', 'администратор', 'system', 'linux', 'windows', 'server'] },
        { id: 'database_administrator', name: 'Администратор БД', category: 'tech', keywords: ['database', 'dba', 'sql', 'postgresql', 'mysql', 'база данных'] },
        { id: 'security_engineer', name: 'Инженер по безопасности', category: 'tech', keywords: ['security', 'безопасность', 'cybersecurity', 'penetration', 'infosec'] },
        { id: 'cloud_architect', name: 'Облачный архитектор', category: 'tech', keywords: ['cloud', 'aws', 'azure', 'gcp', 'облако', 'архитектор'] },
        { id: 'software_engineer', name: 'Инженер-программист', category: 'tech', keywords: ['software', 'programming', 'coding', 'разработка'] },
        { id: 'hardware_engineer', name: 'Инженер по железу', category: 'tech', keywords: ['hardware', 'железо', 'электроника'] },
        { id: 'network_engineer', name: 'Сетевой инженер', category: 'tech', keywords: ['network', 'сеть', 'cisco', 'routing'] },
        { id: 'it_manager', name: 'IT менеджер', category: 'tech', keywords: ['it manager', 'ит менеджер', 'технический директор'] },
        
        // Дизайн
        { id: 'ux_ui_designer', name: 'UI/UX дизайнер', category: 'design', keywords: ['ux', 'ui', 'design', 'дизайн', 'figma', 'sketch', 'designer'] },
        { id: 'graphic_designer', name: 'Графический дизайнер', category: 'design', keywords: ['graphic design', 'графический дизайн', 'photoshop', 'illustrator'] },
        { id: 'web_designer', name: 'Веб-дизайнер', category: 'design', keywords: ['web design', 'веб дизайн', 'сайт', 'интерфейс'] },
        { id: 'interior_designer', name: 'Дизайнер интерьера', category: 'design', keywords: ['interior', 'интерьер', 'дизайн помещений'] },
        { id: 'fashion_designer', name: 'Модельер', category: 'design', keywords: ['fashion', 'мода', 'одежда', 'стиль'] },
        { id: 'industrial_designer', name: 'Промышленный дизайнер', category: 'design', keywords: ['industrial design', 'промышленный дизайн', 'продукт'] },
        { id: 'brand_designer', name: 'Бренд-дизайнер', category: 'design', keywords: ['brand design', 'брендинг', 'логотип', 'фирменный стиль'] },
        
        // Менеджмент
        { id: 'product_manager', name: 'Product Manager', category: 'management', keywords: ['product manager', 'продукт', 'product', 'roadmap', 'analytics', 'agile'] },
        { id: 'project_manager', name: 'Project Manager', category: 'management', keywords: ['project manager', 'проект', 'pm', 'scrum', 'управление проектами'] },
        { id: 'sales_manager', name: 'Менеджер по продажам', category: 'management', keywords: ['sales', 'продажи', 'менеджер', 'клиенты'] },
        { id: 'hr_manager', name: 'HR менеджер', category: 'management', keywords: ['hr', 'кадры', 'персонал', 'рекрутинг'] },
        { id: 'operations_manager', name: 'Операционный менеджер', category: 'management', keywords: ['operations', 'операции', 'процессы'] },
        { id: 'retail_manager', name: 'Менеджер розницы', category: 'management', keywords: ['retail', 'розница', 'магазин', 'торговля'] },
        
        // Маркетинг
        { id: 'marketing_manager', name: 'Маркетинг менеджер', category: 'marketing', keywords: ['marketing', 'маркетинг', 'реклама', 'продвижение'] },
        { id: 'digital_marketer', name: 'Digital маркетолог', category: 'marketing', keywords: ['digital marketing', 'диджитал', 'интернет маркетинг', 'онлайн'] },
        { id: 'social_media_manager', name: 'SMM менеджер', category: 'marketing', keywords: ['smm', 'social media', 'соцсети', 'контент'] },
        { id: 'seo_specialist', name: 'SEO специалист', category: 'marketing', keywords: ['seo', 'поисковая оптимизация', 'google', 'yandex'] },
        { id: 'content_creator', name: 'Контент-мейкер', category: 'marketing', keywords: ['content', 'контент', 'создание контента', 'блогер'] },
        { id: 'brand_manager', name: 'Бренд менеджер', category: 'marketing', keywords: ['brand', 'бренд', 'торговая марка'] },
        
        // Финансы
        { id: 'financial_analyst', name: 'Финансовый аналитик', category: 'finance', keywords: ['financial analyst', 'финансы', 'аналитика', 'бюджет'] },
        { id: 'accountant', name: 'Бухгалтер', category: 'finance', keywords: ['accountant', 'бухгалтер', 'учет', 'отчетность'] },
        { id: 'investment_banker', name: 'Инвестиционный банкир', category: 'finance', keywords: ['investment', 'инвестиции', 'банк', 'финансы'] },
        
        // Медицина
        { id: 'doctor', name: 'Врач', category: 'healthcare', keywords: ['doctor', 'врач', 'медицина', 'лечение'] },
        { id: 'nurse', name: 'Медсестра', category: 'healthcare', keywords: ['nurse', 'медсестра', 'уход', 'пациент'] },
        { id: 'pharmacist', name: 'Фармацевт', category: 'healthcare', keywords: ['pharmacist', 'фармацевт', 'аптека', 'лекарства'] },
        { id: 'veterinarian', name: 'Ветеринар', category: 'healthcare', keywords: ['veterinarian', 'ветеринар', 'животные'] },
        { id: 'psychologist', name: 'Психолог', category: 'healthcare', keywords: ['psychologist', 'психолог', 'терапия', 'консультации'] },
        
        // Образование
        { id: 'teacher', name: 'Учитель', category: 'education', keywords: ['teacher', 'учитель', 'преподаватель', 'образование'] },
        { id: 'technical_writer', name: 'Технический писатель', category: 'education', keywords: ['technical writer', 'документация', 'техписатель'] },
        
        // Медиа и творчество
        { id: 'journalist', name: 'Журналист', category: 'media', keywords: ['journalist', 'журналист', 'новости', 'статьи'] },
        { id: 'photographer', name: 'Фотограф', category: 'creative', keywords: ['photographer', 'фотограф', 'фото', 'съемка'] },
        { id: 'video_editor', name: 'Видеомонтажер', category: 'creative', keywords: ['video editor', 'видеомонтаж', 'монтаж', 'видео'] },
        { id: 'animator', name: 'Аниматор', category: 'creative', keywords: ['animator', 'аниматор', 'анимация', 'мультипликация'] },
        { id: 'game_developer', name: 'Game Developer', category: 'tech', keywords: ['game', 'gamedev', 'unity', 'unreal', 'game development', 'игры'] },
        
        // Сервис
        { id: 'customer_service', name: 'Служба поддержки', category: 'service', keywords: ['customer service', 'поддержка', 'клиенты', 'help desk'] },
        { id: 'support_specialist', name: 'Специалист поддержки', category: 'service', keywords: ['support', 'поддержка', 'техподдержка'] },
        { id: 'sales_associate', name: 'Продавец-консультант', category: 'service', keywords: ['sales associate', 'продавец', 'консультант'] },
        
        // Другие популярные
        { id: 'business_analyst', name: 'Бизнес-аналитик', category: 'management', keywords: ['business analyst', 'бизнес аналитик', 'аналитика', 'процессы'] },
        { id: 'scrum_master', name: 'Scrum Master', category: 'management', keywords: ['scrum master', 'скрам', 'agile', 'команда'] },
        { id: 'consultant', name: 'Консультант', category: 'other', keywords: ['consultant', 'консультант', 'консалтинг', 'советы'] },
        { id: 'translator', name: 'Переводчик', category: 'other', keywords: ['translator', 'переводчик', 'перевод', 'языки'] },
        { id: 'copywriter', name: 'Копирайтер', category: 'marketing', keywords: ['copywriter', 'копирайтер', 'тексты', 'контент'] },
        { id: 'editor', name: 'Редактор', category: 'media', keywords: ['editor', 'редактор', 'правка', 'тексты'] },
        
        // Дополнительные дизайн специальности
        { id: 'package_designer', name: 'Дизайнер упаковки', category: 'design', keywords: ['package design', 'упаковка', 'packaging'] },
        { id: 'environmental_designer', name: 'Дизайнер среды', category: 'design', keywords: ['environmental design', 'среда', 'пространство'] },
        { id: 'game_designer', name: 'Геймдизайнер', category: 'design', keywords: ['game design', 'геймдизайн', 'игровой дизайн'] },
        { id: 'art_director', name: 'Арт-директор', category: 'design', keywords: ['art director', 'арт директор', 'творческий директор'] },
        { id: 'creative_director', name: 'Креативный директор', category: 'design', keywords: ['creative director', 'креативный директор', 'креатив'] },
        { id: 'illustrator', name: 'Иллюстратор', category: 'creative', keywords: ['illustrator', 'иллюстратор', 'рисунок', 'иллюстрация'] },
        { id: 'photo_editor', name: 'Фоторедактор', category: 'creative', keywords: ['photo editor', 'фоторедактор', 'обработка фото'] },
        
        // Инженерные специальности
        { id: 'civil_engineer', name: 'Инженер-строитель', category: 'engineering', keywords: ['civil engineer', 'строительство', 'инженер строитель'] },
        { id: 'mechanical_engineer', name: 'Инженер-механик', category: 'engineering', keywords: ['mechanical engineer', 'механика', 'машиностроение'] },
        { id: 'electrical_engineer', name: 'Инженер-электрик', category: 'engineering', keywords: ['electrical engineer', 'электрика', 'электротехника'] },
        { id: 'chemical_engineer', name: 'Инженер-химик', category: 'engineering', keywords: ['chemical engineer', 'химия', 'химическая промышленность'] },
        { id: 'biomedical_engineer', name: 'Биомедицинский инженер', category: 'engineering', keywords: ['biomedical engineer', 'биомедицина', 'медтехника'] },
        { id: 'aerospace_engineer', name: 'Авиакосмический инженер', category: 'engineering', keywords: ['aerospace engineer', 'авиация', 'космос'] },
        { id: 'landscape_architect', name: 'Ландшафтный архитектор', category: 'engineering', keywords: ['landscape architect', 'ландшафт', 'архитектура'] },
        { id: 'urban_planner', name: 'Градостроитель', category: 'engineering', keywords: ['urban planner', 'градостроительство', 'планировка'] },
        { id: 'architect', name: 'Архитектор', category: 'engineering', keywords: ['architect', 'архитектор', 'проектирование', 'здания'] },
        { id: 'engineer', name: 'Инженер', category: 'engineering', keywords: ['engineer', 'инженер', 'техника', 'технологии'] },
        
        // IT руководящие должности
        { id: 'cto', name: 'CTO', category: 'management', keywords: ['cto', 'chief technology officer', 'технический директор'] },
        { id: 'cio', name: 'CIO', category: 'management', keywords: ['cio', 'chief information officer', 'информационный директор'] },
        { id: 'vp_of_engineering', name: 'VP Engineering', category: 'management', keywords: ['vp engineering', 'вице президент разработки'] },
        { id: 'vp_of_product', name: 'VP Product', category: 'management', keywords: ['vp product', 'вице президент продукта'] },
        
        // Высшее руководство
        { id: 'ceo', name: 'CEO', category: 'management', keywords: ['ceo', 'chief executive officer', 'генеральный директор'] },
        { id: 'coo', name: 'COO', category: 'management', keywords: ['coo', 'chief operating officer', 'операционный директор'] },
        { id: 'cfo', name: 'CFO', category: 'finance', keywords: ['cfo', 'chief financial officer', 'финансовый директор'] },
        { id: 'vp_of_marketing', name: 'VP Marketing', category: 'marketing', keywords: ['vp marketing', 'вице президент маркетинга'] },
        { id: 'vp_of_sales', name: 'VP Sales', category: 'management', keywords: ['vp sales', 'вице президент продаж'] },
        { id: 'director_of_operations', name: 'Директор по операциям', category: 'management', keywords: ['director operations', 'директор операций'] },
        
        // Безопасность и аналитика
        { id: 'security_analyst', name: 'Аналитик безопасности', category: 'tech', keywords: ['security analyst', 'аналитик безопасности', 'кибербезопасность'] },
        { id: 'penetration_tester', name: 'Пентестер', category: 'tech', keywords: ['penetration tester', 'пентест', 'тестирование безопасности'] },
        { id: 'ethical_hacker', name: 'Этичный хакер', category: 'tech', keywords: ['ethical hacker', 'белый хакер', 'информационная безопасность'] },
        { id: 'analyst', name: 'Аналитик', category: 'other', keywords: ['analyst', 'аналитик', 'анализ', 'исследования'] },
        { id: 'researcher', name: 'Исследователь', category: 'other', keywords: ['researcher', 'исследователь', 'наука', 'исследования'] },
        { id: 'scientist', name: 'Ученый', category: 'other', keywords: ['scientist', 'ученый', 'наука', 'научная деятельность'] },
        
        // Логистика и операции
        { id: 'supply_chain_manager', name: 'Менеджер цепи поставок', category: 'management', keywords: ['supply chain', 'логистика', 'поставки'] },
        { id: 'logistics_coordinator', name: 'Координатор логистики', category: 'management', keywords: ['logistics', 'логистика', 'координация'] },
        { id: 'warehouse_manager', name: 'Менеджер склада', category: 'management', keywords: ['warehouse', 'склад', 'складские операции'] },
        { id: 'quality_assurance_manager', name: 'Менеджер по качеству', category: 'management', keywords: ['quality assurance', 'контроль качества', 'qa менеджер'] },
        { id: 'compliance_officer', name: 'Офицер по соответствию', category: 'management', keywords: ['compliance', 'соответствие', 'регулирование'] },
        { id: 'risk_manager', name: 'Риск-менеджер', category: 'finance', keywords: ['risk manager', 'управление рисками', 'риски'] },
        
        // Финансовые специальности
        { id: 'financial_advisor', name: 'Финансовый консультант', category: 'finance', keywords: ['financial advisor', 'финансовый консультант', 'инвестиции'] },
        { id: 'insurance_agent', name: 'Страховой агент', category: 'finance', keywords: ['insurance', 'страхование', 'страховка'] },
        { id: 'real_estate_agent', name: 'Риелтор', category: 'service', keywords: ['real estate', 'недвижимость', 'риелтор'] },
        { id: 'property_manager', name: 'Управляющий недвижимостью', category: 'management', keywords: ['property manager', 'управление недвижимостью'] },
        
        // Строительство и ремонт
        { id: 'construction_manager', name: 'Менеджер строительства', category: 'engineering', keywords: ['construction manager', 'строительство', 'стройка'] },
        { id: 'electrician', name: 'Электрик', category: 'engineering', keywords: ['electrician', 'электрик', 'электромонтаж'] },
        { id: 'plumber', name: 'Сантехник', category: 'engineering', keywords: ['plumber', 'сантехник', 'водопровод'] },
        { id: 'carpenter', name: 'Плотник', category: 'engineering', keywords: ['carpenter', 'плотник', 'столяр'] },
        { id: 'mechanic', name: 'Механик', category: 'engineering', keywords: ['mechanic', 'механик', 'ремонт'] },
        { id: 'technician', name: 'Техник', category: 'engineering', keywords: ['technician', 'техник', 'обслуживание'] },
        
        // Обслуживание и безопасность
        { id: 'maintenance_worker', name: 'Рабочий по обслуживанию', category: 'service', keywords: ['maintenance', 'обслуживание', 'ремонт'] },
        { id: 'janitor', name: 'Уборщик', category: 'service', keywords: ['janitor', 'уборщик', 'клининг'] },
        { id: 'security_guard', name: 'Охранник', category: 'service', keywords: ['security guard', 'охранник', 'безопасность'] },
        
        // Транспорт
        { id: 'driver', name: 'Водитель', category: 'service', keywords: ['driver', 'водитель', 'вождение'] },
        { id: 'delivery_person', name: 'Курьер', category: 'service', keywords: ['delivery', 'курьер', 'доставка'] },
        { id: 'pilot', name: 'Пилот', category: 'service', keywords: ['pilot', 'пилот', 'авиация'] },
        { id: 'flight_attendant', name: 'Стюардесса', category: 'service', keywords: ['flight attendant', 'стюардесса', 'бортпроводник'] },
        
        // Туризм и гостеприимство
        { id: 'travel_agent', name: 'Турагент', category: 'service', keywords: ['travel agent', 'турагент', 'туризм'] },
        { id: 'tour_guide', name: 'Гид', category: 'service', keywords: ['tour guide', 'гид', 'экскурсовод'] },
        { id: 'hotel_manager', name: 'Менеджер отеля', category: 'management', keywords: ['hotel manager', 'отель', 'гостиница'] },
        { id: 'restaurant_manager', name: 'Менеджер ресторана', category: 'management', keywords: ['restaurant manager', 'ресторан', 'общепит'] },
        { id: 'event_manager', name: 'Менеджер мероприятий', category: 'management', keywords: ['event manager', 'мероприятия', 'события'] },
        { id: 'event_coordinator', name: 'Координатор мероприятий', category: 'service', keywords: ['event coordinator', 'координатор мероприятий'] },
        { id: 'wedding_planner', name: 'Свадебный планировщик', category: 'service', keywords: ['wedding planner', 'свадебный планировщик', 'свадьба'] },
        
        // Фитнес и красота
        { id: 'personal_trainer', name: 'Персональный тренер', category: 'service', keywords: ['personal trainer', 'тренер', 'фитнес'] },
        { id: 'fitness_instructor', name: 'Инструктор фитнеса', category: 'service', keywords: ['fitness instructor', 'фитнес инструктор'] },
        { id: 'yoga_instructor', name: 'Инструктор йоги', category: 'service', keywords: ['yoga instructor', 'йога', 'инструктор йоги'] },
        { id: 'massage_therapist', name: 'Массажист', category: 'healthcare', keywords: ['massage therapist', 'массажист', 'массаж'] },
        { id: 'beautician', name: 'Косметолог', category: 'service', keywords: ['beautician', 'косметолог', 'красота'] },
        { id: 'hair_stylist', name: 'Парикмахер', category: 'service', keywords: ['hair stylist', 'парикмахер', 'стилист'] },
        { id: 'makeup_artist', name: 'Визажист', category: 'creative', keywords: ['makeup artist', 'визажист', 'макияж'] },
        { id: 'fashion_stylist', name: 'Стилист', category: 'creative', keywords: ['fashion stylist', 'стилист', 'мода'] },
        { id: 'personal_shopper', name: 'Персональный шоппер', category: 'service', keywords: ['personal shopper', 'шоппер', 'покупки'] },
        
        // Коучинг и развитие
        { id: 'life_coach', name: 'Лайф-коуч', category: 'service', keywords: ['life coach', 'лайф коуч', 'коучинг'] },
        { id: 'career_coach', name: 'Карьерный коуч', category: 'service', keywords: ['career coach', 'карьерный коуч', 'карьера'] },
        { id: 'executive_coach', name: 'Бизнес-коуч', category: 'service', keywords: ['executive coach', 'бизнес коуч', 'руководство'] },
        { id: 'mentor', name: 'Ментор', category: 'education', keywords: ['mentor', 'ментор', 'наставник'] },
        { id: 'tutor', name: 'Репетитор', category: 'education', keywords: ['tutor', 'репетитор', 'обучение'] },
        
        // Библиотеки и культура
        { id: 'librarian', name: 'Библиотекарь', category: 'education', keywords: ['librarian', 'библиотекарь', 'библиотека'] },
        { id: 'museum_curator', name: 'Куратор музея', category: 'education', keywords: ['museum curator', 'куратор', 'музей'] },
        { id: 'archivist', name: 'Архивариус', category: 'education', keywords: ['archivist', 'архивариус', 'архив'] },
        
        // Научные специальности
        { id: 'historian', name: 'Историк', category: 'education', keywords: ['historian', 'историк', 'история'] },
        { id: 'anthropologist', name: 'Антрополог', category: 'other', keywords: ['anthropologist', 'антрополог', 'антропология'] },
        { id: 'sociologist', name: 'Социолог', category: 'other', keywords: ['sociologist', 'социолог', 'социология'] },
        { id: 'political_scientist', name: 'Политолог', category: 'other', keywords: ['political scientist', 'политолог', 'политология'] },
        { id: 'economist', name: 'Экономист', category: 'finance', keywords: ['economist', 'экономист', 'экономика'] },
        { id: 'statistician', name: 'Статистик', category: 'other', keywords: ['statistician', 'статистик', 'статистика'] },
        { id: 'mathematician', name: 'Математик', category: 'other', keywords: ['mathematician', 'математик', 'математика'] },
        
        // Медицинские специальности
        { id: 'therapist', name: 'Терапевт', category: 'healthcare', keywords: ['therapist', 'терапевт', 'лечение'] },
        { id: 'social_worker', name: 'Социальный работник', category: 'healthcare', keywords: ['social worker', 'социальный работник'] },
        
        // Общепит
        { id: 'chef', name: 'Шеф-повар', category: 'service', keywords: ['chef', 'повар', 'кулинария'] },
        { id: 'barista', name: 'Бариста', category: 'service', keywords: ['barista', 'бариста', 'кофе'] },
        { id: 'waiter', name: 'Официант', category: 'service', keywords: ['waiter', 'официант', 'обслуживание'] },
        
        // Переводчики и языки
        { id: 'interpreter', name: 'Устный переводчик', category: 'other', keywords: ['interpreter', 'устный переводчик', 'синхронист'] },
        
        // Творческие профессии
        { id: 'sound_engineer', name: 'Звукорежиссер', category: 'creative', keywords: ['sound engineer', 'звукорежиссер', 'звук'] },
        { id: 'music_producer', name: 'Музыкальный продюсер', category: 'creative', keywords: ['music producer', 'продюсер', 'музыка'] },
        { id: 'artist', name: 'Художник', category: 'creative', keywords: ['artist', 'художник', 'искусство'] },
        { id: 'musician', name: 'Музыкант', category: 'creative', keywords: ['musician', 'музыкант', 'музыка'] },
        { id: 'actor', name: 'Актер', category: 'creative', keywords: ['actor', 'актер', 'театр', 'кино'] },
        { id: 'director', name: 'Режиссер', category: 'creative', keywords: ['director', 'режиссер', 'кино', 'театр'] },
        { id: 'producer', name: 'Продюсер', category: 'creative', keywords: ['producer', 'продюсер', 'производство'] },
        { id: 'screenwriter', name: 'Сценарист', category: 'creative', keywords: ['screenwriter', 'сценарист', 'сценарий'] },
        { id: 'cinematographer', name: 'Оператор', category: 'creative', keywords: ['cinematographer', 'оператор', 'съемка'] },
    ],
    
    // API ключи и токены
    api: {
        vkServiceToken: 'b497266db497266db497266d25b7ac2746bb497b497266ddc4a0f620a0b8b417e9dc4aa',
        vkApiVersion: '5.131',
        vkAppId: 54198571,
        vkRedirectUrl: 'https://finnpunk.github.io/NewsHub/',
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
        version: '2.1.6',
        maxArticles: 50,
        defaultUpdateFrequency: 3600000, // 1 час
    }
};

export default CONFIG;
