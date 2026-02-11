// Storage
const STORAGE_KEY = "vibe-calendar-multi-events";

function storageAvailable() {
    try {
        const test = "__test__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch { return false; }
}

function getEvents() {
    if (!storageAvailable()) return {};
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function saveEvents(events) {
    if (!storageAvailable()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// Calendar render
const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");

const modal = document.getElementById("eventModal");
const modalDateEl = document.getElementById("modalDate");
const eventsListEl = document.getElementById("eventsList");
const newEventEl = document.getElementById("newEvent");
const addEventBtn = document.getElementById("addEventBtn");
const closeModalBtn = document.getElementById("closeModal");

let events = getEvents();
let selectedDate = null;

function renderCalendar() {
    calendarEl.innerHTML = "";
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    monthYearEl.textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const key = `${year}-${month + 1}-${day}`;
        const cell = document.createElement("div");
        cell.className = "day";
        cell.innerHTML = `<small>${day}</small>`;

        if (events[key]) {
            events[key].forEach(ev => {
                const evEl = document.createElement("div");
                evEl.className = "event";
                evEl.textContent = ev;
                cell.appendChild(evEl);
            });
        }

        // Highlight today
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add("today");
        }

        cell.onclick = () => openModal(key);
        calendarEl.appendChild(cell);
    }

}

// Modal logic
function openModal(dateKey) {
    selectedDate = dateKey;
    modalDateEl.textContent = dateKey;
    newEventEl.value = "";
    renderEventsList();
    modal.classList.remove("hidden");
}

function renderEventsList() {
    eventsListEl.innerHTML = "";
    const dayEvents = events[selectedDate] || [];
    dayEvents.forEach((ev, i) => {
        const li = document.createElement("li");
        li.textContent = ev;
        li.onclick = () => { // delete on tap
            dayEvents.splice(i, 1);
            if (dayEvents.length === 0) delete events[selectedDate];
            else events[selectedDate] = dayEvents;
            saveEvents(events);
            renderEventsList();
            renderCalendar();
        };
        eventsListEl.appendChild(li);
    });
}

addEventBtn.onclick = () => {
    const text = newEventEl.value.trim();
    if (text === "") return;
    if (!events[selectedDate]) events[selectedDate] = [];
    events[selectedDate].push(text);
    saveEvents(events);
    renderEventsList();
    renderCalendar();
    newEventEl.value = "";
};

closeModalBtn.onclick = () => {
    modal.classList.add("hidden");
};

window.addEventListener("DOMContentLoaded", renderCalendar);
