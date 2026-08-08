// Липкая шапка при скролле
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
});

// Бургер-меню
document.querySelector('.burger').addEventListener('click', () => {
    header.classList.toggle('open');
});
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

// Плавная прокрутка к якорям
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

// ===== Модальное окно новости =====
const modal = document.getElementById('news-modal');

function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // блокируем прокрутку фона
}
function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Открытие
document.querySelectorAll('[data-open-news]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
});
// Закрытие: крестик, подложка, CTA-ссылка
modal.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => closeModal());
});
// Закрытие по Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});
