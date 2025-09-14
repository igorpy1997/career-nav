/**
 * Модуль для отображения прогресса скролла
 */
export class ScrollProgress {
  constructor() {
    this.progressBar = null;
    this.init();
  }

  init() {
    this.createProgressBar();
    this.bindEvents();
  }

  createProgressBar() {
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'scroll-progress';
    document.body.appendChild(this.progressBar);
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.updateProgress());
  }

  updateProgress() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;

    if (this.progressBar) {
      this.progressBar.style.width = `${scrolled}%`;
    }
  }

  destroy() {
    if (this.progressBar) {
      this.progressBar.remove();
    }
    window.removeEventListener('scroll', this.updateProgress);
  }
}