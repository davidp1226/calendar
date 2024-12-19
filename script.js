const calendarGrid = document.getElementById('calendar-grid');
const monthYear = document.getElementById('monthYear');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const eventModal = document.getElementById('eventModal');
const closeModal = document.querySelector('.close');
const saveEvent = document.getElementById('saveEvent');
const eventText = document.getElementById('eventText');
const eventsList = document.getElementById('eventsList');

let currentDate = new Date();
let events = {};
let editingDateKey = null;

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = date.toLocaleString('es', { month: 'long', year: 'numeric' }).toUpperCase();

    calendarGrid.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
        calendarGrid.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;

        const dateKey = `${year}-${month + 1}-${day}`;
        if (events[dateKey]) {
            dayElement.classList.add('event');
        }

        dayElement.addEventListener('click', () => openModal(dateKey));
        calendarGrid.appendChild(dayElement);
    }
    renderEvents();
}

function openModal(dateKey) {
    eventModal.style.display = 'flex';
    eventText.value = events[dateKey] || '';
    editingDateKey = dateKey;
}

function saveEventToCalendar() {
    const eventName = eventText.value.trim();
    if (eventName) {
        events[editingDateKey] = eventName;
        renderCalendar(currentDate);
    }
    closeModalWindow();
}

function deleteEvent(dateKey) {
    delete events[dateKey];
    renderCalendar(currentDate);
}

function editEvent(dateKey) {
    openModal(dateKey);
}

function renderEvents() {
    eventsList.innerHTML = '';
    const sortedEvents = Object.keys(events).sort();
    if (sortedEvents.length === 0) {
        eventsList.innerHTML = '<li>No events</li>';
        return;
    }

    sortedEvents.forEach(dateKey => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
        <span>${dateKey}: ${events[dateKey]}</span>
        <div class="buttons">
            <button class="edit-btn custom-btn" data-date="${dateKey}">Editar</button>
            <button class="delete-btn custom-btn" data-date="${dateKey}">Eliminar</button>
        </div>
    `;

        eventsList.appendChild(listItem);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => editEvent(button.dataset.date));
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => deleteEvent(button.dataset.date));
    });
}


function closeModalWindow() {
    eventModal.style.display = 'none';
    eventText.value = '';
    editingDateKey = null;
}

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

closeModal.addEventListener('click', closeModalWindow);

saveEvent.addEventListener('click', saveEventToCalendar);

window.onclick = (event) => {
    if (event.target === eventModal) {
        closeModalWindow();
    }
};

renderCalendar(currentDate);
