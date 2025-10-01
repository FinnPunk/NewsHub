// Enhanced Color System для NewsHub
// На основе color_design.png с улучшенной палитрой

const colorTokens = {
  // Primary Colors (основные)
  primary: {
    orange: {
      50: '#FFF7F5',
      100: '#FFEBE6',
      200: '#FFD4CC',
      300: '#FFB8AA',
      400: '#FF9C88',
      500: '#FF6B47', // Основной цвет
      600: '#E55A3A',
      700: '#CC4A2E',
      800: '#B33A22',
      900: '#993316',
      950: '#66220F'
    },
    mint: {
      50: '#F0FFFE',
      100: '#CCFFFD',
      200: '#99FFF9',
      300: '#66FFF6',
      400: '#33FFF2',
      500: '#4FD1C7', // Вторичный цвет
      600: '#3BAFA4',
      700: '#2A8D84',
      800: '#196B63',
      900: '#084942',
      950: '#052E29'
    },
    blue: {
      50: '#F0F7FF',
      100: '#E0EFFF',
      200: '#C3E2FF',
      300: '#A0D2FF',
      400: '#7DC2FF',
      500: '#4A90E2', // Акцентный цвет
      600: '#3A7BC7',
      700: '#2A66AC',
      800: '#1A5091',
      900: '#0A3A76',
      950: '#052449'
    }
  },

  // Semantic Colors (семантические)
  semantic: {
    success: {
      light: '#4FD1C7',
      main: '#3BAFA4',
      dark: '#2A8D84'
    },
    warning: {
      light: '#FFB74D',
      main: '#FF9800',
      dark: '#E65100'
    },
    error: {
      light: '#EF5350',
      main: '#F44336',
      dark: '#C62828'
    },
    info: {
      light: '#4A90E2',
      main: '#2196F3',
      dark: '#1565C0'
    }
  },

  // Neutral Colors (нейтральные)
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#0D0D0D',
    1000: '#000000'
  },

  // Background Colors (фоновые)
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.6)',
    blur: 'rgba(255, 255, 255, 0.8)'
  },

  // Text Colors (текстовые)
  text: {
    primary: '#212121',
    secondary: '#616161',
    tertiary: '#9E9E9E',
    inverse: '#FFFFFF',
    disabled: '#BDBDBD'
  },

  // Border Colors (границы)
  border: {
    light: '#F0F0F0',
    medium: '#E0E0E0',
    dark: '#BDBDBD',
    focus: '#FF6B47',
    hover: '#4A90E2'
  },

  // Gradients (градиенты)
  gradients: {
    primary: 'linear-gradient(135deg, #FF6B47 0%, #4FD1C7 50%, #4A90E2 100%)',
    secondary: 'linear-gradient(135deg, #4FD1C7 0%, #4A90E2 50%, #FF6B47 100%)',
    surface: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    card: 'linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)',
    button: 'linear-gradient(135deg, #FF6B47 0%, #E55A3A 100%)',
    dock: 'linear-gradient(135deg, rgba(255, 107, 71, 0.95) 0%, rgba(79, 209, 199, 0.9) 50%, rgba(74, 144, 226, 0.95) 100%)'
  },

  // Shadows (тени)
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
    large: '0 8px 32px rgba(255, 107, 71, 0.2)',
    card: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',
    dock: '0 8px 32px rgba(255, 107, 71, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)',
    elevated: '0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)'
  }
};

// Функция для генерации CSS переменных
export const generateCSSVariables = () => {
  const root = document.documentElement;
  const variables = {};

  // Генерируем переменные для каждого цветового токена
  Object.entries(colorTokens).forEach(([category, colors]) => {
    Object.entries(colors).forEach(([name, colorData]) => {
      if (typeof colorData === 'object') {
        Object.entries(colorData).forEach(([shade, color]) => {
          variables[`--${category}-${name}-${shade}`] = color;
        });
      } else {
        variables[`--${category}-${name}`] = colorData;
      }
    });
  });

  // Устанавливаем CSS переменные
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

// Функция для получения цвета с прозрачностью
export const getColorWithOpacity = (color, opacity) => {
  // Если цвет в формате hex, конвертируем в rgba
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Если уже rgba, заменяем прозрачность
  if (color.startsWith('rgba')) {
    return color.replace(/[\d\.]+\)$/g, `${opacity})`);
  }

  return color;
};

// Темная тема
export const darkThemeColors = {
  background: {
    primary: '#0D0D0D',
    secondary: '#1A1A1A',
    tertiary: '#2A2A2A',
    elevated: '#1A1A1A',
    overlay: 'rgba(0, 0, 0, 0.8)',
    blur: 'rgba(0, 0, 0, 0.6)'
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#BDBDBD',
    tertiary: '#757575',
    inverse: '#0D0D0D',
    disabled: '#616161'
  },

  border: {
    light: '#2A2A2A',
    medium: '#424242',
    dark: '#616161',
    focus: '#FF6B47',
    hover: '#4A90E2'
  },

  gradients: {
    primary: 'linear-gradient(135deg, #FF6B47 0%, #4FD1C7 50%, #4A90E2 100%)',
    surface: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    card: 'linear-gradient(145deg, #1A1A1A 0%, #0D0D0D 100%)'
  }
};

// Функция применения темы
export const applyTheme = (theme = 'light') => {
  const root = document.documentElement;

  if (theme === 'dark') {
    Object.entries(darkThemeColors).forEach(([category, colors]) => {
      Object.entries(colors).forEach(([name, value]) => {
        root.style.setProperty(`--${category}-${name}`, value);
      });
    });
  } else {
    generateCSSVariables();
  }

  // Сохраняем тему в localStorage
  localStorage.setItem('newshub_theme', theme);
};

// Функция получения сохраненной темы
export const getSavedTheme = () => {
  return localStorage.getItem('newshub_theme') || 'light';
};

// Автоматическое переключение темы по времени
export const setupAutoTheme = () => {
  const checkTime = () => {
    const hour = new Date().getHours();
    const shouldBeDark = hour >= 20 || hour <= 6;

    if (shouldBeDark && getSavedTheme() === 'light') {
      applyTheme('dark');
    } else if (!shouldBeDark && getSavedTheme() === 'dark') {
      applyTheme('light');
    }
  };

  // Проверяем каждые 30 минут
  setInterval(checkTime, 30 * 60 * 1000);
  checkTime(); // Проверяем сразу
};

// Экспорт цветовых токенов
export default colorTokens;
