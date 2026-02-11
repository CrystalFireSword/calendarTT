let currentNav = 0;
let events = JSON.parse(localStorage.getItem('events')) || {};
let selectedDate = null;

const calendarDays = document.getElementById('calendarDays');
const monthDisplay = document.getElementById('monthDisplay');
const eventModal = document.getElementById('eventModal');
const eventInput = document.getElementById('eventInput');

function loadCalendar() {
    const dt = new Date();
    if (currentNav !== 0) dt.setMonth(new Date().getMonth() + currentNav);

    const month = dt.getMonth();
    const year = dt.getFullYear();
    
    monthDisplay.innerText = dt.toLocaleDateString('en-us', { month: 'long', year: 'numeric' });

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', { weekday: 'long' });
    const paddingDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dateString);

    calendarDays.innerHTML = '';

    for (let i = 0; i < paddingDays; i++) {
        const paddingSquare = document.createElement('div');
        paddingSquare.classList.add('day-card');
        paddingSquare.style.cursor = 'default';
        calendarDays.appendChild(paddingSquare);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day-card');
        
        const dayString = `${month + 1}/${i}/${year}`;
        daySquare.innerHTML = `<span class="date-num">${i}</span>`;

        if (events[dayString]) {
            // RENDER EVENT NAME TEXT HERE
            events[dayString].forEach(ev => {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event-text');
                eventDiv.innerText = ev;
                daySquare.appendChild(eventDiv);
            });
        }
        
        daySquare.onclick = () => {
            selectedDate = dayString;
            eventModal.style.display = 'block';
        };

        calendarDays.appendChild(daySquare);
    }
}

// Event Handlers
document.getElementById('saveEvent').onclick = () => {
    if (eventInput.value) {
        if (!events[selectedDate]) events[selectedDate] = [];
        events[selectedDate].push(eventInput.value);
        localStorage.setItem('events', JSON.stringify(events));
        eventInput.value = '';
        eventModal.style.display = 'none';
        loadCalendar();
    }
};

document.getElementById('prevMonth').onclick = () => { currentNav--; loadCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentNav++; loadCalendar(); };
document.getElementById('closeModal').onclick = () => { eventModal.style.display = 'none'; };

// PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}

loadCalendar();