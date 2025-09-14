/**
 * Модуль для навигации и плавной прокрутки
 */
export class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScroll();
    this.setupActiveSection();
  }

  setupSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        this.smoothScrollTo(targetElement);
      }
    });

    // Обработка кнопок в Hero секции
    const ctaButtons = document.querySelectorAll('.hero-actions .btn');
    ctaButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (index === 0) { // "Почати подорож"
          this.scrollToSection('.target-audience');
        } else { // "Дізнатися більше"
          this.scrollToSection('.why-important');
        }
      });
    });
  }

  setupActiveSection() {
    const sections = document.querySelectorAll('section[class]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveSection(entry.target.className.split(' ')[0]);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  smoothScrollTo(element) {
    const headerOffset = 80; // Отступ для header, если будет
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
      this.smoothScrollTo(element);
    }
  }

  updateActiveSection(sectionName) {
    // Можно добавить логику для обновления активного пункта навигации
    // если будет меню навигации
    console.log(`Active section: ${sectionName}`);
  }
}