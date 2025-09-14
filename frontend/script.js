// Simple scroll progress bar
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        document.body.appendChild(bar);
    } else {
        progressBar.style.width = scrolled + '%';
    }
});

// Simple intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Animate numbers
            if (entry.target.classList.contains('result-number')) {
                const target = parseInt(entry.target.textContent.replace('+', ''));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                        entry.target.textContent = target + '+';
                    } else {
                        entry.target.textContent = Math.floor(current) + '+';
                    }
                }, 16);
            }
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.audience-card, .timeline-item, .result-item, .partner-item, .important-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Observe result numbers
    document.querySelectorAll('.result-number').forEach(el => {
        observer.observe(el);
    });
});

