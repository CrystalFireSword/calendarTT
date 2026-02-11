let currentNav = 0;
let events = JSON.parse(localStorage.getItem('vibeEvents')) || {};
let selectedDate = null;
let chosenColor = '#bb86fc';

const daysEl = document.getElementById('calendarDays');
const monthDisplay = document.getElementById('monthDisplay');

function loadCalendar() {
    const dt = new Date();
    if (currentNav !== 0) dt.setMonth(new Date().getMonth() + currentNav);

    const month = dt.getMonth();
    const year = dt.getFullYear();
    monthDisplay.innerText = dt.toLocaleDateString('en-us', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    daysEl.innerHTML = '';

    // Add Padding Days
    for (let i = 0; i < firstDay; i++) {
        const p = document.createElement('div');
        p.className = 'day-card padding';
        daysEl.appendChild(p);
    }

    // Add Actual Days
    for (let d = 1; d <= daysInMonth; d++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'day-card';
        const dateKey = `${month + 1}/${d}/${year}`;
        
        daySquare.innerHTML = `<span class="date-num">${d}</span>`;

        if (events[dateKey]) {
            events[dateKey].forEach((ev, idx) => {
                const evDiv = document.createElement('div');
                evDiv.className = 'event-item';
                evDiv.innerText = ev.text;
                evDiv.style.backgroundColor = ev.color + '44';
                evDiv.style.borderLeftColor = ev.color;
                evDiv.onclick = (e) => {
                    e.stopPropagation();
                    if(confirm('Delete event?')) {
                        events[dateKey].splice(idx, 1);
                        if(events[dateKey].length === 0) delete events[dateKey];
                        localStorage.setItem('vibeEvents', JSON.stringify(events));
                        loadCalendar();
                    }
                };
                daySquare.appendChild(evDiv);
            });
        }

        daySquare.onclick = () => {
            selectedDate = dateKey;
            document.getElementById('eventModal').style.display = 'block';
        };
        daysEl.appendChild(daySquare);
    }
}

// Color Pickers
document.querySelectorAll('.color-opt').forEach(opt => {
    opt.onclick = () => {
        document.querySelectorAll('.color-opt').forEach(el => el.classList.remove('selected'));
        opt.classList.add('selected');
        chosenColor = opt.dataset.color;
    };
});

// Save Event
document.getElementById('saveEvent').onclick = () => {
    const val = document.getElementById('eventInput').value;
    if (val && selectedDate) {
        if (!events[selectedDate]) events[selectedDate] = [];
        events[selectedDate].push({ text: val, color: chosenColor });
        localStorage.setItem('vibeEvents', JSON.stringify(events));
        document.getElementById('eventInput').value = '';
        document.getElementById('eventModal').style.display = 'none';
        loadCalendar();
    }
};

document.getElementById('prevMonth').onclick = () => { currentNav--; loadCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentNav++; loadCalendar(); };
document.getElementById('closeModal').onclick = () => document.getElementById('eventModal').style.display = 'none';

// Initial Load
loadCalendar();