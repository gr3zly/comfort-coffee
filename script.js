// Плавная прокрутка при нажатии на меню навигации
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Плавная прокрутка для кнопки "Смотреть меню"
const menuBtn = document.getElementById('menu-btn');
if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// Словарь соответствия блюд и фотографий
const dishToImageMap = {
    'espresso': 'espresso',
    'cappuccino': 'cappuccino',
    'latte': 'latte',
    'americano': 'americano',
    'kruassan': 'kruassan',
    'cheescake': 'cheescake',
    'avocado-tost': 'avocado-tost',
    'brown': 'brown'
};

// Функция для прокрутки к фото и подсветки
function scrollToPhotoAndHighlight(dishId) {
    // Находим элемент галереи с соответствующим data-dish
    const galleryItem = document.querySelector(`.gallery-item[data-dish="${dishId}"]`);
    
    if (galleryItem) {
        // Получаем позицию элемента
        const headerOffset = 80;
        const elementPosition = galleryItem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        // Плавно прокручиваем к фото
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Убираем подсветку со всех элементов
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.classList.remove('highlight');
        });
        
        // Добавляем подсветку текущему элементу
        galleryItem.classList.add('highlight');
        
        // Убираем подсветку через 2 секунды
        setTimeout(() => {
            galleryItem.classList.remove('highlight');
        }, 2000);
    } else {
        // Если фото не найдено, показываем уведомление
        showNotification(`Фотография для этого блюда скоро появится! 📸`, 'info');
    }
}

// Функция для автоматического переключения на нужную вкладку
function switchToCorrectTab(dishId) {
    // Список блюд из кофе
    const coffeeDishes = ['espresso', 'cappuccino', 'latte', 'americano'];
    // Список блюд из еды
    const foodDishes = ['kruassan', 'cheescake', 'avocado-tost', 'brown'];
    
    let targetTab = null;
    
    if (coffeeDishes.includes(dishId)) {
        targetTab = 'coffee';
    } else if (foodDishes.includes(dishId)) {
        targetTab = 'food';
    }
    
    if (targetTab) {
        const currentCoffeeDisplay = document.getElementById('coffee').style.display;
        const currentFoodDisplay = document.getElementById('food').style.display;
        
        // Проверяем, активна ли уже нужная вкладка
        const isCoffeeVisible = currentCoffeeDisplay !== 'none';
        const isFoodVisible = currentFoodDisplay !== 'none';
        
        if ((targetTab === 'coffee' && !isCoffeeVisible) || 
            (targetTab === 'food' && !isFoodVisible)) {
            // Переключаем вкладку
            showTab(targetTab);
        }
    }
}

// Переключение вкладок меню
function showTab(tabName) {
    // Скрыть все вкладки
    document.getElementById('coffee').style.display = 'none';
    document.getElementById('food').style.display = 'none';

    // Убрать активный класс у всех кнопок
    var buttons = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }

    // Показать нужную вкладку
    document.getElementById(tabName).style.display = 'block';

    // Найти нажатую кнопку и сделать её активной
    if (tabName === 'coffee') {
        buttons[0].classList.add('active');
    } else {
        buttons[1].classList.add('active');
    }
}

// Навесить обработчики на кнопки табов
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const tabName = this.getAttribute('data-tab');
        showTab(tabName);
    });
});

// Навесить обработчики на элементы меню
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function () {
        const dishId = this.getAttribute('data-dish');
        if (dishId) {
            // Сначала переключаемся на нужную вкладку, если необходимо
            switchToCorrectTab(dishId);
            
            // Небольшая задержка, чтобы вкладка успела переключиться
            setTimeout(() => {
                scrollToPhotoAndHighlight(dishId);
            }, 100);
        }
    });
});

// Функция показа уведомления
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    // Автоматически скрыть через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.className = 'notification';
            notification.textContent = '';
        }, 300);
    }, 3000);
}

// Валидация формы с всплывающим уведомлением
document.getElementById('feedback-form').addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value;
    var message = document.getElementById('message').value;
    var nameError = document.getElementById('name-error');
    var msgError = document.getElementById('msg-error');

    // Сбросить ошибки
    nameError.textContent = '';
    msgError.textContent = '';

    var isValid = true;

    if (name.trim() === '') {
        nameError.textContent = 'Введите ваше имя';
        isValid = false;
        showNotification('Пожалуйста, укажите ваше имя', 'error');
    } else if (message.trim() === '') {
        msgError.textContent = 'Напишите отзыв';
        isValid = false;
        showNotification('Пожалуйста, напишите ваш отзыв', 'error');
    }

    if (isValid) {
        showNotification(`Спасибо за отзыв, ${name}! ❤️`, 'success');
        document.getElementById('name').value = '';
        document.getElementById('message').value = '';
    }
});