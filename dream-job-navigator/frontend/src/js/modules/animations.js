/**
 * Модуль для анимаций появления элементов
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
      '.audience-card, .timeline-item, .result-item, .partner-item, .important-card'
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

    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    // Сохраняем оригинальный текст для суффикса
    const originalText = element.textContent;
    const suffix = originalText.includes('+') ? '+' : '';

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        element.textContent = target + suffix;
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }

  addSpecialEffects(element) {
    // Эффект для карточек аудитории
    if (element.classList.contains('audience-card')) {
      this.addHoverEffect(element);
    }

    // Эффект для элементов таймлайна
    if (element.classList.contains('timeline-item')) {
      this.animateTimelineItem(element);
    }

    // Эффект для партнеров
    if (element.classList.contains('partner-item')) {
      this.animatePartnerLogo(element);
    }

    // Эффект для результатов
    if (element.classList.contains('result-item')) {
      this.addResultEffect(element);
    }
  }

  addHoverEffect(card) {
    const cardNumber = card.querySelector('.card-number');

    card.addEventListener('mouseenter', () => {
      if (cardNumber) {
        cardNumber.style.animation = 'rotate 0.5s ease';
      }
      card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
      if (cardNumber) {
        cardNumber.style.animation = '';
      }
      card.style.transform = 'translateY(0)';
    });

    // Очищаем анимацию после завершения
    if (cardNumber) {
      cardNumber.addEventListener('animationend', () => {
        cardNumber.style.animation = '';
      });
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

  animatePartnerLogo(partner) {
    const logo = partner.querySelector('.partner-logo');

    if (logo) {
      // Эффект "поднятия" логотипа
      setTimeout(() => {
        logo.style.transform = 'translateY(-5px)';
        logo.style.transition = 'transform 0.3s ease';

        setTimeout(() => {
          logo.style.transform = 'translateY(0)';
        }, 300);
      }, 200);
    }

    // Добавляем эффект при наведении
    partner.addEventListener('mouseenter', () => {
      partner.style.transform = 'translateY(-5px) scale(1.02)';
    });

    partner.addEventListener('mouseleave', () => {
      partner.style.transform = 'translateY(0) scale(1)';
    });
  }

  addResultEffect(result) {
    const icon = result.querySelector('.result-icon, .result-number');

    if (icon) {
      // Пульсирующий эффект для иконок/чисел
      setTimeout(() => {
        icon.style.animation = 'pulse 1s ease';
      }, 300);

      icon.addEventListener('animationend', () => {
        icon.style.animation = '';
      });
    }

    // Эффект при наведении
    result.addEventListener('mouseenter', () => {
      result.style.transform = 'scale(1.05)';
      result.style.boxShadow = '0 10px 30px rgba(162, 203, 244, 0.2)';
    });

    result.addEventListener('mouseleave', () => {
      result.style.transform = 'scale(1)';
      result.style.boxShadow = '';
    });
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

    // Удаляем обработчики событий
    document.querySelectorAll('.audience-card, .partner-item, .result-item').forEach(el => {
      el.replaceWith(el.cloneNode(true));
    });
  }
}