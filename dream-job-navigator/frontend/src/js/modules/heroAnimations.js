/**
 * Модуль для анимаций в секции Hero
 */
export class HeroAnimations {
  constructor() {
    this.heroElement = null;
    this.init();
  }

  init() {
    this.heroElement = document.querySelector('.hero');
    if (this.heroElement) {
      this.setupAnimations();
      this.addInteractivity();
    }
  }

  setupAnimations() {
    // Анимация появления элементов с задержкой
    const elements = [
      { selector: '.title-uk', delay: 0 },
      { selector: '.title-en', delay: 300 },
      { selector: '.hero-subtitle', delay: 600 },
      { selector: '.hero-description p:first-child', delay: 800 },
      { selector: '.hero-description p:last-child', delay: 1000 },
      { selector: '.hero-actions', delay: 1200 }
    ];

    elements.forEach(({ selector, delay }) => {
      const element = this.heroElement.querySelector(selector);
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';

        setTimeout(() => {
          element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, delay);
      }
    });
  }

  addInteractivity() {
    const buttons = this.heroElement.querySelectorAll('.btn');

    buttons.forEach(button => {
      button.addEventListener('mouseenter', this.handleButtonHover.bind(this));
      button.addEventListener('mouseleave', this.handleButtonLeave.bind(this));
    });

    // Parallax эффект для фонового изображения
    this.setupParallax();
  }

  handleButtonHover(event) {
    const button = event.target;
    button.style.transform = 'translateY(-3px) scale(1.05)';
  }

  handleButtonLeave(event) {
    const button = event.target;
    button.style.transform = '';
  }

  setupParallax() {
    const bgImage = this.heroElement.querySelector('.hero-bg-image');
    if (!bgImage) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.3;

      if (scrolled < window.innerHeight) {
        bgImage.style.transform = `translateY(${parallax}px)`;
      }
    });
  }

  destroy() {
    const buttons = this.heroElement?.querySelectorAll('.btn');
    buttons?.forEach(button => {
      button.removeEventListener('mouseenter', this.handleButtonHover);
      button.removeEventListener('mouseleave', this.handleButtonLeave);
    });
  }
}