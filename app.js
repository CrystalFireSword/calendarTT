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

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
    const paddingDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dateString.split(',')[0]);

    monthDisplay.innerText = dt.toLocaleDateString('en-us', { month: 'long', year: 'numeric' });
    calendarDays.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day-card');
        
        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays) {
            daySquare.innerHTML = `<span class="date-num">${i - paddingDays}</span>`;
            if (events[dayString]) {
                events[dayString].forEach(ev => {
                    const div = document.createElement('div');
                    div.classList.add('event-tag');
                    div.innerText = ev;
                    daySquare.appendChild(div);
                });
            }
            daySquare.onclick = () => {
                selectedDate = dayString;
                eventModal.style.display = 'block';
            };
        } else {
            daySquare.style.visibility = 'hidden';
        }
        calendarDays.appendChild(daySquare);
    }
}

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

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}

loadCalendar();