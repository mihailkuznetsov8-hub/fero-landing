// Липкая шапка при скролле
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
});

// Бургер-меню
document.querySelector('.burger').addEventListener('click', () => {
    header.classList.toggle('open');
});

// Закрытие меню при клике по ссылке
document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', () => header.classList.remove('open'));
});

// Плавное появление блоков при скролле
const io = new IntersectionObserver(es => {
    es.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
        }
    });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Плавная прокрутка к якорям (дублирует CSS scroll-behavior, но для надёжности)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});
