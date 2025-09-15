/**
 * Модуль для анимаций в секции Hero - ИСПРАВЛЕННАЯ ВЕРСИЯ БЕЗ МИГАНИЯ
 */
export class HeroAnimations {
  constructor() {
    this.heroElement = null;
    this.animationStarted = false;
    this.init();
  }

  init() {
    this.heroElement = document.querySelector('.hero');
    if (this.heroElement) {
      // Убираем автоматическую анимацию, так как она теперь в CSS
      this.addInteractivity();
      this.setupParallax();
    }
  }

  addInteractivity() {
    const buttons = this.heroElement.querySelectorAll('.btn');

    buttons.forEach(button => {
      button.addEventListener('mouseenter', this.handleButtonHover.bind(this));
      button.addEventListener('mouseleave', this.handleButtonLeave.bind(this));
    });
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

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.3;

      if (scrolled < window.innerHeight) {
        bgImage.style.transform = `translateY(${parallax}px)`;
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  // Метод для ручного запуска анимации (если нужен)
  startAnimation() {
    if (this.animationStarted) return;

    // Анимация уже определена в CSS, поэтому здесь ничего не делаем
    this.animationStarted = true;
  }

  // Метод для сброса анимации
  resetAnimation() {
    const elements = [
      '.title-uk',
      '.title-en',
      '.hero-subtitle',
      '.hero-description p',
      '.hero-actions'
    ];

    elements.forEach(selector => {
      const element = this.heroElement.querySelector(selector);
      if (element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = null;
      }
    });

    this.animationStarted = false;
  }

  destroy() {
    const buttons = this.heroElement?.querySelectorAll('.btn');
    buttons?.forEach(button => {
      button.removeEventListener('mouseenter', this.handleButtonHover);
      button.removeEventListener('mouseleave', this.handleButtonLeave);
    });

    // Удаляем обработчик скролла для параллакса
    window.removeEventListener('scroll', this.updateParallax);
  }
}