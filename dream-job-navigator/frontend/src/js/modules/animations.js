/**
 * Модуль для анимаций появления элементов - ИСПРАВЛЕННАЯ ВЕРСИЯ
 */
export class Animations {
  constructor() {
    this.observer = null;
    this.animatedElements = [];
    this.numbersAnimated = new Set(); // Чтобы числа анимировались только один раз
    this.init();
  }

  init() {
    this.setupObserver();
    this.prepareElements();
    this.observeElements();
  }

  setupObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => this.handleIntersection(entry));
    }, options);
  }

  prepareElements() {
    // Находим все элементы для анимации
    this.animatedElements = document.querySelectorAll(
      '.audience-card, .timeline-item, .result-card, .partner-card, .important-card'
    );

    // Подготавливаем начальное состояние
    this.animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
  }

  observeElements() {
    // Наблюдаем за основными элементами
    this.animatedElements.forEach(el => this.observer.observe(el));

    // Отдельно обрабатываем числовые результаты
    document.querySelectorAll('.result-number').forEach(el => {
      this.observer.observe(el);
    });
  }

  handleIntersection(entry) {
    if (entry.isIntersecting) {
      const element = entry.target;

      // Анимация появления
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';

      // Анимация чисел для результатов
      if (element.classList.contains('result-number') && !this.numbersAnimated.has(element)) {
        this.animateNumber(element);
        this.numbersAnimated.add(element);
      }

      // Дополнительные эффекты для разных типов элементов
      this.addSpecialEffects(element);

      // Отключаем наблюдение после анимации
      this.observer.unobserve(element);
    }
  }

  animateNumber(element) {
    const target = parseInt(element.textContent.replace(/\D/g, '')) || 0;
    if (target === 0) return;

    // Сохраняем оригинальный текст для суффикса
    const originalText = element.textContent;
    const suffix = originalText.includes('+') ? '+' : '';

    // ИСПРАВЛЕНИЕ: Создаем внутренний span для анимации
    const animatedSpan = document.createElement('span');
    animatedSpan.style.display = 'inline-block';
    animatedSpan.style.minWidth = element.offsetWidth + 'px';
    animatedSpan.textContent = '0' + suffix;

    // Очищаем элемент и добавляем span
    element.textContent = '';
    element.appendChild(animatedSpan);

    // Запускаем анимацию
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        animatedSpan.textContent = target.toLocaleString() + suffix;

        // Добавляем эффект завершения
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
        }, 200);
      } else {
        animatedSpan.textContent = Math.floor(current).toLocaleString() + suffix;
      }
    }, 16);
  }

  addSpecialEffects(element) {
    // Эффект для элементов таймлайна
    if (element.classList.contains('timeline-item')) {
      this.animateTimelineItem(element);
    }

    // Эффект для результатов
    if (element.classList.contains('result-card')) {
      this.addResultEffect(element);
    }
  }

  animateTimelineItem(item) {
    const dot = item.querySelector('.timeline-dot');
    const content = item.querySelector('.timeline-content');

    if (dot) {
      // Анимация точки с задержкой
      setTimeout(() => {
        dot.style.transform = 'scale(1.2)';
        dot.style.backgroundColor = 'var(--primary-blue)';

        setTimeout(() => {
          dot.style.transform = 'scale(1)';
        }, 200);
      }, 300);
    }

    if (content) {
      // Подсветка контента
      setTimeout(() => {
        content.style.background = 'rgba(162, 203, 244, 0.15)';

        setTimeout(() => {
          content.style.background = 'rgba(162, 203, 244, 0.1)';
        }, 1000);
      }, 500);
    }
  }

  addResultEffect(result) {
    const icon = result.querySelector('.result-icon, .result-number');

    if (icon && !icon.classList.contains('result-number')) {
      // Пульсирующий эффект только для иконок (не для чисел)
      setTimeout(() => {
        icon.style.animation = 'pulse 1s ease';
      }, 300);

      icon.addEventListener('animationend', () => {
        icon.style.animation = '';
      });
    }
  }

  // Метод для добавления анимации к новым элементам (для динамического контента)
  observeNewElement(element) {
    if (this.observer) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      this.observer.observe(element);
    }
  }

  // Метод для ручного запуска анимации элемента
  animateElement(element, delay = 0) {
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      this.addSpecialEffects(element);
    }, delay);
  }

  // Метод для анимации группы элементов с интервалом
  animateSequence(elements, interval = 100) {
    elements.forEach((element, index) => {
      this.animateElement(element, index * interval);
    });
  }

  // Обработка изменения размера окна
  handleResize() {
    // Переустанавливаем наблюдение для элементов, которые могли измениться
    this.animatedElements.forEach(el => {
      if (el.style.opacity === '0') {
        this.observer.observe(el);
      }
    });
  }

  // Метод для паузы всех анимаций (полезно для тестирования)
  pauseAnimations() {
    document.body.style.setProperty('--animation-play-state', 'paused');
  }

  // Метод для возобновления анимаций
  resumeAnimations() {
    document.body.style.setProperty('--animation-play-state', 'running');
  }

  // Полная очистка
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.animatedElements = [];
    this.numbersAnimated.clear();
  }
}