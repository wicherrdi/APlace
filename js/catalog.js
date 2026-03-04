// js/catalog.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Catalog script loaded');
    
    // Данные мест
    const placesData = [
        {
            id: 1,
            name: 'Кофейня "Сойка"',
            category: 'cafe',
            district: 'kirov',
            rating: 4.8,
            reviews: 124,
            image: 'images/m1.webp',
            description: 'Уютное место в центре города с лучшим кофе и домашней выпечкой. Идеально для работы и встреч с друзьями.',
            address: 'ул. Ленина, 2',
            hours: '08:00 - 22:00'
        },
        {
            id: 2,
            name: 'Парк Театральный',
            category: 'park',
            district: 'lenin',
            rating: 4.5,
            reviews: 216,
            image: 'images/m2.webp',
            description: 'Современный парк культуры и отдыха в Астрахани, расположенный рядом с Астраханским театром оперы и балета..',
            address: 'ул. Академика Королева',
            hours: 'круглосуточно'
        },
        {
            id: 3,
            name: 'Кафе "Крем cafe"',
            category: 'cafe',
            district: 'kirov',
            rating: 4.9,
            reviews: 203,
            image: 'images/m3.jpeg',
            description: 'Европейская кухня от шеф-повара. Уютная атмосфера и отличное обслуживание.',
            address: 'ул. Урицкого, 3',
            hours: '12:00 - 00:00'
        }
    ];

    const placesContainer = document.getElementById('placesContainer');
    const foundCount = document.getElementById('foundCount');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput'); // Добавьте поле поиска в HTML
    
    if (!placesContainer) {
        console.error('Не найден контейнер placesContainer');
        return;
    }
    
    // Функция создания карточки места
    function createPlaceCard(place) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4';
        
        const stars = '★'.repeat(Math.floor(place.rating)) + '☆'.repeat(5 - Math.floor(place.rating));
        const categoryName = place.category === 'cafe' ? 'Кафе' : 'Парк';
        
        col.innerHTML = `
            <div class="catalog-place-card">
                <img src="${place.image}" alt="${place.name}" class="place-image">
                <div class="catalog-place-content">
                    <!-- Строка 1: Категория -->
                    <span class="place-category-badge">${categoryName}</span>
                    
                    <!-- Строка 2: Название -->
                    <h3>${place.name}</h3>
                    
                    <!-- Строка 3: Рейтинг -->
                    <div class="place-rating-badge">${stars} ${place.rating}</div>
                    
                    <!-- Строка 4: Адрес -->
                    <div class="place-address">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${place.address}</span>
                    </div>
                    
                    <!-- Строка 5: Описание -->
                    <p class="place-description-short">${place.description}</p>
                    
                    <!-- Строка 6: Футер (только кнопка) -->
                    <div class="place-footer">
                        <a href="place.html?id=${place.id}" class="btn-view-details">Подробнее</a>
                    </div>
                    
                    <!-- Новая строка: Отзывы -->
                    <div class="place-reviews-bottom">
                        <span class="reviews-count">${place.reviews} отзывов</span>
                    </div>
                </div>
            </div>
        `;
        
        // Обработка ошибок загрузки изображений
        const img = col.querySelector('.place-image');
        img.onerror = function() {
            console.warn(`Не удалось загрузить изображение: ${place.image}`);
            this.src = 'images/placeholder.jpg';
            this.alt = 'Изображение не загружено';
        };
        
        return col;
    }
    
    // Функция сортировки
    function sortPlaces(places, sortBy) {
        const sorted = [...places];
        
        switch(sortBy) {
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'reviews':
                sorted.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // По умолчанию сортируем по рейтингу
                sorted.sort((a, b) => b.rating - a.rating);
        }
        
        return sorted;
    }
    
    // Функция отображения мест
    function renderPlaces(places = placesData) {
        console.log('Rendering places:', places.length);
        placesContainer.innerHTML = '';
        
        // Получаем тип сортировки
        const sortBy = sortSelect ? sortSelect.value : 'rating';
        
        // Сортируем места
        const sortedPlaces = sortPlaces(places, sortBy);
        
        if (sortedPlaces.length === 0) {
            placesContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h4>Места не найдены</h4>
                    <p>Попробуйте изменить параметры фильтрации</p>
                </div>
            `;
        } else {
            sortedPlaces.forEach(place => {
                const card = createPlaceCard(place);
                placesContainer.appendChild(card);
            });
        }
        
        if (foundCount) {
            foundCount.textContent = sortedPlaces.length;
        }
    }
    
    // Функция фильтрации
    function applyFilters() {
        console.log('Applying filters');
        
        let category = 'all';
        let district = 'all';
        let rating = 'all';
        let searchQuery = '';
        
        // Получаем выбранные значения
        const categoryRadios = document.getElementsByName('category');
        const districtRadios = document.getElementsByName('district');
        const ratingRadios = document.getElementsByName('rating');
        
        for (let radio of categoryRadios) {
            if (radio.checked) category = radio.value;
        }
        for (let radio of districtRadios) {
            if (radio.checked) district = radio.value;
        }
        for (let radio of ratingRadios) {
            if (radio.checked) rating = radio.value;
        }
        
        // Получаем поисковый запрос (если есть поле поиска)
        if (searchInput) {
            searchQuery = searchInput.value.toLowerCase().trim();
        }
        
        console.log('Filters:', {category, district, rating, searchQuery});
        
        // Фильтрация
        const filtered = placesData.filter(place => {
            // Фильтр по категории
            const categoryMatch = category === 'all' || place.category === category;
            
            // Фильтр по району
            const districtMatch = district === 'all' || place.district === district;
            
            // Фильтр по рейтингу (исправленная логика)
            let ratingMatch = true;
            if (rating !== 'all') {
                const ratingValue = parseFloat(rating);
                // Для значений 4, 3, 2 фильтруем >= rating
                if (ratingValue <= 4) {
                    ratingMatch = place.rating >= ratingValue;
                } 
                // Для значения 5 фильтруем >= 4.5 (как указано в интерфейсе "4.5+")
                else if (ratingValue === 5) {
                    ratingMatch = place.rating >= 4.5;
                }
            }
            
            // Фильтр по поиску (если есть запрос)
            let searchMatch = true;
            if (searchQuery) {
                searchMatch = 
                    place.name.toLowerCase().includes(searchQuery) ||
                    place.description.toLowerCase().includes(searchQuery) ||
                    place.address.toLowerCase().includes(searchQuery);
            }
            
            return categoryMatch && districtMatch && ratingMatch && searchMatch;
        });
        
        renderPlaces(filtered);
    }
    
    // Сброс фильтров
    function clearFilters() {
        console.log('Clearing filters');
        
        // Сбросить все радио-кнопки
        const catAll = document.getElementById('catAll');
        const distAll = document.getElementById('distAll');
        const ratingAll = document.getElementById('ratingAll');
        
        if (catAll) catAll.checked = true;
        if (distAll) distAll.checked = true;
        if (ratingAll) ratingAll.checked = true;
        
        // Сбросить поле поиска (если есть)
        if (searchInput) {
            searchInput.value = '';
        }
        
        renderPlaces(placesData);
    }
    
    // Инициализация
    renderPlaces();
    
    // Навешиваем обработчики
    const applyBtn = document.getElementById('applyFilters');
    const clearBtn = document.getElementById('clearFilters');
    
    // Проверяем, существуют ли элементы
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    } else {
        console.warn('Кнопка applyFilters не найдена');
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    } else {
        console.warn('Кнопка clearFilters не найдена');
    }
    
    // Обработчик сортировки
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    // Обработчик поиска (если есть поле поиска)
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Добавьте задержку для предотвращения множественных вызовов
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(applyFilters, 300);
        });
    }
    
    // Автоматическая фильтрация при изменении радио-кнопок
    const allFilterRadios = document.querySelectorAll('input[type="radio"][name="category"], input[type="radio"][name="district"], input[type="radio"][name="rating"]');
    allFilterRadios.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
});