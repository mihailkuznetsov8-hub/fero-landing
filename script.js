// ===== Шапка: липкая при скролле =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
});

// ===== Бургер-меню =====
document.querySelector('.burger').addEventListener('click', () => {
    header.classList.toggle('open');
});
document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', () => header.classList.remove('open'));
});

// ===== Плавное появление блоков при скролле =====
const io = new IntersectionObserver(es => {
    es.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
        }
    });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Плавная прокрутка к якорям =====
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

// =====================================================
// ===== МОДАЛЬНОЕ ОКНО НОВОСТИ + ПАНЕЛЬ «ПОДЕЛИТЬСЯ» =====
// =====================================================
const modal = document.getElementById('news-modal');
const modalPanel = modal.querySelector('.modal-panel');
let currentNewsCard = null;

// Ссылка на конкретную новость: сайт.ру/#id-карточки
function getNewsUrl() {
    return location.origin + location.pathname + '#' + currentNewsCard.id;
}

// ----- Панель «Поделиться» (создаётся один раз) -----
const shareBar = document.createElement('div');
shareBar.className = 'share-bar';
shareBar.innerHTML = `
    <span>Поделиться:</span>
    <button class="share-btn" data-share="copy" type="button">Скопировать ссылку</button>
    <a class="share-btn" data-share="tg" target="_blank" rel="noopener">Telegram</a>
    <a class="share-btn" data-share="wa" target="_blank" rel="noopener">WhatsApp</a>
    <a class="share-btn" data-share="vk" target="_blank" rel="noopener">ВКонтакте</a>
`;

// Кнопка «Скопировать ссылку»
shareBar.querySelector('[data-share="copy"]').addEventListener('click', async function () {
    const url = getNewsUrl();
    try {
        await navigator.clipboard.writeText(url);
    } catch (e) {
        // Запасной вариант для старых браузеров
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }
    this.classList.add('copied');
    this.textContent = 'Скопировано!';
    setTimeout(() => {
        this.classList.remove('copied');
        this.textContent = 'Скопировать ссылку';
    }, 2000);
});

// Подставляем актуальные ссылки в кнопки соцсетей
function updateShareLinks() {
    const url = encodeURIComponent(getNewsUrl());
    const title = encodeURIComponent(currentNewsCard.querySelector('h3').textContent.trim() + ' — ФЕРО: оптовая продажа телефонов');
    shareBar.querySelector('[data-share="tg"]').href = 'https://t.me/share/url?url=' + url + '&text=' + title;
    shareBar.querySelector('[data-share="wa"]').href = 'https://wa.me/?text=' + title + '%0A' + url;
    shareBar.querySelector('[data-share="vk"]').href = 'https://vk.com/share.php?url=' + url;
}

// ----- Открытие модалки: контент берётся из <template> карточки -----
function openModal(card) {
    currentNewsCard = card;
    const template = card.querySelector('.news-full-content');
    if (template) {
        modalPanel.innerHTML = '';
        modalPanel.appendChild(template.content.cloneNode(true));

        // Кнопка-крестик (создаём заново, т.к. панель очищена)
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.setAttribute('data-close', '');
        closeBtn.setAttribute('aria-label', 'Закрыть');
        closeBtn.innerHTML = '✕';
        modalPanel.prepend(closeBtn);

        // Панель «Поделиться» в конец статьи
        modalPanel.appendChild(shareBar);
        updateShareLinks();

        // Закрытие: крестик и CTA-ссылки внутри контента
        modalPanel.querySelectorAll('[data-close]').forEach(el => {
            el.addEventListener('click', closeModal);
        });
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Клик по любой карточке новости открывает её модалку
document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', e => {
        if (e.target.closest('a[href^="#"]:not([data-close])')) return;
        e.preventDefault();
        openModal(card);
    });
});

// Закрытие по клику на тёмную подложку
modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

// Закрытие по Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// ----- Если пришли по ссылке на новость (например, из Telegram) -----
function openNewsFromHash() {
    const id = location.hash.replace('#', '');
    if (!id) return;
    const el = document.getElementById(id);
    if (el && el.classList.contains('news-card')) openModal(el);
}
window.addEventListener('load', openNewsFromHash);
