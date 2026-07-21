// Обработка формы
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        message: formData.get('message')
    };
    
    // Валидация
    if (!data.name || !data.email || !data.phone) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    // Здесь будет отправка данных на сервер
    // Пока просто показываем сообщение об успехе
    console.log('Данные формы:', data);
    
    // Скрываем форму и показываем сообщение об успехе
    this.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    
    // Сохраняем лид в localStorage (для демо)
    saveLead(data);
});

// Сохранение лида (временное решение)
function saveLead(data) {
    let leads = JSON.parse(localStorage.getItem('fero_leads') || '[]');
    leads.push({
        ...data,
        date: new Date().toISOString()
    });
    localStorage.setItem('fero_leads', JSON.stringify(leads));
}

// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Маска для телефона
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value[0] === '7' || value[0] === '8') {
            value = value.substring(1);
        }
        let formatted = '+7';
        if (value.length > 0) formatted += ' (' + value.substring(0, 3);
        if (value.length >= 3) formatted += ') ' + value.substring(3, 6);
        if (value.length >= 6) formatted += '-' + value.substring(6, 8);
        if (value.length >= 8) formatted += '-' + value.substring(8, 10);
        e.target.value = formatted;
    }
});