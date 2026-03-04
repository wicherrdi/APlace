// js/map.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Map script loaded');
    
    // Координаты Астрахани (центр города)
    const astrakhanCoords = [46.3497, 48.0408];
    
    // Инициализация карты
    const map = L.map('map').setView(astrakhanCoords, 13);
    
    // Добавление слоя OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Данные мест (согласно каталогу)
    const places = [
        {
            id: 1,
            name: 'Кофейня "Сойка"',
            category: 'cafe',
            coords: [46.3472, 48.0333], // Примерные координаты ул. Ленина, 2
            rating: 4.8,
            address: 'ул. Ленина, 2',
            description: 'Уютное место в центре города с лучшим кофе и домашней выпечкой. Идеально для работы и встреч с друзьями.',
            reviews: 124,
            image: 'images/m1.webp',
            hours: '08:00 - 22:00'
        },
        {
            id: 2,
            name: 'Парк Театральный',
            category: 'park',
            coords: [46.3582, 48.043], // Примерные координаты ул. Академика Королева
            rating: 4.5,
            address: 'ул. Академика Королева',
            description: 'Современный парк культуры и отдыха в Астрахани, расположенный рядом с Астраханским театром оперы и балета.',
            reviews: 216,
            image: 'images/m2.webp',
            hours: 'круглосуточно'
        },
        {
            id: 3,
            name: 'Кафе "Крем cafe"',
            category: 'cafe',
            coords: [46.3552, 48.0322], // Примерные координаты ул. Урицкого, 3
            rating: 4.9,
            address: 'ул. Урицкого, 3',
            description: 'Европейская кухня от шеф-повара. Уютная атмосфера и отличное обслуживание.',
            reviews: 203,
            image: 'images/m3.jpeg',
            hours: '12:00 - 00:00'
        }
    ];
    
    // Цвета маркеров по категориям
    const categoryColors = {
        cafe: '#ff6b35',
        park: '#4CAF50'
    };
    
    // Хранение маркеров
    const markers = {};
    let selectedMarker = null;
    
    // Функция создания иконки маркера
    function createMarkerIcon(category, isSelected = false) {
        const color = isSelected ? '#2196F3' : categoryColors[category] || '#333';
        
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                     <i class="fas fa-${category === 'cafe' ? 'coffee' : 'tree'}" style="color: white; font-size: 14px;"></i>
                   </div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
    }
    
    // Функция создания всплывающего окна
    function createPopupContent(place) {
        const stars = '★'.repeat(Math.floor(place.rating)) + '☆'.repeat(5 - Math.floor(place.rating));
        
        return `
            <div class="map-popup">
                <div class="popup-header">
                    <span class="popup-category ${place.category}">${place.category === 'cafe' ? 'Кафе' : 'Парк'}</span>
                    <span class="popup-rating">${stars} ${place.rating}</span>
                </div>
                <h4>${place.name}</h4>
                <div class="popup-address">
                    <i class="fas fa-map-marker-alt"></i> ${place.address}
                </div>
                <p class="popup-desc">${place.description}</p>
                <div class="popup-info">
                    <div class="popup-hours">
                        <i class="far fa-clock"></i> ${place.hours}
                    </div>
                    <div class="popup-reviews">
                        <i class="far fa-comment"></i> ${place.reviews} отзывов
                    </div>
                </div>
                <div class="popup-footer">
                    <a href="place.html?id=${place.id}" class="btn-popup-details">Подробнее</a>
                </div>
            </div>
        `;
    }
    
    // Добавление маркеров на карту
    places.forEach(place => {
        const marker = L.marker(place.coords, {
            icon: createMarkerIcon(place.category)
        }).addTo(map);
        
        // Добавление всплывающего окна
        marker.bindPopup(createPopupContent(place));
        
        // Сохранение маркера
        markers[place.id] = {
            marker: marker,
            place: place
        };
        
        // Клик по маркеру
        marker.on('click', function() {
            // Сброс предыдущего выбранного маркера
            if (selectedMarker) {
                selectedMarker.marker.setIcon(createMarkerIcon(selectedMarker.place.category));
            }
            
            // Выделение текущего маркера
            selectedMarker = markers[place.id];
            marker.setIcon(createMarkerIcon(place.category, true));
            
            // Прокрутка списка к соответствующему элементу
            scrollToListItem(place.id);
            
            // Обновление информации в списке
            updatePlaceListSelection(place.id);
        });
    });
    
    // Обновление HTML списка мест
    function updatePlaceList() {
        const placesList = document.getElementById('mapPlacesList');
        if (!placesList) return;
        
        placesList.innerHTML = '';
        
        places.forEach(place => {
            const stars = '★'.repeat(Math.floor(place.rating)) + '☆'.repeat(5 - Math.floor(place.rating));
            const categoryName = place.category === 'cafe' ? 'Кафе' : 'Парк';
            
            const item = document.createElement('div');
            item.className = 'place-list-item';
            item.dataset.placeId = place.id;
            
            item.innerHTML = `
                <div class="place-list-header">
                    <span class="place-list-category ${place.category}">${categoryName}</span>
                    <span class="place-list-rating">${stars} ${place.rating}</span>
                </div>
                <h4 class="place-list-title">${place.name}</h4>
                <p class="place-list-address">${place.address}</p>
                <p class="place-list-desc">${place.description}</p>
                <div class="place-list-info">
                    <span class="place-list-hours"><i class="far fa-clock"></i> ${place.hours}</span>
                    <span class="place-list-reviews"><i class="far fa-comment"></i> ${place.reviews} отзывов</span>
                </div>
                <button class="btn btn-view-on-map" data-marker-id="${place.id}">Показать на карте</button>
            `;
            
            placesList.appendChild(item);
        });
        
        // Добавляем обработчики для новых кнопок
        document.querySelectorAll('.btn-view-on-map').forEach(button => {
            button.addEventListener('click', function() {
                const markerId = parseInt(this.dataset.markerId);
                showMarkerOnMap(markerId);
            });
        });
        
        // Добавляем обработчики кликов по элементам списка
        document.querySelectorAll('.place-list-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.classList.contains('btn-view-on-map')) {
                    const placeId = parseInt(this.dataset.placeId);
                    showMarkerOnMap(placeId);
                }
            });
        });
    }
    
    // Показать маркер на карте
    function showMarkerOnMap(markerId) {
        const markerData = markers[markerId];
        
        if (markerData) {
            // Сброс предыдущего выбранного маркера
            if (selectedMarker) {
                selectedMarker.marker.setIcon(createMarkerIcon(selectedMarker.place.category));
            }
            
            // Выделение маркера
            selectedMarker = markerData;
            markerData.marker.setIcon(createMarkerIcon(markerData.place.category, true));
            
            // Открытие попапа
            markerData.marker.openPopup();
            
            // Центрирование карты на маркере
            map.setView(markerData.place.coords, 16);
            
            // Выделение в списке
            updatePlaceListSelection(markerId);
        }
    }
    
    // Обновление выделения в списке
    function updatePlaceListSelection(placeId) {
        document.querySelectorAll('.place-list-item').forEach(item => {
            item.classList.remove('selected');
            if (parseInt(item.dataset.placeId) === placeId) {
                item.classList.add('selected');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
    
    // Функция прокрутки к элементу списка
    function scrollToListItem(placeId) {
        const listItem = document.querySelector(`.place-list-item[data-place-id="${placeId}"]`);
        if (listItem) {
            listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Фильтрация на карте
    const categoryRadios = document.querySelectorAll('input[name="mapCategory"]');
    const searchInput = document.getElementById('mapSearchInput');
    
    function filterMapMarkers() {
        const selectedCategory = document.querySelector('input[name="mapCategory"]:checked').value;
        const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
        
        places.forEach(place => {
            const marker = markers[place.id];
            const shouldShow = 
                (selectedCategory === 'all' || place.category === selectedCategory) &&
                (place.name.toLowerCase().includes(searchQuery) || 
                 place.address.toLowerCase().includes(searchQuery) ||
                 place.description.toLowerCase().includes(searchQuery));
            
            if (shouldShow) {
                if (!map.hasLayer(marker.marker)) {
                    map.addLayer(marker.marker);
                }
            } else {
                if (map.hasLayer(marker.marker)) {
                    map.removeLayer(marker.marker);
                    
                    // Если скрываем выбранный маркер, сбрасываем выделение
                    if (selectedMarker && selectedMarker.place.id === place.id) {
                        selectedMarker = null;
                    }
                }
            }
        });
        
        // Фильтрация списка
        filterPlaceList();
    }
    
    function filterPlaceList() {
        const selectedCategory = document.querySelector('input[name="mapCategory"]:checked').value;
        const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
        
        document.querySelectorAll('.place-list-item').forEach(item => {
            const placeId = parseInt(item.dataset.placeId);
            const place = places.find(p => p.id === placeId);
            
            if (place) {
                const shouldShow = 
                    (selectedCategory === 'all' || place.category === selectedCategory) &&
                    (place.name.toLowerCase().includes(searchQuery) || 
                     place.address.toLowerCase().includes(searchQuery) ||
                     place.description.toLowerCase().includes(searchQuery));
                
                item.style.display = shouldShow ? 'block' : 'none';
            }
        });
    }
    
    // Обработчики событий фильтрации
    categoryRadios.forEach(radio => {
        radio.addEventListener('change', filterMapMarkers);
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(filterMapMarkers, 300);
        });
    }
    
    // Кнопка "Показать все маркеры"
    function fitToMarkers() {
        const visibleMarkers = places
            .filter(place => {
                const marker = markers[place.id];
                return marker && map.hasLayer(marker.marker);
            })
            .map(place => place.coords);
        
        if (visibleMarkers.length > 0) {
            const bounds = L.latLngBounds(visibleMarkers);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView(astrakhanCoords, 13);
        }
    }
    
    // Добавляем кнопку "Показать все" в HTML и обработчик
    const fitButton = document.createElement('button');
    fitButton.id = 'fitToMarkers';
    fitButton.className = 'btn btn-apply-filters mt-2';
    fitButton.textContent = 'Показать все места';
    fitButton.style.width = '100%';
    
    const filterGroup = document.querySelector('.filter-group:last-of-type');
    if (filterGroup) {
        filterGroup.parentNode.insertBefore(fitButton, filterGroup.nextSibling);
        fitButton.addEventListener('click', fitToMarkers);
    }
    
    // Инициализация списка мест
    updatePlaceList();
    
    // Показываем все маркеры при загрузке
    setTimeout(fitToMarkers, 500);
    
    console.log('Карта инициализирована с обновленными данными Астрахани');
});