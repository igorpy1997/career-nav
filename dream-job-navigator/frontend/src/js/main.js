/**
 * Главный файл приложения - ИСПРАВЛЕННАЯ ВЕРСИЯ
 */

// Импорты модулей
import { ScrollProgress } from './modules/scrollProgress.js';
import { Animations } from './modules/animations.js';
import { HeroAnimations } from './modules/heroAnimations.js';
import { Navigation } from './modules/navigation.js';
import { lazyLoadImages, isTouchDevice } from './utils/utils.js';

// Импорт стилей
import '../styles/main.scss';

/**
 * Основной класс приложения
 */
class App {
  constructor() {
    this.modules = {};
    this.init();
  }

  init() {
    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    console.log('🚀 Dream Job Navigator загружается...');

    // Инициализируем модули
    this.initModules();

    // Настраиваем общие обработчики
    this.setupGlobalHandlers();

    // Добавляем классы для стилизации
    this.setupDeviceClasses();

    console.log('✅ Приложение готово!');
  }

  initModules() {
    try {
      // Прогресс скролла
      this.modules.scrollProgress = new ScrollProgress();

      // Анимации появления (исправленные)
      this.modules.animations = new Animations();

      // Анимации Hero секции (исправленные)
      this.modules.heroAnimations = new HeroAnimations();

      // Навигация
      this.modules.navigation = new Navigation();

      // Lazy loading изображений
      this.lazyLoadImages();

    } catch (error) {
      console.error('Ошибка инициализации модулей:', error);
    }
  }

  setupGlobalHandlers() {
    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Обработка ошибок загрузки изображений
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        this.handleImageError(e.target);
      }
    }, true);

    // Улучшение доступности для клавиатурной навигации
    this.setupAccessibility();
  }

  setupDeviceClasses() {
    const body = document.body;

    // Добавляем класс для тач-устройств
    if (isTouchDevice()) {
      body.classList.add('touch-device');
    } else {
      body.classList.add('no-touch');
    }

    // Добавляем класс для типа устройства
    const width = window.innerWidth;
    if (width <= 768) {
      body.classList.add('mobile');
    } else if (width <= 968) {
      body.classList.add('tablet');
    } else {
      body.classList.add('desktop');
    }
  }

  handleResize() {
    // Обновляем классы устройств
    const body = document.body;
    body.classList.remove('mobile', 'tablet', 'desktop');

    const width = window.innerWidth;
    if (width <= 768) {
      body.classList.add('mobile');
    } else if (width <= 968) {
      body.classList.add('tablet');
    } else {
      body.classList.add('desktop');
    }

    // Уведомляем модули об изменении размера
    Object.values(this.modules).forEach(module => {
      if (typeof module.handleResize === 'function') {
        module.handleResize();
      }
    });
  }

  handleImageError(img) {
    // Заглушка для сломанных изображений
    img.style.display = 'none';
    console.warn('Не удалось загрузить изображение:', img.src);
  }

  setupAccessibility() {
    // Улучшение навигации с клавиатуры
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Пропуск к основному контенту
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Перейти к основному содержимому';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-blue);
      color: var(--dark);
      padding: 8px;
      border-radius: 4px;
      text-decoration: none;
      z-index: 10000;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Метод для уничтожения всех модулей (полезно для SPA)
  destroy() {
    Object.values(this.modules).forEach(module => {
      if (typeof module.destroy === 'function') {
        module.destroy();
      }
    });
    this.modules = {};
  }
}

// Создаем и запускаем приложение
const app = new App();

// Экспортируем для возможного использования в других модулях
export default app;